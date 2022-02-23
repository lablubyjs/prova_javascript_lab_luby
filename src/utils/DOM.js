(function (document, window) {
  "use strict";

  function DOM(selector) {
    if(!(this instanceof DOM))
      return new DOM(selector);

    this.element = document.querySelectorAll(selector);
  }

  // isArray, isObject, isFunction, isNumber, isString, isBoolean, isNull

  DOM.is = function (param) {
    return Object.prototype.toString.call(param);
  };

  DOM.isArray = function (param) {
    return this.is(param) === "[object Array]";
  };

  DOM.isObject = function (param) {
    return this.is(param) === "[object Object]";
  };

  DOM.isFunction = function (param) {
    return this.is(param) === "[object Function]";
  };

  DOM.isNumber = function (param) {
    return this.is(param) === "[object Number]";
  };

  DOM.isString = function (param) {
    return this.is(param) === "[object String]";
  };

  DOM.isBoolean = function (param) {
    return this.is(param) === "[object Boolean]";
  };

  DOM.isNull = function (param) {
    return (
      this.is(param) === "[object null]" ||
      this.is(param) === "[object undefined]"
    );
  };

  DOM.prototype.on = function (event, callBack) {
    Array.prototype.forEach.call(this.element, (item) => {
      item.addEventListener(event, callBack, false);
    });
  };

  DOM.prototype.off = function (event, callBack) {
    Array.prototype.forEach.call(this.element, (item) => {
      item.removeEventListener(event, callBack, false);
    });
  };

  DOM.prototype.get = function (index) {
    if(!index)
      return this.element[0]
    return this.element[index];
  };

  // forEach, map, filter, reduce, reduceRight, every e some

  DOM.prototype.forEach = function (array) {
    return Array.prototype.forEach.apply(this.element, arguments);
  };

  DOM.prototype.map = function () {
    return Array.prototype.map.apply(this.element, arguments);
  };

  DOM.prototype.filter = function () {
    return Array.prototype.filter.apply(this.element, arguments);
  };

  DOM.prototype.reduce = function () {
    return Array.prototype.reduce.apply(this.element, arguments);
  };

  DOM.prototype.reduceRight = function () {
    return Array.prototype.reduceRight.apply(this.element, arguments);
  };

  DOM.prototype.every = function () {
    return Array.prototype.every.apply(this.element, arguments);
  };

  DOM.prototype.some = function () {
    return Array.prototype.some.apply(this.element, arguments);
  };

  window.DOM = DOM;

})(document, window);
