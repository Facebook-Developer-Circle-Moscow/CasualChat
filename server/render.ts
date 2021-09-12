'use strict';

import * as FS from 'fs';
import * as PATH from 'path';
import {minify as MINIFY_HTML} from 'html-minifier';

// Get static path
const STATIC = PATH.resolve(__dirname + '/../build');

const HTML = getFile(PATH.resolve(STATIC, 'static/index.html'));
const INLINE_STYLE = getFile(PATH.resolve(STATIC, 'static/inline.css'));
const INLINE_SCRIPT = getFile(PATH.resolve(STATIC, 'static/inline.js'));
const SVG = getFile(PATH.resolve(STATIC, 'static/sprite.svg'));

import {default as App} from '../src/server';
import {initialState} from '../src/store';

// Get json serialize
import * as serialize from 'serialize-javascript';

// Import react decencies
import {createElement as h} from 'react';
// @ts-ignore
import {renderToStringAsync} from 'react-async-ssr';
import {StaticRouter} from 'react-router-dom';
import {createStore, Store} from 'redux';
import {Provider} from 'react-redux';
import * as core from "express-serve-static-core";
import {StaticRouterContext} from 'react-router';
import {Metadata} from 'models/metadata';

import MetadataRendered from './metadata';

const MetadataExtractorRegExp = /<code.*?data-extract=['"]true['"].*?>(?<metadata>.*?)<\/code>/ig;

function getFile(path: string): string {
  return FS.existsSync(path) ? FS.readFileSync(path, 'utf8') : '';
}

async function render({ url, csrf}: {url: string, csrf: string}): Promise<{
  result: string,
  store: Store,
  context: StaticRouterContext,
  metadata: Metadata;
}> {
  const context = {};

  const store = createStore((state) => JSON.parse(JSON.stringify(state)), {
    ...initialState,
    router: {
      ...initialState.router,
      csrf,
      location: url,
      modified: (new Date()).toISOString(),
    }
  });

  const result = await renderToStringAsync(
      h(
          Provider,
          {store},
          h(
              StaticRouter,
              {location: url, context},
              h(App)
          )
      )
  );

  const match = MetadataExtractorRegExp.exec(result);

  return {
    result: result.replace(MetadataExtractorRegExp, ''),
    store,
    context,
    metadata: match ? JSON.parse(match.groups.metadata) : {}
  };
}

// Export express subroutines
export default (APP: core.Express) => {
  // Use server side rendering as fallback for all routs
  APP.get('*', async (req, res) => {
    try {
      // Server side render
      const {result, store, context, metadata} = await render({
        csrf: req.csrfToken(),
        url: req.url.replace('index.html', '')
      });

      if (context.url) {
        // If context contains redirect, go ot it
        res.redirect(302, context.url);
      } else {
        // Render html
        const html = MINIFY_HTML(
            HTML
            .replace(/%META_TAGS%/ig, MetadataRendered(metadata))
            .replace(/%INLINE_STYLE%/ig, INLINE_STYLE)
            .replace(/%PRELOADED_STATE%/ig, serialize(store.getState()))
            .replace(/%INLINE_SCRIPT%/ig, INLINE_SCRIPT)
            .replace(/%SVG_SPRITE%/ig, SVG)
            .replace(/%APP%/ig, result),
            {
              removeComments: true,
              collapseWhitespace: true,
              collapseBooleanAttributes: true,
              removeAttributeQuotes: true,
              removeEmptyAttributes: true,
              minifyJS: true
            }
        );

        // Response rendered html
        res.set('content-type', 'text/html');
        res.send(html);
      }
    } catch (e) {
      console.log(e);

      res.writeHead(500);
      res.end();
    }
  });
};