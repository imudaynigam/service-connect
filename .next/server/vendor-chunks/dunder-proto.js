"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/dunder-proto";
exports.ids = ["vendor-chunks/dunder-proto"];
exports.modules = {

/***/ "(rsc)/./node_modules/dunder-proto/get.js":
/*!******************************************!*\
  !*** ./node_modules/dunder-proto/get.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nvar callBind = __webpack_require__(/*! call-bind-apply-helpers */ \"(rsc)/./node_modules/call-bind-apply-helpers/index.js\");\nvar gOPD = __webpack_require__(/*! gopd */ \"(rsc)/./node_modules/gopd/index.js\");\n\n// eslint-disable-next-line no-extra-parens, no-proto\nvar hasProtoAccessor = /** @type {{ __proto__?: typeof Array.prototype }} */ ([]).__proto__ === Array.prototype;\n\n// eslint-disable-next-line no-extra-parens\nvar desc = hasProtoAccessor && gOPD && gOPD(Object.prototype, /** @type {keyof typeof Object.prototype} */ ('__proto__'));\n\nvar $Object = Object;\nvar $getPrototypeOf = $Object.getPrototypeOf;\n\n/** @type {import('./get')} */\nmodule.exports = desc && typeof desc.get === 'function'\n\t? callBind([desc.get])\n\t: typeof $getPrototypeOf === 'function'\n\t\t? /** @type {import('./get')} */ function getDunder(value) {\n\t\t\t// eslint-disable-next-line eqeqeq\n\t\t\treturn $getPrototypeOf(value == null ? value : $Object(value));\n\t\t}\n\t\t: false;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvZHVuZGVyLXByb3RvL2dldC5qcyIsIm1hcHBpbmdzIjoiQUFBYTs7QUFFYixlQUFlLG1CQUFPLENBQUMsc0ZBQXlCO0FBQ2hELFdBQVcsbUJBQU8sQ0FBQyxnREFBTTs7QUFFekI7QUFDQSxvQ0FBb0Msc0NBQXNDOztBQUUxRTtBQUNBLHlFQUF5RSwrQkFBK0I7O0FBRXhHO0FBQ0E7O0FBRUEsV0FBVyxpQkFBaUI7QUFDNUI7QUFDQTtBQUNBO0FBQ0EsZUFBZSxpQkFBaUI7QUFDaEM7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcdWRheW5cXERlc2t0b3BcXG5ldy1FLWItMi1tYWluXFxuZXctRS1iLTItbWFpblxcbm9kZV9tb2R1bGVzXFxkdW5kZXItcHJvdG9cXGdldC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBjYWxsQmluZCA9IHJlcXVpcmUoJ2NhbGwtYmluZC1hcHBseS1oZWxwZXJzJyk7XG52YXIgZ09QRCA9IHJlcXVpcmUoJ2dvcGQnKTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWV4dHJhLXBhcmVucywgbm8tcHJvdG9cbnZhciBoYXNQcm90b0FjY2Vzc29yID0gLyoqIEB0eXBlIHt7IF9fcHJvdG9fXz86IHR5cGVvZiBBcnJheS5wcm90b3R5cGUgfX0gKi8gKFtdKS5fX3Byb3RvX18gPT09IEFycmF5LnByb3RvdHlwZTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWV4dHJhLXBhcmVuc1xudmFyIGRlc2MgPSBoYXNQcm90b0FjY2Vzc29yICYmIGdPUEQgJiYgZ09QRChPYmplY3QucHJvdG90eXBlLCAvKiogQHR5cGUge2tleW9mIHR5cGVvZiBPYmplY3QucHJvdG90eXBlfSAqLyAoJ19fcHJvdG9fXycpKTtcblxudmFyICRPYmplY3QgPSBPYmplY3Q7XG52YXIgJGdldFByb3RvdHlwZU9mID0gJE9iamVjdC5nZXRQcm90b3R5cGVPZjtcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4vZ2V0Jyl9ICovXG5tb2R1bGUuZXhwb3J0cyA9IGRlc2MgJiYgdHlwZW9mIGRlc2MuZ2V0ID09PSAnZnVuY3Rpb24nXG5cdD8gY2FsbEJpbmQoW2Rlc2MuZ2V0XSlcblx0OiB0eXBlb2YgJGdldFByb3RvdHlwZU9mID09PSAnZnVuY3Rpb24nXG5cdFx0PyAvKiogQHR5cGUge2ltcG9ydCgnLi9nZXQnKX0gKi8gZnVuY3Rpb24gZ2V0RHVuZGVyKHZhbHVlKSB7XG5cdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXFlcWVxXG5cdFx0XHRyZXR1cm4gJGdldFByb3RvdHlwZU9mKHZhbHVlID09IG51bGwgPyB2YWx1ZSA6ICRPYmplY3QodmFsdWUpKTtcblx0XHR9XG5cdFx0OiBmYWxzZTtcbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/dunder-proto/get.js\n");

/***/ })

};
;