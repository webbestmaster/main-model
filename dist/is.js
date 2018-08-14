'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.isNull = isNull;
exports.isNotNull = isNotNull;
exports.isUndefined = isUndefined;
exports.isNotUndefined = isNotUndefined;
exports.isBoolean = isBoolean;
exports.isNotBoolean = isNotBoolean;
exports.isNumber = isNumber;
exports.isNotNumber = isNotNumber;
exports.isString = isString;
exports.isNotString = isNotString;
exports.isFunction = isFunction;
exports.isNotFunction = isNotFunction;
function isNull(value) {
    return value === null;
}

function isNotNull(value) {
    return value !== null;
}

function isUndefined(value) {
    return typeof value === 'undefined';
}

function isNotUndefined(value) {
    return typeof value !== 'undefined';
}

function isBoolean(value) {
    return typeof value === 'boolean';
}

function isNotBoolean(value) {
    return typeof value !== 'boolean';
}

function isNumber(value) {
    return typeof value === 'number';
}

function isNotNumber(value) {
    return typeof value !== 'number';
}

function isString(value) {
    return typeof value === 'string';
}

function isNotString(value) {
    return typeof value !== 'string';
}

function isFunction(value) {
    return typeof value === 'function';
}

function isNotFunction(value) {
    return typeof value !== 'function';
}
