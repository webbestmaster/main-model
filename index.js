/* global module */
/* eslint-disable no-underscore-dangle */

/**
 *
 * @param {object} attributes of new MainModel instance
 * @return {MainModel} instance
 */
class MainModel {
    constructor(attributes) {
        console.log('Created Model ->', this.constructor.name);
        console.log(this);

        const model = this;

        model._listeners = {};
        model._attr = {};

        if (attributes) {
            model.set(attributes);
        }
    }

    destroy() {
        const model = this;

        model._attr = {};
        model.offChange();
    }

    /**
     *
     * @param {string|object} key of value
     * @param {*} [value] saved value
     * @return {MainModel} instance
     */
    set(key, value) {
        return typeof key === 'string' ? this._setKeyValue(key, value) : this._setObject(key);
    }

    /**
     *
     * @param {String} key of value
     * @return {*} saved value
     */
    get(key) {
        return this._attr[key];
    }

    /**
     *
     * @param {string} key of value
     * @param {number} deltaValue to change current value
     * @return {MainModel} instance
     */
    changeBy(key, deltaValue) {
        const model = this;

        return model._setKeyValue(key, model.get(key) + deltaValue);
    }

    /**
     *
     * @param {string} key of value
     * @param {Function} action to execute
     * @param {*} [context] of action
     * @return {MainModel} instance
     */
    onChange(key, action, context) {
        const model = this;
        const listeners = model.getListenersByKey(key);

        listeners.push([action, context || model]);

        return model;
    }

    /**
     *
     * @param {string} [key] of value
     * @param {Function} [action] was execute
     * @param {*} [context] of action
     * @return {MainModel} instance
     */
    offChange(key, action, context) {
        const model = this;

        const argsLength = arguments.length;

        // key did not passed
        if (argsLength === 0) {
            model._listeners = {};
            return model;
        }

        const allListeners = model.getAllListeners();

        // action did not passed
        if (argsLength === 1) {
            allListeners[key] = [];
            return model;
        }

        const listenersByKey = model.getListenersByKey(key);

        // context did not passed
        if (argsLength === 2) {
            allListeners[key] = listenersByKey.filter(listener => listener[0] !== action);
            return model;
        }

        allListeners[key] = listenersByKey.filter(listener => listener[0] !== action || listener[1] !== context);

        return model;
    }

    /**
     *
     * @param {string} key of value
     * @param {*} [newValue] of instance
     * @param {*} [oldValue] of instance
     * @return {MainModel} instance
     */
    trigger(key, newValue, oldValue) {
        const model = this;
        const listeners = model.getListenersByKey(key);
        const argsLength = arguments.length;

        let oldValueArg = null;
        let newValueArg = null;

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

        listeners.forEach(listenerData => Reflect.apply(listenerData[0], listenerData[1], [newValueArg, oldValueArg]));

        return model;
    }

    /**
     *
     * @return {*} all attributes
     */
    getAllAttributes() {
        return this._attr;
    }

    /**
     *
     * @return {*} all listeners
     */
    getAllListeners() {
        return this._listeners;
    }

    /**
     *
     * @param {string} key of value
     * @return {Array} of listeners filtered by key
     */
    getListenersByKey(key) {
        const model = this;
        const listeners = model._listeners;
        const listenersByKey = listeners[key];

        if (listenersByKey) {
            return listenersByKey;
        }

        listeners[key] = [];

        return listeners[key];
    }

    // helpers

    _setObject(obj) {
        const model = this;

        Object.keys(obj).forEach(key => model._setKeyValue(key, obj[key]));

        return model;
    }

    _setKeyValue(key, newValue) {
        const model = this;
        const attr = model._attr;
        const oldValue = attr[key];

        if (oldValue !== newValue) {
            attr[key] = newValue;
            model.trigger(key, newValue, oldValue);
        }

        return model;
    }
}

module.exports = MainModel;
