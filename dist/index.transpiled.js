"use strict";

var _express = _interopRequireDefault(require("express"));
var _http = require("http");
var _passport = _interopRequireDefault(require("passport"));
var _passportLocal = require("passport-local");
var _expressSession = _interopRequireDefault(require("express-session"));
var _crypto = require("crypto");
var _util = require("util");
var _memorystore = _interopRequireDefault(require("memorystore"));
var _zod = require("zod");
var _pgCore = require("drizzle-orm/pg-core");
var _drizzleZod = require("drizzle-zod");
var _stripe = _interopRequireDefault(require("stripe"));
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireWildcard(require("path"));
var _url = require("url");
var _vite = require("vite");
var _pluginReact = _interopRequireDefault(require("@vitejs/plugin-react"));
var _vitePluginShadcnThemeJson = _interopRequireDefault(require("@replit/vite-plugin-shadcn-theme-json"));
var _vitePluginRuntimeErrorModal = _interopRequireDefault(require("@replit/vite-plugin-runtime-error-modal"));
var _nanoid = require("nanoid");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } // server/index.ts
// server/routes.ts
// server/auth.ts
// server/storage.ts
var MemoryStore = (0, _memorystore["default"])(_expressSession["default"]);
var MemStorage = /*#__PURE__*/function () {
  function MemStorage() {
    var _this = this;
    _classCallCheck(this, MemStorage);
    _defineProperty(this, "users", void 0);
    _defineProperty(this, "products", void 0);
    _defineProperty(this, "orders", void 0);
    _defineProperty(this, "sessionStore", void 0);
    _defineProperty(this, "currentId", void 0);
    this.users = /* @__PURE__ */new Map();
    this.products = /* @__PURE__ */new Map();
    this.orders = /* @__PURE__ */new Map();
    this.currentId = {
      users: 1,
      products: 1,
      orders: 1
    };
    this.sessionStore = new MemoryStore({
      checkPeriod: 864e5
    });
    this.createUser({
      username: "admin",
      password: "admin123",
      isAdmin: true
    });
    var products2 = [{
      name: "Dark Chocolate Truffles",
      description: "Rich dark chocolate truffles with a smooth ganache center",
      price: "12.99",
      imageUrl: "https://images.unsplash.com/photo-1584382213731-95e51d7cf4c3",
      stock: 50
    }, {
      name: "Milk Chocolate Bar",
      description: "Creamy milk chocolate bar made with premium cocoa",
      price: "8.99",
      imageUrl: "https://images.unsplash.com/photo-1584382213725-57fd7b14b424",
      stock: 100
    }, {
      name: "White Chocolate Pralines",
      description: "Luxurious white chocolate with hazelnut praline filling",
      price: "14.99",
      imageUrl: "https://images.unsplash.com/photo-1481391319762-47dff72954d9",
      stock: 75
    }, {
      name: "Chocolate Covered Strawberries",
      description: "Fresh strawberries dipped in Belgian chocolate",
      price: "16.99",
      imageUrl: "https://images.unsplash.com/photo-1582293041079-7814c2f12063",
      stock: 30
    }, {
      name: "Assorted Chocolate Box",
      description: "A curated selection of our finest chocolates",
      price: "24.99",
      imageUrl: "https://images.unsplash.com/photo-1549007994-cb92caebd54b",
      stock: 40
    }, {
      name: "Sea Salt Caramel Chocolates",
      description: "Dark chocolate with liquid caramel and sea salt",
      price: "18.99",
      imageUrl: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52",
      stock: 60
    }];
    products2.forEach(function (product) {
      return _this.createProduct(product);
    });
  }
  return _createClass(MemStorage, [{
    key: "getUser",
    value: function () {
      var _getUser = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(id) {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", this.users.get(id));
            case 1:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function getUser(_x) {
        return _getUser.apply(this, arguments);
      }
      return getUser;
    }()
  }, {
    key: "getUserByUsername",
    value: function () {
      var _getUserByUsername = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(username) {
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt("return", Array.from(this.users.values()).find(function (user) {
                return user.username === username;
              }));
            case 1:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function getUserByUsername(_x2) {
        return _getUserByUsername.apply(this, arguments);
      }
      return getUserByUsername;
    }()
  }, {
    key: "createUser",
    value: function () {
      var _createUser = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(insertUser) {
        var id, user;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              id = this.currentId.users++;
              user = _objectSpread(_objectSpread({}, insertUser), {}, {
                id: id
              });
              this.users.set(id, user);
              return _context3.abrupt("return", user);
            case 4:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function createUser(_x3) {
        return _createUser.apply(this, arguments);
      }
      return createUser;
    }()
  }, {
    key: "getProducts",
    value: function () {
      var _getProducts = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              return _context4.abrupt("return", Array.from(this.products.values()));
            case 1:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this);
      }));
      function getProducts() {
        return _getProducts.apply(this, arguments);
      }
      return getProducts;
    }()
  }, {
    key: "getProduct",
    value: function () {
      var _getProduct = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(id) {
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              return _context5.abrupt("return", this.products.get(id));
            case 1:
            case "end":
              return _context5.stop();
          }
        }, _callee5, this);
      }));
      function getProduct(_x4) {
        return _getProduct.apply(this, arguments);
      }
      return getProduct;
    }()
  }, {
    key: "createProduct",
    value: function () {
      var _createProduct = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(product) {
        var id, newProduct;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              id = this.currentId.products++;
              newProduct = _objectSpread(_objectSpread({}, product), {}, {
                id: id
              });
              this.products.set(id, newProduct);
              return _context6.abrupt("return", newProduct);
            case 4:
            case "end":
              return _context6.stop();
          }
        }, _callee6, this);
      }));
      function createProduct(_x5) {
        return _createProduct.apply(this, arguments);
      }
      return createProduct;
    }()
  }, {
    key: "updateProduct",
    value: function () {
      var _updateProduct = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(id, updates) {
        var product, updatedProduct;
        return _regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return this.getProduct(id);
            case 2:
              product = _context7.sent;
              if (product) {
                _context7.next = 5;
                break;
              }
              throw new Error("Product not found");
            case 5:
              updatedProduct = _objectSpread(_objectSpread({}, product), updates);
              this.products.set(id, updatedProduct);
              return _context7.abrupt("return", updatedProduct);
            case 8:
            case "end":
              return _context7.stop();
          }
        }, _callee7, this);
      }));
      function updateProduct(_x6, _x7) {
        return _updateProduct.apply(this, arguments);
      }
      return updateProduct;
    }()
  }, {
    key: "deleteProduct",
    value: function () {
      var _deleteProduct = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(id) {
        return _regeneratorRuntime().wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              this.products["delete"](id);
            case 1:
            case "end":
              return _context8.stop();
          }
        }, _callee8, this);
      }));
      function deleteProduct(_x8) {
        return _deleteProduct.apply(this, arguments);
      }
      return deleteProduct;
    }()
  }, {
    key: "getOrders",
    value: function () {
      var _getOrders = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9() {
        return _regeneratorRuntime().wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              return _context9.abrupt("return", Array.from(this.orders.values()));
            case 1:
            case "end":
              return _context9.stop();
          }
        }, _callee9, this);
      }));
      function getOrders() {
        return _getOrders.apply(this, arguments);
      }
      return getOrders;
    }()
  }, {
    key: "getOrdersByUser",
    value: function () {
      var _getOrdersByUser = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee10(userId) {
        return _regeneratorRuntime().wrap(function _callee10$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              return _context10.abrupt("return", Array.from(this.orders.values()).filter(function (order) {
                return order.userId === userId;
              }));
            case 1:
            case "end":
              return _context10.stop();
          }
        }, _callee10, this);
      }));
      function getOrdersByUser(_x9) {
        return _getOrdersByUser.apply(this, arguments);
      }
      return getOrdersByUser;
    }()
  }, {
    key: "createOrder",
    value: function () {
      var _createOrder = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee11(order) {
        var id, newOrder;
        return _regeneratorRuntime().wrap(function _callee11$(_context11) {
          while (1) switch (_context11.prev = _context11.next) {
            case 0:
              id = this.currentId.orders++;
              newOrder = _objectSpread(_objectSpread({}, order), {}, {
                id: id
              });
              this.orders.set(id, newOrder);
              return _context11.abrupt("return", newOrder);
            case 4:
            case "end":
              return _context11.stop();
          }
        }, _callee11, this);
      }));
      function createOrder(_x10) {
        return _createOrder.apply(this, arguments);
      }
      return createOrder;
    }()
  }, {
    key: "updateOrderStatus",
    value: function () {
      var _updateOrderStatus = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee12(id, status) {
        var order, updatedOrder;
        return _regeneratorRuntime().wrap(function _callee12$(_context12) {
          while (1) switch (_context12.prev = _context12.next) {
            case 0:
              order = this.orders.get(id);
              if (order) {
                _context12.next = 3;
                break;
              }
              throw new Error("Order not found");
            case 3:
              updatedOrder = _objectSpread(_objectSpread({}, order), {}, {
                status: status
              });
              this.orders.set(id, updatedOrder);
              return _context12.abrupt("return", updatedOrder);
            case 6:
            case "end":
              return _context12.stop();
          }
        }, _callee12, this);
      }));
      function updateOrderStatus(_x11, _x12) {
        return _updateOrderStatus.apply(this, arguments);
      }
      return updateOrderStatus;
    }()
  }]);
}();
var storage = new MemStorage();

