'use strict';

var _apply = require('babel-runtime/core-js/reflect/apply');

var _apply2 = _interopRequireDefault(_apply);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _is = require('./is');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @param {object} attributes of new MainModel instance
 * @return {MainModel} instance
 */


// type AttrType = {
// [key: string]: AttrTypeT
// };

var MainModel = function () {

    // listening: ListeningType<MainModel, KeyNameType, ActionType<ValueType>, {}>;

    function MainModel(key, value) {
        (0, _classCallCheck3.default)(this, MainModel);

        var model = this;

        model.attr = {};
        model.listeners = {};
        // model.listening = [];

        if ((0, _is.isNotUndefined)(key) && (0, _is.isNotUndefined)(value)) {
            model.attr[key] = value;
        }
    }

    /**
     * @return {void}
     */


    (0, _createClass3.default)(MainModel, [{
        key: 'destroy',
        value: function destroy() {
            var model = this;

            model.attr = {};
            // model.offChange();
            // model.stopListening();
        }

        /**
         *
         * @param {string} key of value
         * @param {*} [value] saved value
         * @return {MainModel} instance
         */

    }, {
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

    }, {
        key: 'get',
        value: function get(key) {
            var attr = this.attr;


            return attr[key];
        }

        /**
         *
         * @param {string} key of value
         * @param {function} action to execute
         * @param {*} [context] of action
         * @return {MainModel} instance
         */

    }, {
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

    }, {
        key: 'offChange',
        value: function offChange(key, action, context) {
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
        /*
        listenTo(mainModel: MainModel, key: KeyNameType, action: ActionType<ValueType>, context?: {} = this): this {
            const model = this;
            const listening = model.getListening();
             listening.push([mainModel, key, action, context]);
            mainModel.onChange(key, action, context);
             return model;
        }
        */

        /**
         * @param {MainModel} [mainModel] - other model to stop listen
         * @param {string} [key] of value
         * @param {function} [action] was execute
         * @param {*} [context] of action
         * @return {MainModel} instance
         */
        // stopListening(mainModel?: MainModel, key?: KeyNameType, action?: ActionType<ValueType>, context?: {}): this {
        //     const model = this;
        //     const argsLength = arguments.length;
        //     const listening = model.getListening();
        //
        //     if (argsLength === 0) {
        //         listening.forEach(
        //             ([listMainModel, listKey, listAction, listContext]: ListeningItemType): MainModel =>
        //                 model.stopListening(listMainModel, listKey, listAction, listContext)
        //         );
        //         return model;
        //     }
        //
        //     if (argsLength === 1) {
        //         listening.forEach(
        //             ([listMainModel, listKey, listAction, listContext]: ListeningItemType): MainModel | boolean =>
        //                 listMainModel === mainModel && model.stopListening(listMainModel, listKey, listAction, listContext)
        //         );
        //         return model;
        //     }
        //
        //     if (argsLength === 2) {
        //         listening.forEach(
        //             ([listMainModel, listKey, listAction, listContext]: ListeningItemType): MainModel | boolean =>
        //                 listMainModel === mainModel &&
        //                 listKey === key &&
        //                 model.stopListening(listMainModel, listKey, listAction, listContext)
        //         );
        //         return model;
        //     }
        //
        //     if (argsLength === 3) {
        //         listening.forEach(
        //             ([listMainModel, listKey, listAction, listContext]: ListeningItemType): MainModel | boolean =>
        //                 listMainModel === mainModel &&
        //                 listKey === key &&
        //                 listAction === action &&
        //                 model.stopListening(listMainModel, listKey, listAction, listContext)
        //         );
        //         return model;
        //     }
        //
        //     model.listening = listening.filter(
        //         ([listMainModel, listKey, listAction, listContext]: ListeningItemType): boolean => {
        //             if (
        //                 mainModel &&
        //                 listMainModel === mainModel &&
        //                 listKey === key &&
        //                 listAction === action &&
        //                 listContext === context
        //             ) {
        //                 mainModel.offChange(listKey, listAction, listContext);
        //                 return false;
        //             }
        //             return true;
        //         }
        //     );
        //
        //     return model;
        // }

        /**
         *
         * @param {string} key of value
         * @param {*} [newValue] of instance
         * @param {*} [oldValue] of instance
         * @return {MainModel} instance
         */

    }, {
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
         * @return {object} all attributes
         */

    }, {
        key: 'getAllAttributes',
        value: function getAllAttributes() {
            return this.attr;
        }

        /**
         *
         * @return {object} all listeners
         */

    }, {
        key: 'getAllListeners',
        value: function getAllListeners() {
            return this.listeners;
        }

        /**
         *
         * @return {*[]} all listening
         */
        // getListening(): ListeningType<MainModel, KeyNameType, ActionType<ValueType>, {}> {
        //     return this.listening;
        // }

    }, {
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

    }, {
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

    }]);
    return MainModel;
}();

/* global module */

/* eslint-disable complexity */

/* eslint consistent-this: ["error", "model"] */

module.exports = MainModel;