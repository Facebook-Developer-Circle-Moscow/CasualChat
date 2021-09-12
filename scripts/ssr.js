const FS = require('fs');
const PATH = require('path');

const {createStore} = require('redux');
const {createElement: h} = require('react');
const {Provider} = require('react-redux');
const {StaticRouter} = require('react-router-dom');
const {minify: MINIFY_HTML} = require('html-minifier');
const serialize = require('serialize-javascript');
const {renderToStringAsync} = require('react-async-ssr');

const {initialState} = require('../build/server/store');
const {default: App} = require('../build/server/index');

const MetadataRendered = require('./metadata');

// Get static path
const STATIC = PATH.resolve(__dirname + '/../build');

const HTML = getFile(PATH.resolve(STATIC, 'static/index.html'));
const INLINE_STYLE = getFile(PATH.resolve(STATIC, 'static/inline.css'));
const INLINE_SCRIPT = getFile(PATH.resolve(STATIC, 'static/inline.js'));
const SVG = getFile(PATH.resolve(STATIC, 'static/sprite.svg'));

const MetadataExtractorRegExp = /<code.*?data-extract=['"]true['"].*?>(?<metadata>.*?)<\/code>/ig;

function getFile(path) {
  return FS.existsSync(path) ? FS.readFileSync(path, 'utf8') : '';
}

async function render({url, csrf}) {
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

async function ssr(url) {
  // Server side render
  const {result, store, context, metadata} = await render({
    csrf: '', // TODO
    url,
  });

  if (context.url) {
    throw new Error('302 redirect');
  } else {
    return MINIFY_HTML(
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
  }
}

module.exports = {
  ssr
};