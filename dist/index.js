'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _apply = require('babel-runtime/core-js/reflect/apply');

var _apply2 = _interopRequireDefault(_apply);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _deleteProperty = require('babel-runtime/core-js/reflect/delete-property');

var _deleteProperty2 = _interopRequireDefault(_deleteProperty);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _is = require('./is');

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
}

/**
 *
 * @param {object} attributes of new MainModel instance
 * @return {MainModel} instance
 */
var MainModel = (function() {
    function MainModel(key, value) {
        (0, _classCallCheck3.default)(this, MainModel);

        var model = this;

        model.attr = {};
        model.listeners = {};
        model.listening = [];

        if ((0, _is.isNotUndefined)(key) && (0, _is.isNotUndefined)(value)) {
            model.attr[key] = value;
        }
    }

    /**
     * @return {void}
     */

    (0, _createClass3.default)(MainModel, [
        {
            key: 'destroy',
            value: function destroy() {
                var model = this;

                model.attr = {};
                model.offChange();
                model.stopListening();
            }

            /**
             *
             * @param {string} key of value
             * @param {*} [value] saved value
             * @return {MainModel} instance
             */
        },
        {
            key: 'set',
            value: function set(key, value) {
                return this.setKeyValue(key, value);
                // return isString(key) ? this.setKeyValue(key, value) : this.setObject(key);
            }

            /**
             *
             * @param {string} key of value
             * @return {*} saved value
             */
        },
        {
            key: 'get',
            value: function get(key) {
                var attr = this.attr;

                return attr[key];
            }

            /**
             *
             * @param {string} key of value
             * @param {number} deltaValue to change current value
             * @return {MainModel} instance
             */
        },
        {
            key: 'changeBy',
            value: function changeBy(key, deltaValue) {
                var model = this;

                var currentValue = model.get(key);

                if ((0, _is.isNumber)(currentValue) && (0, _is.isNumber)(deltaValue)) {
                    return model.setKeyValue(key, currentValue + deltaValue);
                }

                console.error('delta and value should be number');

                return model;
            }

            /**
             *
             * @param {string} key of value
             * @return {MainModel} instance
             */
        },
        {
            key: 'unset',
            value: function unset(key) {
                var model = this;

                (0, _deleteProperty2.default)(model.attr, key);
                return model;
            }

            /**
             *
             * @param {string} key of value
             * @param {function} action to execute
             * @param {*} [context] of action
             * @return {MainModel} instance
             */
        },
        {
            key: 'onChange',
            value: function onChange(key, action) {
                var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this;

                var model = this;
                var listeners = model.getListenersByKey(key);

                listeners.push([action, context]);

                return model;
            }

            /**
             *
             * @param {string} [key] of value
             * @param {function} [action] was execute
             * @param {*} [context] of action
             * @return {MainModel} instance
             */
            // eslint-disable-next-line sonarjs/cognitive-complexity, max-statements
        },
        {
            key: 'offChange',
            value: function offChange(key, action) {
                var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this;

                var model = this;
                var argsLength = arguments.length;

                // key did not passed
                if ((0, _is.isNotString)(key)) {
                    model.listeners = {};
                    return model;
                }

                var allListeners = model.getAllListeners();

                // action did not passed
                if (argsLength === 1) {
                    allListeners[key] = [];
                    return model;
                }

                if ((0, _is.isNotFunction)(action)) {
                    return model;
                }

                var listenersByKey = model.getListenersByKey(key);

                var filtered = [];

                var listenerDataLength = listenersByKey.length;
                var listenerDataIndex = 0;

                if (argsLength === 2) {
                    // eslint-disable-next-line no-loops/no-loops
                    for (; listenerDataIndex < listenerDataLength; listenerDataIndex += 1) {
                        var listenerData = listenersByKey[listenerDataIndex];

                        if (listenerData[0] !== action) {
                            filtered.push(listenerData);
                        }
                    }

                    allListeners[key] = filtered;
                    return model;
                }

                if (argsLength === 3) {
                    // eslint-disable-next-line no-loops/no-loops
                    for (; listenerDataIndex < listenerDataLength; listenerDataIndex += 1) {
                        var _listenerData = listenersByKey[listenerDataIndex];

                        if (_listenerData[0] !== action || _listenerData[1] !== context) {
                            filtered.push(_listenerData);
                        }
                    }

                    allListeners[key] = filtered;
                    return model;
                }

                return model;
            }

            /**
             *
             * @param {MainModel} mainModel - other model to start listen
             * @param {string} key of value
             * @param {function} action was execute
             * @param {*} [context] of action
             * @returns {MainModel} instance
             */
        },
        {
            key: 'listenTo',
            value: function listenTo(mainModel, key, action) {
                var context = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this;

                var model = this;
                var listening = model.getListening();

                listening.push([mainModel, key, action, context]);
                mainModel.onChange(key, action, context);

                return model;
            }

            /**
             * @param {MainModel} [mainModel] - other model to stop listen
             * @param {string} [key] of value
             * @param {function} [action] was execute
             * @param {*} [context] of action
             * @return {MainModel} instance
             */
            // eslint-disable-next-line sonarjs/cognitive-complexity
        },
        {
            key: 'stopListening',
            value: function stopListening(mainModel, key, action) {
                var context = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this;

                var model = this;
                var argsLength = arguments.length;
                var listening = model.getListening();

                if (argsLength === 0) {
                    listening.forEach(function(_ref) {
                        var _ref2 = (0, _slicedToArray3.default)(_ref, 4),
                            listMainModel = _ref2[0],
                            listKey = _ref2[1],
                            listAction = _ref2[2],
                            listContext = _ref2[3];

                        model.stopListening(listMainModel, listKey, listAction, listContext);
                    });
                    return model;
                }

                if (argsLength === 1) {
                    listening.forEach(function(_ref3) {
                        var _ref4 = (0, _slicedToArray3.default)(_ref3, 4),
                            listMainModel = _ref4[0],
                            listKey = _ref4[1],
                            listAction = _ref4[2],
                            listContext = _ref4[3];

                        if (listMainModel === mainModel) {
                            model.stopListening(listMainModel, listKey, listAction, listContext);
                        }
                    });
                    return model;
                }

                if (argsLength === 2) {
                    listening.forEach(function(_ref5) {
                        var _ref6 = (0, _slicedToArray3.default)(_ref5, 4),
                            listMainModel = _ref6[0],
                            listKey = _ref6[1],
                            listAction = _ref6[2],
                            listContext = _ref6[3];

                        if (listMainModel === mainModel && listKey === key) {
                            model.stopListening(listMainModel, listKey, listAction, listContext);
                        }
                    });
                    return model;
                }

                if (argsLength === 3) {
                    listening.forEach(function(_ref7) {
                        var _ref8 = (0, _slicedToArray3.default)(_ref7, 4),
                            listMainModel = _ref8[0],
                            listKey = _ref8[1],
                            listAction = _ref8[2],
                            listContext = _ref8[3];

                        if (listMainModel === mainModel && listKey === key && listAction === action) {
                            model.stopListening(listMainModel, listKey, listAction, listContext);
                        }
                    });
                    return model;
                }

                model.listening = listening.filter(function(_ref9) {
                    var _ref10 = (0, _slicedToArray3.default)(_ref9, 4),
                        listMainModel = _ref10[0],
                        listKey = _ref10[1],
                        listAction = _ref10[2],
                        listContext = _ref10[3];

                    if (
                        mainModel &&
                        listMainModel === mainModel &&
                        listKey === key &&
                        listAction === action &&
                        listContext === context
                    ) {
                        mainModel.offChange(listKey, listAction, listContext);
                        return false;
                    }
                    return true;
                });

                return model;
            }

            /**
             *
             * @param {string} key of value
             * @param {*} [newValue] of instance
             * @param {*} [oldValue] of instance
             * @return {MainModel} instance
             */
        },
        {
            key: 'trigger',
            value: function trigger(key, newValue, oldValue) {
                var model = this;
                var listeners = model.getListenersByKey(key);
                var argsLength = arguments.length;

                var oldValueArg = null;
                var newValueArg = null;

                if (argsLength === 1) {
                    oldValueArg = model.get(key);
                    newValueArg = oldValueArg;
                }

                if (argsLength === 2) {
                    oldValueArg = model.get(key);
                    newValueArg = newValue;
                }

                if (argsLength === 3) {
                    oldValueArg = oldValue;
                    newValueArg = newValue;
                }

                var listenerDataLength = listeners.length;
                var listenerDataIndex = 0;

                // eslint-disable-next-line no-loops/no-loops
                for (; listenerDataIndex < listenerDataLength; listenerDataIndex += 1) {
                    var listenerData = listeners[listenerDataIndex];

                    (0, _apply2.default)(listenerData[0], listenerData[1], [newValueArg, oldValueArg]);
                }

                return model;
            }

            /**
             *
             * @param {string} key - of value
             * @param {function} test - for new value of key
             * @param {function} onValid - run if key right
             * @param {function} onInvalid - run if key wrong
             * @param {*} [context] of actions
             * @returns {MainModel} instance
             */
        },
        {
            key: 'setValidation',
            value: function setValidation(key, test, onValid, onInvalid) {
                var context = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : this;

                var model = this;

                model.onChange(
                    key,
                    function(newValue, oldValue) {
                        var args = [newValue, oldValue];

                        return (0, _apply2.default)(test, context, args)
                            ? (0, _apply2.default)(onValid, context, args)
                            : (0, _apply2.default)(onInvalid, context, args);
                    },
                    context
                );

                return model;
            }

            /**
             *
             * @return {object} all attributes
             */
        },
        {
            key: 'getAllAttributes',
            value: function getAllAttributes() {
                return this.attr;
            }

            /**
             *
             * @return {object} all listeners
             */
        },
        {
            key: 'getAllListeners',
            value: function getAllListeners() {
                return this.listeners;
            }

            /**
             *
             * @return {*[]} all listening
             */
        },
        {
            key: 'getListening',
            value: function getListening() {
                return this.listening;
            }

            /**
             *
             * @param {string} key of value
             * @return {*[]} of listeners filtered by key
             */
        },
        {
            key: 'getListenersByKey',
            value: function getListenersByKey(key) {
                var model = this;
                var listeners = model.listeners;

                if (listeners.hasOwnProperty(key)) {
                    return listeners[key];
                }

                listeners[key] = [];

                return listeners[key];
            }

            // helpers
        },
        {
            key: 'setKeyValue',
            value: function setKeyValue(key, newValue) {
                var model = this;
                var attr = model.attr;
                var oldValue = model.get(key);

                attr[key] = newValue;

                if (oldValue !== newValue) {
                    model.trigger(key, newValue, oldValue);
                }
                return model;
            }

            /*
        setObject(obj: {|+[key: KeyNameType]: ValueType|}): this {
            const model = this;
             Object.keys(obj).forEach((key: KeyNameType) => {
                model.setKeyValue(key, obj[key]);
            });
             return model;
        }
        */
        }
    ]);
    return MainModel;
})();

/* global module */

/* eslint-disable complexity */

/* eslint consistent-this: ["error", "model"] */

exports.default = MainModel;
