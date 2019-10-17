"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var checkForObserver = function checkForObserver() {
  if (!('IntersectionObserver' in window)) {
    throw new Error("\n      bounds.js requires IntersectionObserver on the global object.\n      IntersectionObserver is unavailable in IE and other older\n      versions of browsers.\n      See https://github.com/ChrisCavs/bounds.js/blob/master/README.md\n      for more compatibility information.\n    ");
  }
};

var getMargins = function getMargins() {
  var margins = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _margins$top = margins.top,
      top = _margins$top === void 0 ? 0 : _margins$top,
      _margins$right = margins.right,
      right = _margins$right === void 0 ? 0 : _margins$right,
      _margins$bottom = margins.bottom,
      bottom = _margins$bottom === void 0 ? 0 : _margins$bottom,
      _margins$left = margins.left,
      left = _margins$left === void 0 ? 0 : _margins$left;
  return "".concat(top, "px ").concat(right, "px ").concat(bottom, "px ").concat(left, "px");
};

var noOp = function noOp() {};

var bound = function bound(options) {
  return new Boundary(options);
};

var Boundary =
/*#__PURE__*/
function () {
  function Boundary() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        root = _ref.root,
        margins = _ref.margins,
        threshold = _ref.threshold,
        onEmit = _ref.onEmit;

    _classCallCheck(this, Boundary);

    checkForObserver();
    var marginString = getMargins(margins);
    var options = {
      root: root || null,
      rootMargin: marginString,
      threshold: threshold || 0.0
    };
    this.nodes = [];
    this.onEmit = onEmit || noOp;
    this.observer = new IntersectionObserver(this._emit.bind(this), options);
  } // API


  _createClass(Boundary, [{
    key: "watch",
    value: function watch(el) {
      var onEnter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noOp;
      var onLeave = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : noOp;
      var data = {
        el: el,
        onEnter: onEnter,
        onLeave: onLeave
      };
      this.nodes.push(data);
      this.observer.observe(el);
      return data;
    }
  }, {
    key: "unWatch",
    value: function unWatch(el) {
      var index = this._findByNode(el, true);

      if (index !== -1) {
        this.nodes.splice(index, 1);
        this.observer.unobserve(el);
      }

      return this;
    }
  }, {
    key: "check",
    value: function check(el) {
      var data = this._findByNode(el) || {};
      return data.history;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.nodes = [];
      this.observer.disconnect();
      return this;
    }
  }, {
    key: "_emit",
    // HELPERS
    value: function _emit(events) {
      var _this = this;

      var actions = events.map(function (event) {
        var data = _this._findByNode(event.target);

        var ratio = event.intersectionRatio;
        data.history = event.isIntersecting;
        event.isIntersecting ? data.onEnter(ratio) : data.onLeave(ratio);
        return {
          el: event.target,
          inside: event.isIntersecting,
          outside: !event.isIntersecting,
          ratio: event.intersectionRatio
        };
      });
      this.onEmit(actions);
    }
  }, {
    key: "_findByNode",
    value: function _findByNode(el) {
      var returnIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var func = returnIndex ? 'findIndex' : 'find';
      return this.nodes[func](function (node) {
        return node.el.isEqualNode(el);
      });
    }
  }], [{
    key: "checkCompatibility",
    value: function checkCompatibility() {
      checkForObserver();
    }
  }]);

  return Boundary;
}();