// server/auth.ts
var scryptAsync = (0, _util.promisify)(_crypto.scrypt);
function hashPassword(_x13) {
  return _hashPassword.apply(this, arguments);
}
function _hashPassword() {
  _hashPassword = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee17(password) {
    var salt, buf;
    return _regeneratorRuntime().wrap(function _callee17$(_context17) {
      while (1) switch (_context17.prev = _context17.next) {
        case 0:
          salt = (0, _crypto.randomBytes)(16).toString("hex");
          _context17.next = 3;
          return scryptAsync(password, salt, 64);
        case 3:
          buf = _context17.sent;
          return _context17.abrupt("return", "".concat(buf.toString("hex"), ".").concat(salt));
        case 5:
        case "end":
          return _context17.stop();
      }
    }, _callee17);
  }));
  return _hashPassword.apply(this, arguments);
}
function comparePasswords(_x14, _x15) {
  return _comparePasswords.apply(this, arguments);
}
function _comparePasswords() {
  _comparePasswords = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee18(supplied, stored) {
    var _stored$split, _stored$split2, hashed, salt, hashedBuf, suppliedBuf;
    return _regeneratorRuntime().wrap(function _callee18$(_context18) {
      while (1) switch (_context18.prev = _context18.next) {
        case 0:
          _stored$split = stored.split("."), _stored$split2 = _slicedToArray(_stored$split, 2), hashed = _stored$split2[0], salt = _stored$split2[1];
          hashedBuf = Buffer.from(hashed, "hex");
          _context18.next = 4;
          return scryptAsync(supplied, salt, 64);
        case 4:
          suppliedBuf = _context18.sent;
          return _context18.abrupt("return", (0, _crypto.timingSafeEqual)(hashedBuf, suppliedBuf));
        case 6:
        case "end":
          return _context18.stop();
      }
    }, _callee18);
  }));
  return _comparePasswords.apply(this, arguments);
}
function setupAuth(app2) {
  var sessionSettings = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore
  };
  app2.set("trust proxy", 1);
  app2.use((0, _expressSession["default"])(sessionSettings));
  app2.use(_passport["default"].initialize());
  app2.use(_passport["default"].session());
  _passport["default"].use(new _passportLocal.Strategy(/*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee13(username, password, done) {
      var user;
      return _regeneratorRuntime().wrap(function _callee13$(_context13) {
        while (1) switch (_context13.prev = _context13.next) {
          case 0:
            _context13.next = 2;
            return storage.getUserByUsername(username);
          case 2:
            user = _context13.sent;
            _context13.t0 = !user;
            if (_context13.t0) {
              _context13.next = 8;
              break;
            }
            _context13.next = 7;
            return comparePasswords(password, user.password);
          case 7:
            _context13.t0 = !_context13.sent;
          case 8:
            if (!_context13.t0) {
              _context13.next = 12;
              break;
            }
            return _context13.abrupt("return", done(null, false));
          case 12:
            return _context13.abrupt("return", done(null, user));
          case 13:
          case "end":
            return _context13.stop();
        }
      }, _callee13);
    }));
    return function (_x16, _x17, _x18) {
      return _ref.apply(this, arguments);
    };
  }()));
  _passport["default"].serializeUser(function (user, done) {
    return done(null, user.id);
  });
  _passport["default"].deserializeUser(/*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee14(id, done) {
      var user;
      return _regeneratorRuntime().wrap(function _callee14$(_context14) {
        while (1) switch (_context14.prev = _context14.next) {
          case 0:
            _context14.next = 2;
            return storage.getUser(id);
          case 2:
            user = _context14.sent;
            done(null, user);
          case 4:
          case "end":
            return _context14.stop();
        }
      }, _callee14);
    }));
    return function (_x19, _x20) {
      return _ref2.apply(this, arguments);
    };
  }());
  app2.post("/api/register", /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee15(req, res, next) {
      var existingUser, user;
      return _regeneratorRuntime().wrap(function _callee15$(_context15) {
        while (1) switch (_context15.prev = _context15.next) {
          case 0:
            _context15.next = 2;
            return storage.getUserByUsername(req.body.username);
          case 2:
            existingUser = _context15.sent;
            if (!existingUser) {
              _context15.next = 5;
              break;
            }
            return _context15.abrupt("return", res.status(400).send("Username already exists"));
          case 5:
            _context15.t0 = storage;
            _context15.t1 = _objectSpread;
            _context15.t2 = _objectSpread({}, req.body);
            _context15.t3 = {};
            _context15.next = 11;
            return hashPassword(req.body.password);
          case 11:
            _context15.t4 = _context15.sent;
            _context15.t5 = {
              password: _context15.t4
            };
            _context15.t6 = (0, _context15.t1)(_context15.t2, _context15.t3, _context15.t5);
            _context15.next = 16;
            return _context15.t0.createUser.call(_context15.t0, _context15.t6);
          case 16:
            user = _context15.sent;
            req.login(user, function (err) {
              if (err) return next(err);
              res.status(201).json(user);
            });
          case 18:
          case "end":
            return _context15.stop();
        }
      }, _callee15);
    }));
    return function (_x21, _x22, _x23) {
      return _ref3.apply(this, arguments);
    };
  }());
  app2.post("/api/login", _passport["default"].authenticate("local"), function (req, res) {
    res.status(200).json(req.user);
  });
  app2.post("/api/logout", function (req, res, next) {
    req.logout(function (err) {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", function (req, res) {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}

// server/routes.ts

// shared/schema.ts

var users = (0, _pgCore.pgTable)("users", {
  id: (0, _pgCore.serial)("id").primaryKey(),
  username: (0, _pgCore.text)("username").notNull().unique(),
  password: (0, _pgCore.text)("password").notNull(),
  isAdmin: (0, _pgCore["boolean"])("is_admin").notNull()["default"](false)
});
var products = (0, _pgCore.pgTable)("products", {
  id: (0, _pgCore.serial)("id").primaryKey(),
  name: (0, _pgCore.text)("name").notNull(),
  description: (0, _pgCore.text)("description").notNull(),
  price: (0, _pgCore.decimal)("price", {
    precision: 10,
    scale: 2
  }).notNull(),
  imageUrl: (0, _pgCore.text)("image_url").notNull(),
  stock: (0, _pgCore.integer)("stock").notNull()
});
var orders = (0, _pgCore.pgTable)("orders", {
  id: (0, _pgCore.serial)("id").primaryKey(),
  userId: (0, _pgCore.integer)("user_id").notNull(),
  status: (0, _pgCore.text)("status").notNull(),
  items: (0, _pgCore.jsonb)("items").notNull(),
  total: (0, _pgCore.decimal)("total", {
    precision: 10,
    scale: 2
  }).notNull()
});
var insertUserSchema = (0, _drizzleZod.createInsertSchema)(users).pick({
  username: true,
  password: true
});
var insertProductSchema = (0, _drizzleZod.createInsertSchema)(products);
var insertOrderSchema = (0, _drizzleZod.createInsertSchema)(orders);
var orderItemSchema = _zod.z.object({
  productId: _zod.z.number(),
  quantity: _zod.z.number().min(1),
  name: _zod.z.string(),
  price: _zod.z.number()
});

// server/stripe.ts

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing Stripe secret key");
}
var stripe = new _stripe["default"](process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16"
});
function createPaymentIntent(_x24) {
  return _createPaymentIntent.apply(this, arguments);
} // server/routes.ts
function _createPaymentIntent() {
  _createPaymentIntent = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee19(amount) {
    return _regeneratorRuntime().wrap(function _callee19$(_context19) {
      while (1) switch (_context19.prev = _context19.next) {
        case 0:
          _context19.next = 2;
          return stripe.paymentIntents.create({
            amount: amount,
            currency: "usd"
          });
        case 2:
          return _context19.abrupt("return", _context19.sent);
        case 3:
        case "end":
          return _context19.stop();
      }
    }, _callee19);
  }));
  return _createPaymentIntent.apply(this, arguments);
}
function isAdmin(req) {
  return req.isAuthenticated() && req.user.isAdmin;
}
function registerRoutes(_x25) {
  return _registerRoutes.apply(this, arguments);
} // server/vite.ts
function _registerRoutes() {
  _registerRoutes = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee28(app2) {
    var httpServer;
    return _regeneratorRuntime().wrap(function _callee28$(_context28) {
      while (1) switch (_context28.prev = _context28.next) {
        case 0:
          setupAuth(app2);
          app2.get("/api/products", /*#__PURE__*/function () {
            var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee20(_req, res) {
              var products2;
              return _regeneratorRuntime().wrap(function _callee20$(_context20) {
                while (1) switch (_context20.prev = _context20.next) {
                  case 0:
                    _context20.next = 2;
                    return storage.getProducts();
                  case 2:
                    products2 = _context20.sent;
                    res.json(products2);
                  case 4:
                  case "end":
                    return _context20.stop();
                }
              }, _callee20);
            }));
            return function (_x28, _x29) {
              return _ref5.apply(this, arguments);
            };
          }());
          app2.post("/api/products", /*#__PURE__*/function () {
            var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee21(req, res) {
              var validation, product;
              return _regeneratorRuntime().wrap(function _callee21$(_context21) {
                while (1) switch (_context21.prev = _context21.next) {
                  case 0:
                    if (isAdmin(req)) {
                      _context21.next = 2;
                      break;
                    }
                    return _context21.abrupt("return", res.sendStatus(403));
                  case 2:
                    validation = insertProductSchema.safeParse(req.body);
                    if (validation.success) {
                      _context21.next = 5;
                      break;
                    }
                    return _context21.abrupt("return", res.status(400).json(validation.error));
                  case 5:
                    _context21.next = 7;
                    return storage.createProduct(validation.data);
                  case 7:
                    product = _context21.sent;
                    res.status(201).json(product);
                  case 9:
                  case "end":
                    return _context21.stop();
                }
              }, _callee21);
            }));
            return function (_x30, _x31) {
              return _ref6.apply(this, arguments);
            };
          }());
          app2.patch("/api/products/:id", /*#__PURE__*/function () {
            var _ref7 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee22(req, res) {
              var product;
              return _regeneratorRuntime().wrap(function _callee22$(_context22) {
                while (1) switch (_context22.prev = _context22.next) {
                  case 0:
                    if (isAdmin(req)) {
                      _context22.next = 2;
                      break;
                    }
                    return _context22.abrupt("return", res.sendStatus(403));
                  case 2:
                    _context22.next = 4;
                    return storage.updateProduct(parseInt(req.params.id), req.body);
                  case 4:
                    product = _context22.sent;
                    res.json(product);
                  case 6:
                  case "end":
                    return _context22.stop();
                }
              }, _callee22);
            }));
            return function (_x32, _x33) {
              return _ref7.apply(this, arguments);
            };
          }());
          app2["delete"]("/api/products/:id", /*#__PURE__*/function () {
            var _ref8 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee23(req, res) {
              return _regeneratorRuntime().wrap(function _callee23$(_context23) {
                while (1) switch (_context23.prev = _context23.next) {
                  case 0:
                    if (isAdmin(req)) {
                      _context23.next = 2;
                      break;
                    }
                    return _context23.abrupt("return", res.sendStatus(403));
                  case 2:
                    _context23.next = 4;
                    return storage.deleteProduct(parseInt(req.params.id));
                  case 4:
                    res.sendStatus(204);
                  case 5:
                  case "end":
                    return _context23.stop();
                }
              }, _callee23);
            }));
            return function (_x34, _x35) {
              return _ref8.apply(this, arguments);
            };
          }());
          app2.post("/api/create-payment-intent", /*#__PURE__*/function () {
            var _ref9 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee24(req, res) {
              var amount, paymentIntent;
              return _regeneratorRuntime().wrap(function _callee24$(_context24) {
                while (1) switch (_context24.prev = _context24.next) {
                  case 0:
                    if (req.isAuthenticated()) {
                      _context24.next = 2;
                      break;
                    }
                    return _context24.abrupt("return", res.sendStatus(401));
                  case 2:
                    _context24.prev = 2;
                    amount = req.body.amount;
                    _context24.next = 6;
                    return createPaymentIntent(amount);
                  case 6:
                    paymentIntent = _context24.sent;
                    res.json({
                      clientSecret: paymentIntent.client_secret
                    });
                    _context24.next = 13;
                    break;
                  case 10:
                    _context24.prev = 10;
                    _context24.t0 = _context24["catch"](2);
                    res.status(500).json({
                      error: "Failed to create payment intent"
                    });
                  case 13:
                  case "end":
                    return _context24.stop();
                }
              }, _callee24, null, [[2, 10]]);
            }));
            return function (_x36, _x37) {
              return _ref9.apply(this, arguments);
            };
          }());
          app2.get("/api/orders", /*#__PURE__*/function () {
            var _ref10 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee25(req, res) {
              var orders2;
              return _regeneratorRuntime().wrap(function _callee25$(_context25) {
                while (1) switch (_context25.prev = _context25.next) {
                  case 0:
                    if (req.isAuthenticated()) {
                      _context25.next = 2;
                      break;
                    }
                    return _context25.abrupt("return", res.sendStatus(401));
                  case 2:
                    if (!req.user.isAdmin) {
                      _context25.next = 8;
                      break;
                    }
                    _context25.next = 5;
                    return storage.getOrders();
                  case 5:
                    _context25.t0 = _context25.sent;
                    _context25.next = 11;
                    break;
                  case 8:
                    _context25.next = 10;
                    return storage.getOrdersByUser(req.user.id);
                  case 10:
                    _context25.t0 = _context25.sent;
                  case 11:
                    orders2 = _context25.t0;
                    res.json(orders2);
                  case 13:
                  case "end":
                    return _context25.stop();
                }
              }, _callee25);
            }));
            return function (_x38, _x39) {
              return _ref10.apply(this, arguments);
            };
          }());
          app2.post("/api/orders", /*#__PURE__*/function () {
            var _ref11 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee26(req, res) {
              var validation, order;
              return _regeneratorRuntime().wrap(function _callee26$(_context26) {
                while (1) switch (_context26.prev = _context26.next) {
                  case 0:
                    if (req.isAuthenticated()) {
                      _context26.next = 2;
                      break;
                    }
                    return _context26.abrupt("return", res.sendStatus(401));
                  case 2:
                    validation = insertOrderSchema.safeParse(_objectSpread(_objectSpread({}, req.body), {}, {
                      userId: req.user.id
                    }));
                    if (validation.success) {
                      _context26.next = 5;
                      break;
                    }
                    return _context26.abrupt("return", res.status(400).json(validation.error));
                  case 5:
                    _context26.next = 7;
                    return storage.createOrder(validation.data);
                  case 7:
                    order = _context26.sent;
                    res.status(201).json(order);
                  case 9:
                  case "end":
                    return _context26.stop();
                }
              }, _callee26);
            }));
            return function (_x40, _x41) {
              return _ref11.apply(this, arguments);
            };
          }());
          app2.patch("/api/orders/:id/status", /*#__PURE__*/function () {
            var _ref12 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee27(req, res) {
              var validation, order;
              return _regeneratorRuntime().wrap(function _callee27$(_context27) {
                while (1) switch (_context27.prev = _context27.next) {
                  case 0:
                    if (isAdmin(req)) {
                      _context27.next = 2;
                      break;
                    }
                    return _context27.abrupt("return", res.sendStatus(403));
                  case 2:
                    validation = _zod.z.object({
                      status: _zod.z.string()
                    }).safeParse(req.body);
                    if (validation.success) {
                      _context27.next = 5;
                      break;
                    }
                    return _context27.abrupt("return", res.status(400).json(validation.error));
                  case 5:
                    _context27.next = 7;
                    return storage.updateOrderStatus(parseInt(req.params.id), validation.data.status);
                  case 7:
                    order = _context27.sent;
                    res.json(order);
                  case 9:
                  case "end":
                    return _context27.stop();
                }
              }, _callee27);
            }));
            return function (_x42, _x43) {
              return _ref12.apply(this, arguments);
            };
          }());
          httpServer = (0, _http.createServer)(app2);
          return _context28.abrupt("return", httpServer);
        case 11:
        case "end":
          return _context28.stop();
      }
    }, _callee28);
  }));
  return _registerRoutes.apply(this, arguments);
} // vite.config.ts
var _filename = (0, _url.fileURLToPath)(import.meta.url);
var _dirname = (0, _path.dirname)(_filename);
var vite_config_default = (0, _vite.defineConfig)({
  plugins: [(0, _pluginReact["default"])(), (0, _vitePluginRuntimeErrorModal["default"])(), (0, _vitePluginShadcnThemeJson["default"])()].concat(_toConsumableArray(process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [await Promise.resolve().then(function () {
    return _interopRequireWildcard(require("@replit/vite-plugin-cartographer"));
  }).then(function (m) {
    return m.cartographer();
  })] : [])),
  resolve: {
    alias: {
      "@": _path["default"].resolve(_dirname, "client", "src"),
      "@shared": _path["default"].resolve(_dirname, "shared")
    }
  },
  root: _path["default"].resolve(_dirname, "client"),
  build: {
    outDir: _path["default"].resolve(_dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts

var __filename2 = (0, _url.fileURLToPath)(import.meta.url);
var __dirname2 = (0, _path.dirname)(__filename2);
var viteLogger = (0, _vite.createLogger)();
function log(message) {
  var source = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "express";
  var formattedTime = (/* @__PURE__ */new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log("".concat(formattedTime, " [").concat(source, "] ").concat(message));
}
function setupVite(_x26, _x27) {
  return _setupVite.apply(this, arguments);
}
function _setupVite() {
  _setupVite = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee30(app2, server) {
    var serverOptions, vite;
    return _regeneratorRuntime().wrap(function _callee30$(_context30) {
      while (1) switch (_context30.prev = _context30.next) {
        case 0:
          serverOptions = {
            middlewareMode: true,
            hmr: {
              server: server
            },
            allowedHosts: true
          };
          _context30.next = 3;
          return (0, _vite.createServer)(_objectSpread(_objectSpread({}, vite_config_default), {}, {
            configFile: false,
            customLogger: _objectSpread(_objectSpread({}, viteLogger), {}, {
              error: function error(msg, options) {
                viteLogger.error(msg, options);
                process.exit(1);
              }
            }),
            server: serverOptions,
            appType: "custom"
          }));
        case 3:
          vite = _context30.sent;
          app2.use(vite.middlewares);
          app2.use("*", /*#__PURE__*/function () {
            var _ref13 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee29(req, res, next) {
              var url, clientTemplate, template, page;
              return _regeneratorRuntime().wrap(function _callee29$(_context29) {
                while (1) switch (_context29.prev = _context29.next) {
                  case 0:
                    url = req.originalUrl;
                    _context29.prev = 1;
                    clientTemplate = _path["default"].resolve(__dirname2, "..", "client", "index.html");
                    _context29.next = 5;
                    return _fs["default"].promises.readFile(clientTemplate, "utf-8");
                  case 5:
                    template = _context29.sent;
                    template = template.replace("src=\"/src/main.tsx\"", "src=\"/src/main.tsx?v=".concat((0, _nanoid.nanoid)(), "\""));
                    _context29.next = 9;
                    return vite.transformIndexHtml(url, template);
                  case 9:
                    page = _context29.sent;
                    res.status(200).set({
                      "Content-Type": "text/html"
                    }).end(page);
                    _context29.next = 17;
                    break;
                  case 13:
                    _context29.prev = 13;
                    _context29.t0 = _context29["catch"](1);
                    vite.ssrFixStacktrace(_context29.t0);
                    next(_context29.t0);
                  case 17:
                  case "end":
                    return _context29.stop();
                }
              }, _callee29, null, [[1, 13]]);
            }));
            return function (_x44, _x45, _x46) {
              return _ref13.apply(this, arguments);
            };
          }());
        case 6:
        case "end":
          return _context30.stop();
      }
    }, _callee30);
  }));
  return _setupVite.apply(this, arguments);
}
function serveStatic(app2) {
  var distPath = _path["default"].resolve(__dirname2, "public");
  if (!_fs["default"].existsSync(distPath)) {
    throw new Error("Could not find the build directory: ".concat(distPath, ", make sure to build the client first"));
  }
  app2.use(_express["default"]["static"](distPath));
  app2.use("*", function (_req, res) {
    res.sendFile(_path["default"].resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = (0, _express["default"])();
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: false
}));
app.use(function (req, res, next) {
  var start = Date.now();
  var path3 = req.path;
  var capturedJsonResponse = void 0;
  var originalResJson = res.json;
  res.json = function (bodyJson) {
    capturedJsonResponse = bodyJson;
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    return originalResJson.apply(res, [bodyJson].concat(args));
  };
  res.on("finish", function () {
    var duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      var logLine = "".concat(req.method, " ").concat(path3, " ").concat(res.statusCode, " in ").concat(duration, "ms");
      if (capturedJsonResponse) {
        logLine += " :: ".concat(JSON.stringify(capturedJsonResponse));
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee16() {
  var server, port;
  return _regeneratorRuntime().wrap(function _callee16$(_context16) {
    while (1) switch (_context16.prev = _context16.next) {
      case 0:
        _context16.next = 2;
        return registerRoutes(app);
      case 2:
        server = _context16.sent;
        app.use(function (err, _req, res, _next) {
          var status = err.status || err.statusCode || 500;
          var message = err.message || "Internal Server Error";
          res.status(status).json({
            message: message
          });
          throw err;
        });
        if (!(app.get("env") === "development")) {
          _context16.next = 9;
          break;
        }
        _context16.next = 7;
        return setupVite(app, server);
      case 7:
        _context16.next = 10;
        break;
      case 9:
        serveStatic(app);
      case 10:
        port = 5e3;
        server.listen({
          port: port,
          host: "0.0.0.0",
          reusePort: true
        }, function () {
          log("serving on port ".concat(port));
        });
      case 12:
      case "end":
        return _context16.stop();
    }
  }, _callee16);
}))();
