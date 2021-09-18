import * as FS from 'fs';
import * as PATH from 'path';
import * as NET from 'net';
import * as HTTP from 'http';
import * as SPDY from 'spdy';
import * as EXPRESS from 'express';
import * as COOKIE_PARSER from 'cookie-parser';
import * as BODY_PARSER from 'body-parser';
import * as STATIC_GZIP from 'express-static-gzip';
import * as COMPRESSION from 'compression';
import * as SESSION from 'express-session';
import * as CSRF from 'csurf';

import * as SERVER_SETTINGS from './server.config.json';
import * as CONFIG from './config/config.secret.json';

process.env.NODE_ENV = SERVER_SETTINGS.apps[0].env.NODE_ENV || 'production';

const PORTS = SERVER_SETTINGS.apps[0].ports;

const STATIC = __dirname + '/build';

const certificates = [
  {
    key: PATH.join(__dirname + '/server.key'),
    cert: PATH.join(__dirname + '/server.crt'),
  }
].find(({key, cert}) => FS.existsSync(key) && FS.existsSync(cert));

const APP = EXPRESS();

APP.use(COMPRESSION());

APP.use(COOKIE_PARSER());

APP.use(BODY_PARSER.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit: 50000
}));

APP.use(BODY_PARSER.json({
  limit: '50mb'
}));

APP.use(SESSION({
  secret: CONFIG.session.secret
}));

APP.use(CSRF({cookie: true}));

APP.use(
    '/',
    STATIC_GZIP(
        STATIC,
        {
          enableBrotli: true,
          customCompressions: [
            {
              encodingName: 'deflate',
              fileExtension: 'deflate'
            },
            {
              encodingName: 'gzip',
              fileExtension: 'gz'
            },
            {
              encodingName: 'br',
              fileExtension: 'br'
            }
          ]
        }
    )
);

if (certificates) {
  APP.use('*', (req, res, next) => {
    if (!req.secure) {
      return res.redirect('https://' + req.headers.host + req.url);
    }

    next();
  });
}

import Renderer from './server/render';
import Passport from './server/passport';

Passport(APP);

APP.use('*', (req, res, next) => {
  if (!req.user && req.baseUrl !== '/login') {
    (req.session as any).returnTo = req.originalUrl;

    return res.redirect('/login');
  }

  next();
});

Renderer(APP);

APP.set('port', PORTS.main);

if (certificates) {
  NET.createServer((conn: NET.Socket) => {
    conn.once('data', (buf) => {
      const proxy = NET.createConnection(
          buf[0] === 22 ? PORTS.http2 : PORTS.http,
          () => {
            proxy.write(buf);
            conn.pipe(proxy).pipe(conn);
          }
      );
    });
  }).listen(PORTS.main);

  HTTP.createServer(APP).listen(PORTS.http);

  SPDY.createServer({
    key: FS.readFileSync(certificates.key),
    cert: FS.readFileSync(certificates.cert)
  }, APP).listen(PORTS.http2);
} else {
  HTTP.createServer(APP).listen(PORTS.http);
}
