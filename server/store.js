(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["CasualChat"] = factory();
	else
		root["CasualChat"] = factory();
})(global, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 640:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.updateLocation = exports.ActionTypes = void 0;
var ActionTypes;
(function (ActionTypes) {
    ActionTypes["UPDATE"] = "[ROUTER] UPDATE";
})(ActionTypes = exports.ActionTypes || (exports.ActionTypes = {}));
var updateLocation = function (location) { return ({
    type: ActionTypes.UPDATE,
    location: location
}); };
exports.updateLocation = updateLocation;


/***/ }),

/***/ 262:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.reducers = void 0;
var redux_1 = __webpack_require__(695);
var router_1 = __webpack_require__(187);
exports.reducers = (0, redux_1.combineReducers)({
    router: router_1.router,
});


/***/ }),

/***/ 187:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
exports.router = exports.initialState = void 0;
var router_1 = __webpack_require__(640);
exports.initialState = {
    location: '/',
    modified: ''
};
var router = function (state, action) {
    if (state === void 0) { state = exports.initialState; }
    switch (action.type) {
        case router_1.ActionTypes.UPDATE:
            return __assign(__assign({}, state), { location: action.location });
        default:
            return state;
    }
};
exports.router = router;


/***/ }),

/***/ 695:
/***/ ((module) => {

module.exports = require("redux");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createStore = exports.initialState = void 0;
var redux_1 = __webpack_require__(695);
var index_1 = __webpack_require__(262);
var router_1 = __webpack_require__(187);
exports.initialState = {
    router: router_1.initialState,
};
var createStore = function (state) {
    return (0, redux_1.createStore)(index_1.reducers, state,  false ? 0 : undefined);
};
exports.createStore = createStore;

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});