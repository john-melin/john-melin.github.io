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
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/avif.js/avif.js":
/*!**************************************!*\
  !*** ./node_modules/avif.js/avif.js ***!
  \**************************************/
/*! exports provided: register, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"register\", function() { return register; });\n// Decode AVIF data using native browser's AV1 decoder.\nconst isEdge = navigator.userAgent.indexOf(\"Edge\") >= 0;\nfunction decodeMov(arr) {\n  const blob = new Blob([arr], {type: \"video/mp4\"});\n  const blobURL = URL.createObjectURL(blob);\n  return new Promise((resolve, reject) => {\n    const vid = document.createElement(\"video\");\n    vid.addEventListener(isEdge ? \"ended\" : \"loadeddata\", () => {\n      if ((vid.mozDecodedFrames == null ||\n           vid.mozDecodedFrames > 0)\n          &&\n          (vid.webkitDecodedFrameCount == null ||\n           vid.webkitDecodedFrameCount > 0)) {\n        resolve(vid);\n      } else {\n        reject(new Error(\"partial AV1 frame\"));\n      }\n    });\n    vid.addEventListener(\"error\", () => {\n      reject(new Error(\"cannot decode AV1 frame\"));\n    });\n    vid.muted = true;\n    vid.src = blobURL;\n    vid.play();\n  }).then(vid => {\n    const c = document.createElement(\"canvas\");\n    const ctx = c.getContext(\"2d\");\n    c.width = vid.videoWidth;\n    c.height = vid.videoHeight;\n    ctx.drawImage(vid, 0, 0, c.width, c.height);\n    const imgData = ctx.getImageData(0, 0, c.width, c.height);\n    return {\n      width: c.width,\n      height: c.height,\n      data: imgData.data.buffer,\n    }\n  }).then(res => {\n    URL.revokeObjectURL(blobURL);\n    return res;\n  }, err => {\n    URL.revokeObjectURL(blobURL);\n    throw err;\n  });\n}\n\n// Respond to job requests from worker.\nfunction handleMessage(e) {\n  const msg = e.data;\n  if (msg && msg.type === \"avif-mov\") {\n    decodeMov(msg.data).then(decoded => {\n      navigator.serviceWorker.controller.postMessage({\n        id: msg.id,\n        type: \"avif-rgba\",\n        ...decoded\n      }, [decoded.data]);\n    }, err => {\n      navigator.serviceWorker.controller.postMessage({\n        id: msg.id,\n        type: \"avif-error\",\n        data: err.message,\n      });\n    });\n  }\n}\n\nfunction hasAv1Support() {\n  const vid = document.createElement(\"video\");\n  return vid.canPlayType('video/mp4; codecs=\"av01.0.05M.08\"') === \"probably\";\n}\n\nfunction getServiceWorkerOpts({forcePolyfill, wasmURL}) {\n  const usePolyfill = forcePolyfill || !hasAv1Support();\n  return {usePolyfill, wasmURL};\n}\n\n// See https://redfin.engineering/how-to-fix-the-refresh-button-when-using-service-workers-a8e27af6df68\n// for the Service Worker update best practices.\nfunction register(regPromise = './avif-sw.js', opts) {\n  if (!(\"serviceWorker\" in navigator)) {\n    return Promise.reject(new Error(\"Service Worker API is not supported\"));\n  }\n\n  if (typeof opts === \"function\") {\n    opts = {confirmUpdate: opts};\n  }\n  opts = Object.assign({\n    confirmUpdate: () => true,\n    onUpdate: () => window.location.reload(),\n    wasmURL: \"/staic/js/dav1d.wasm\",\n    forcePolyfill: false,\n  }, opts);\n\n  if (typeof regPromise === \"string\") {\n    const regOpts = opts.scope ? {scope: opts.scope} : undefined;\n    regPromise = navigator.serviceWorker.register(regPromise, regOpts);\n  }\n  return regPromise.then(reg => {\n    let refreshing = false;\n    function refresh() {\n      if (refreshing) return;\n      refreshing = true;\n      opts.onUpdate(reg);\n    }\n    function promptUserToRefresh() {\n      Promise.resolve(opts.confirmUpdate(reg)).then(shouldUpdate => {\n        if (shouldUpdate) {\n          if (navigator.serviceWorker.controller) {\n            reg.waiting.postMessage({type: \"avif-update\"});\n          } else {\n            refresh();\n          }\n        }\n      });\n    }\n    function awaitStateChange() {\n      const waitFor = navigator.serviceWorker.controller ? \"installed\" : \"activated\";\n      reg.installing.addEventListener(\"statechange\", function() {\n        if (this.state === waitFor) promptUserToRefresh();\n      });\n    }\n\n    navigator.serviceWorker.addEventListener(\"controllerchange\", refresh);\n    navigator.serviceWorker.addEventListener(\"message\", handleMessage);\n    if (navigator.serviceWorker.controller) {\n      const swOpts = getServiceWorkerOpts(opts);\n      navigator.serviceWorker.controller.postMessage({type: \"avif-ready\", data: swOpts});\n    }\n\n    if (reg.waiting) return promptUserToRefresh();\n    reg.addEventListener(\"updatefound\", awaitStateChange);\n  });\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({register});\n\n\n//# sourceURL=webpack:///./node_modules/avif.js/avif.js?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! avif.js */ \"./node_modules/avif.js/avif.js\").register('/avif-sw.js');\n\nvar newUser = {\n  id: 123,\n  username: 'jpreecedev',\n  firstName: 'Jon',\n  lastName: 'Preece'\n};\nnewUser.id = 1;\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ })

/******/ });