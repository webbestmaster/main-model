/* global describe, it, beforeEach, afterEach */
/* eslint no-invalid-this: 0 */

const {assert} = require('chai');
const MainModel = require('./../index');

describe('Main model', function baseModelTest() {
    let model = null;

    beforeEach(() => {
        model = new MainModel();
        return model;
    });

    afterEach(() => model.destroy());

    it('constructor', () => {
        model = new MainModel({prop: 'value'});
        assert(model.get('prop') === 'value');
    });

    it('set/get/changeBy', () => {
        model.set('key-1', 'value-1');
        assert(model.get('key-1') === 'value-1');

        model.set({'key-2': 'value-2'});
        assert(model.get('key-2') === 'value-2');

        model.set({'key-3': 1});
        model.changeBy('key-3', 2);
        assert(model.get('key-3') === 3);
    });

    it('onChange key/value with/without context', () => {
        const changeMyKey = {
            key: ''
        };

        model.onChange('keyValueChange', function onKeyValueChange() {
            changeMyKey.key = 'keyValueChange';
            assert(this === model);
        });

        model.onChange('keyValueChange', function onKeyValueChange() {
            this.key = 'keyValueChange';
            assert(this === changeMyKey);
        }, changeMyKey);

        model.set('keyValueChange', 'newKeyValue');

        assert(changeMyKey.key === 'keyValueChange');
    });

    it('onChange passed params', () => {
        model.set('checkParam', 'oldCheckParam');

        // check passed params
        model.onChange('checkParam', (newValue, oldValue) => {
            assert(newValue === 'newCheckParam');
            assert(oldValue === 'oldCheckParam');
        });

        model.set('checkParam', 'newCheckParam');
    });

    it('offChange', () => {
        let counter = 0;

        function paramOnePass() {
            counter += 1;
        }

        function paramTwoPass() {
            counter += 10;
        }

        function paramThreePass() {
            counter += 100;
        }

        model.onChange('paramOnePass', paramOnePass);
        model.offChange('paramOnePass');
        model.trigger('paramOnePass');

        model.onChange('paramTwoPass', paramTwoPass);
        model.onChange('paramTwoPass', () => paramTwoPass()); // should add 10
        model.offChange('paramTwoPass', paramTwoPass);
        model.trigger('paramTwoPass');

        model.onChange('paramThreePass', paramThreePass, this);
        model.onChange('paramThreePass', () => paramThreePass()); // should add 100
        model.onChange('paramThreePass', () => paramThreePass(), {}); // should add 100
        model.offChange('paramThreePass', paramThreePass, this);
        model.trigger('paramThreePass');

        assert(counter === 210);
    });

    it('trigger - 1 param', () => {
        const triggerValue = 'triggerValue';

        model.set('triggerParam', triggerValue);

        model.onChange('triggerParam', (newValue, oldValue) => {
            assert(newValue === triggerValue);
            assert(oldValue === triggerValue);
        });

        model.trigger('triggerParam');
    });

    it('trigger - 2 param', () => {
        const triggerValue = 'triggerValue';
        const triggerNewValue = 'triggerNewValue';

        model.set('triggerParam', triggerValue);

        model.onChange('triggerParam', (newValue, oldValue) => {
            assert(newValue === triggerNewValue);
            assert(oldValue === triggerValue);
        });

        model.trigger('triggerParam', triggerNewValue);
    });

    it('trigger - 3 param', () => {
        const triggerValue = 'triggerValue';
        const triggerNewValue = 'triggerNewValue';
        const triggerOldValue = 'triggerOldValue';

        model.set('triggerParam', triggerValue);

        model.onChange('triggerParam', (newValue, oldValue) => {
            assert(newValue === triggerNewValue);
            assert(oldValue === triggerOldValue);
        });

        model.trigger('triggerParam', triggerNewValue, triggerOldValue);
    });

    it('do not extra trigger', () => {
        let shouldBeTrue = true;
        const value = 'checkValue';

        model.set('checkParam', value);

        // check passed params
        model.onChange('checkParam', () => {
            shouldBeTrue = false;
        });

        model.set('checkParam', value);

        assert(shouldBeTrue);
    });

    it('destroy', () => {
        model.set({anyParam: 'anyValue'});

        model.onChange('anyParam', () => {
        });

        model.destroy();

        assert.deepEqual(model.getAllListeners(), {});
        assert.deepEqual(model.getAllAttributes(), {});
    });
});
