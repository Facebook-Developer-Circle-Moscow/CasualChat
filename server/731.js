"use strict";
exports.id = 731;
exports.ids = [731];
exports.modules = {

/***/ 382:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 19:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.App = void 0;
var React = __webpack_require__(689);
var react_redux_1 = __webpack_require__(22);
var bem_cn_1 = __webpack_require__(592);
__webpack_require__(382);
var block = (0, bem_cn_1.block)('app');
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    App.prototype.componentDidMount = function () {
        var _a = this.props.metadata, title = _a.title, description = _a.description, keywords = _a.keywords, author = _a.author, images = _a.images, videos = _a.videos, audios = _a.audios;
        // Remove old meta
        [
            'title',
            'meta[name="description"]',
            'meta[name="keywords"]',
            'meta[name="author"]',
            'meta[property="og:title"]',
            'meta[property="og:description"]',
            'meta[property="og:image"]',
            'meta[property="og:image:type"]',
            'meta[property="og:image:width"]',
            'meta[property="og:image:height"]',
            'meta[property="og:image:alt"]',
            'meta[property="og:video"]',
            'meta[property="og:video:type"]',
            'meta[property="og:video:width"]',
            'meta[property="og:video:height"]',
            'meta[property="og:audios"]',
            'meta[property="og:audios:type"]',
        ].forEach(function (selector) { return Array.from(document.head.querySelectorAll(selector)).forEach(function (node) { return document.head.removeChild(node); }); });
        function addMeta(params) {
            var meta = document.createElement('meta');
            if (params.name) {
                meta.name = params.name;
            }
            if (params.content) {
                meta.content = params.content;
            }
            if (params.property) {
                meta.setAttribute('property', params.property);
            }
            if (params.lastModified) {
                meta.setAttribute('last-modified', params.lastModified);
            }
            document.head.appendChild(meta);
        }
        if (title) {
            var titleElement = document.createElement('title');
            titleElement.innerText = title;
            document.head.appendChild(titleElement);
        }
        if (description) {
            addMeta({ name: 'description', content: description });
        }
        if (keywords) {
            addMeta({ name: 'keywords', content: keywords });
        }
        if (author) {
            addMeta({ name: 'author', content: author.name });
        }
        if (title) {
            addMeta({ property: 'og:title', content: title });
        }
        if (description) {
            addMeta({ property: 'og:description', content: description });
        }
        if (images) {
            for (var _i = 0, images_1 = images; _i < images_1.length; _i++) {
                var _b = images_1[_i], src = _b.src, type = _b.type, width = _b.width, height = _b.height, alt = _b.alt;
                addMeta({ property: 'og:image', content: src });
                addMeta({ property: 'og:image:type', content: type });
                addMeta({ property: 'og:image:width', content: width });
                addMeta({ property: 'og:image:height', content: height });
                addMeta({ property: 'og:image:alt', content: alt });
            }
        }
        if (videos) {
            for (var _c = 0, videos_1 = videos; _c < videos_1.length; _c++) {
                var _d = videos_1[_c], src = _d.src, type = _d.type, width = _d.width, height = _d.height;
                addMeta({ property: 'og:video', content: src });
                addMeta({ property: 'og:video:type', content: type });
                addMeta({ property: 'og:video:width', content: width });
                addMeta({ property: 'og:video:height', content: height });
            }
        }
        if (audios) {
            for (var _e = 0, audios_1 = audios; _e < audios_1.length; _e++) {
                var _f = audios_1[_e], src = _f.src, type = _f.type;
                addMeta({ property: 'og:audios', content: src });
                addMeta({ property: 'og:audios:type', content: type });
            }
        }
    };
    App.prototype.render = function () {
        return (React.createElement("section", { className: block() },
            this.props.ssr ? React.createElement("code", { "data-extract": true, dangerouslySetInnerHTML: { __html: JSON.stringify(this.props.metadata) } }) : null,
            React.createElement("h1", null, this.props.metadata.h1)));
    };
    return App;
}(React.Component));
exports.App = App;
exports["default"] = (0, react_redux_1.connect)(function (state, ownProps) { return (__assign({}, ownProps)); }, function (dispatch) { return ({}); })(App);


/***/ }),

/***/ 576:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var React = __webpack_require__(689);
var App_1 = __webpack_require__(19);
var Context = React.createContext({
    title: 'Page Not Found',
    h1: 'Page Not Found'
});
function default_1(_a) {
    var ssr = _a.ssr;
    return (React.createElement(Context.Consumer, null, function (metadata) { return (React.createElement(App_1.default, { ssr: ssr, metadata: metadata })); }));
}
exports["default"] = default_1;


/***/ }),

/***/ 296:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var React = __webpack_require__(689);
var App_1 = __webpack_require__(19);
var Context = React.createContext({
    title: 'Pet project from Casual Chat video.',
    h1: 'CasualChat'
});
function default_1(_a) {
    var ssr = _a.ssr;
    return (React.createElement(Context.Consumer, null, function (metadata) { return (React.createElement(App_1.default, { ssr: ssr, metadata: metadata })); }));
}
exports["default"] = default_1;


/***/ })

};
;