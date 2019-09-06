/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./Javascript/Nodejs/googleParse/express/public/javascripts/main.js":
/*!**************************************************************************!*\
  !*** ./Javascript/Nodejs/googleParse/express/public/javascripts/main.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module build failed (from ./node_modules/babel-loader/lib/index.js):\nSyntaxError: D:\\Open Server\\OSPanel\\domains\\study\\Javascript\\Nodejs\\googleParse\\express\\public\\javascripts\\main.js: Unexpected token (112:26)\n\n\u001b[0m \u001b[90m 110 | \u001b[39m            sortDomains[domain]\u001b[33m.\u001b[39mforEach((item) \u001b[33m=>\u001b[39m {\u001b[0m\n\u001b[0m \u001b[90m 111 | \u001b[39m                \u001b[36mswitch\u001b[39m (item\u001b[33m.\u001b[39mposition) {\u001b[0m\n\u001b[0m\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m 112 | \u001b[39m                    \u001b[36mcase\u001b[39m (\u001b[33m<\u001b[39m\u001b[35m10\u001b[39m \u001b[33m&&\u001b[39m \u001b[33m>=\u001b[39m\u001b[35m5\u001b[39m)\u001b[33m:\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m     | \u001b[39m                          \u001b[31m\u001b[1m^\u001b[22m\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 113 | \u001b[39m                        top10 \u001b[33m+=\u001b[39m \u001b[35m1\u001b[39m\u001b[33m;\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 114 | \u001b[39m                        \u001b[36mbreak\u001b[39m\u001b[33m;\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 115 | \u001b[39m                    \u001b[36mcase\u001b[39m (\u001b[33m<\u001b[39m\u001b[35m5\u001b[39m \u001b[33m&&\u001b[39m \u001b[33m>=\u001b[39m\u001b[35m3\u001b[39m)\u001b[33m:\u001b[39m\u001b[0m\n    at Parser.raise (D:\\Open Server\\OSPanel\\domains\\study\\node_modules\\@babel\\parser\\lib\\index.js:6325:17)\n    at Parser.unexpected (D:\\Open Server\\OSPanel\\domains\\study\\node_modules\\@babel\\parser\\lib\\index.js:7642:16)\n    at Parser.parseExprAtom (D:\\Open Server\\OSPanel\\domains\\study\\node_modules\\@babel\\parser\\lib\\index.js:8841:20)\n    at Parser.parseExprSubscripts (D:\\Open Server\\OSPanel\\domains\\study\\node_modules\\@babel\\parser\\lib\\index.js:8412:23)\n    at Parser.parseMaybeUnary (D:\\Open Server\\OSPanel\\domains\\study\\node_modules\\@babel\\parser\\lib\\index.js:8392:21)\n    at Parser.parseExprOps (D:\\Open Server\\OSPanel\\domains\\study\\node_modules\\@babel\\parser\\lib\\index.js:8267:23)\n    at Parser.parseMaybeConditional (D:\\Open Server\\OSPanel\\domains\\study\\node_modules\\@babel\\parser\\lib\\index.js:8240:23)\n    at Parser.parseMaybeAssign (D:\\Open Server\\OSPanel\\domains\\study\\node_modules\\@babel\\parser\\lib\\index.js:8187:21)\n    at Parser.parseParenAndDistinguishExpression (D:\\Open Server\\OSPanel\\domains\\study\\node_modules\\@babel\\parser\\lib\\index.js:8978:28)\n    at Parser.parseExprAtom (D:\\Open Server\\OSPanel\\domains\\study\\node_modules\\@babel\\parser\\lib\\index.js:8762:21)\n    at Parser.parseExprSubscripts (D:\\Open Server\\OSPanel\\domains\\study\\node_modules\\@babel\\parser\\lib\\index.js:8412:23)\n    at Parser.parseMaybeUnary (D:\\Open Server\\OSPanel\\domains\\study\\node_modules\\@babel\\parser\\lib\\index.js:8392:21)\n    at Parser.parseExprOps (D:\\Open Server\\OSPanel\\domains\\study\\node_modules\\@babel\\parser\\lib\\index.js:8267:23)\n    at Parser.parseMaybeConditional (D:\\Open Server\\OSPanel\\domains\\study\\node_modules\\@babel\\parser\\lib\\index.js:8240:23)\n    at Parser.parseMaybeAssign (D:\\Open Server\\OSPanel\\domains\\study\\node_modules\\@babel\\parser\\lib\\index.js:8187:21)\n    at Parser.parseExpression (D:\\Open Server\\OSPanel\\domains\\study\\node_modules\\@babel\\parser\\lib\\index.js:8135:23)\n    at Parser.parseSwitchStatement (D:\\Open Server\\OSPanel\\domains\\study\\node_modules\\@babel\\parser\\lib\\index.js:10223:27)\n    at Parser.parseStatementContent (D:\\Open Server\\OSPanel\\domains\\study\\node_modules\\@babel\\parser\\lib\\index.js:9880:21)\n    at Parser.parseStatement (D:\\Open Server\\OSPanel\\domains\\study\\node_modules\\@babel\\parser\\lib\\index.js:9829:17)\n    at Parser.parseBlockOrModuleBlockBody (D:\\Open Server\\OSPanel\\domains\\study\\node_modules\\@babel\\parser\\lib\\index.js:10405:25)\n    at Parser.parseBlockBody (D:\\Open Server\\OSPanel\\domains\\study\\node_modules\\@babel\\parser\\lib\\index.js:10392:10)\n    at Parser.parseBlock (D:\\Open Server\\OSPanel\\domains\\study\\node_modules\\@babel\\parser\\lib\\index.js:10376:10)\n    at Parser.parseFunctionBody (D:\\Open Server\\OSPanel\\domains\\study\\node_modules\\@babel\\parser\\lib\\index.js:9424:24)\n    at Parser.parseArrowExpression (D:\\Open Server\\OSPanel\\domains\\study\\node_modules\\@babel\\parser\\lib\\index.js:9365:10)\n    at Parser.parseParenAndDistinguishExpression (D:\\Open Server\\OSPanel\\domains\\study\\node_modules\\@babel\\parser\\lib\\index.js:9002:12)\n    at Parser.parseExprAtom (D:\\Open Server\\OSPanel\\domains\\study\\node_modules\\@babel\\parser\\lib\\index.js:8762:21)\n    at Parser.parseExprSubscripts (D:\\Open Server\\OSPanel\\domains\\study\\node_modules\\@babel\\parser\\lib\\index.js:8412:23)\n    at Parser.parseMaybeUnary (D:\\Open Server\\OSPanel\\domains\\study\\node_modules\\@babel\\parser\\lib\\index.js:8392:21)\n    at Parser.parseExprOps (D:\\Open Server\\OSPanel\\domains\\study\\node_modules\\@babel\\parser\\lib\\index.js:8267:23)\n    at Parser.parseMaybeConditional (D:\\Open Server\\OSPanel\\domains\\study\\node_modules\\@babel\\parser\\lib\\index.js:8240:23)");

/***/ }),

/***/ "./Javascript/Nodejs/googleParse/express/public/stylesheets/style.scss":
/*!*****************************************************************************!*\
  !*** ./Javascript/Nodejs/googleParse/express/public/stylesheets/style.scss ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 0:
/*!******************************************************************************************************************************************************!*\
  !*** multi ./Javascript/Nodejs/googleParse/express/public/javascripts/main.js ./Javascript/Nodejs/googleParse/express/public/stylesheets/style.scss ***!
  \******************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./Javascript/Nodejs/googleParse/express/public/javascripts/main.js */"./Javascript/Nodejs/googleParse/express/public/javascripts/main.js");
module.exports = __webpack_require__(/*! ./Javascript/Nodejs/googleParse/express/public/stylesheets/style.scss */"./Javascript/Nodejs/googleParse/express/public/stylesheets/style.scss");


/***/ })

/******/ });
//# sourceMappingURL=scripts-bundled.js.map