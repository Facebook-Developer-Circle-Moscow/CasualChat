// Get server env params
import {Socket} from "net";

import * as SERVER_SETTINGS from './server.config.json';

process.env.NODE_ENV = SERVER_SETTINGS.apps[0].env.NODE_ENV || 'production';

const PORTS = SERVER_SETTINGS.apps[0].ports;

// Get static path
const STATIC = __dirname + '/build';

// Import dependencies
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
import * as CSRF from 'csurf';

// Get express app
const APP = EXPRESS();

// Add compressing
APP.use(COMPRESSION());

// Add cookie processor
APP.use(COOKIE_PARSER());

// Add parsers for POST data
APP.use(BODY_PARSER.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit: 50000
}));

// Add parser for json body
APP.use(BODY_PARSER.json({
  limit: '50mb'
}));

// Add csrf token checker and generator
APP.use(CSRF({cookie: true}));

// Add gzip static file processing
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

// Add server site rendering
import Renderer from './server/render';

Renderer(APP);

// Set up port
APP.set('port', PORTS.main);

// Method for getting ssl certificates
function getCertificates() {
  const certificates = [
    {
      key: PATH.join(__dirname + '/server.key'),
      cert: PATH.join(__dirname + '/server.crt'),
    }
  ].filter((v) => FS.existsSync(v.key) && FS.existsSync(v.cert))[0];

  if (certificates) {
    return {
      key: FS.readFileSync(certificates.key),
      cert: FS.readFileSync(certificates.cert),
    };
  }
}

// Get certificates
const certificates = getCertificates();

// Check certificates
if (certificates) {
  // If we've any certificates

  // Set up http to http2 switcher
  NET.createServer((conn: Socket) => {
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

  // Set up http to https switcher
  HTTP.createServer(APP).listen(PORTS.http);

  // Start http2 server
  SPDY.createServer(certificates, APP).listen(PORTS.http2);
} else {
  // If we don't have any certificates
  // Set up http server
  HTTP.createServer(APP).listen(PORTS.http);
}
