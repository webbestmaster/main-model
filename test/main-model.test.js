/* global describe, it, beforeEach, afterEach */
/* eslint no-invalid-this: 0 */

const {assert} = require('chai');
const MainModel = require('./../index');

describe('Main model', () => {
    let model = null;

    beforeEach(() => {
        model = new MainModel();
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

    it('trigger onChange', done => {
        model.onChange('key', () => done());
        model.set('key', 'value');
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

    it('listenTo key/value with/without context', () => {
        const otherModel = new MainModel();
        const changeMyKey = {
            key: ''
        };

        model.listenTo(otherModel, 'keyValueChange', function onKeyValueChange() {
            changeMyKey.key = 'keyValueChange';
            assert(this === model);
        });

        model.listenTo(otherModel, 'keyValueChange', function onKeyValueChange() {
            this.key = 'keyValueChange';
            assert(this === changeMyKey);
        }, changeMyKey);

        otherModel.set('keyValueChange', 'newKeyValue');

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

    it('listenTo passed params', () => {
        const otherModel = new MainModel();

        otherModel.set('checkParam', 'oldCheckParam');

        // check passed params
        model.listenTo(otherModel, 'checkParam', (newValue, oldValue) => {
            assert(newValue === 'newCheckParam');
            assert(oldValue === 'oldCheckParam');
        });

        otherModel.set('checkParam', 'newCheckParam');
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

    it('stop listening', () => {
        const otherModel = new MainModel();
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

        function paramNoPass() {
            counter += 1000;
        }

        model.listenTo(otherModel, 'paramNoPass', paramNoPass);
        model.stopListening(otherModel);
        otherModel.trigger('paramNoPass');

        model.listenTo(otherModel, 'paramOnePass', paramOnePass);
        model.stopListening(otherModel, 'paramOnePass');
        otherModel.trigger('paramOnePass');

        model.listenTo(otherModel, 'paramTwoPass', paramTwoPass);
        model.listenTo(otherModel, 'paramTwoPass', () => paramTwoPass()); // should add 10
        model.stopListening(otherModel, 'paramTwoPass', paramTwoPass);
        otherModel.trigger('paramTwoPass');

        model.listenTo(otherModel, 'paramThreePass', paramThreePass, this);
        model.listenTo(otherModel, 'paramThreePass', () => paramThreePass()); // should add 100
        model.listenTo(otherModel, 'paramThreePass', () => paramThreePass(), {}); // should add 100
        model.stopListening(otherModel, 'paramThreePass', paramThreePass, this);
        otherModel.trigger('paramThreePass');

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

    it('validate', () => {
        let onValidRun = 0;
        let onInvalidRun = 0;

        const newValidValue = 3;
        const newInvalidValue = 7;

        model.setValidation('key',
            (newValue, oldValue) => newValue < 5,
            (newValue, oldValue) => {
                assert(newValue === newValidValue);
                assert(oldValue === undefined); // eslint-disable-line no-undefined
                onValidRun += 1;
            },
            (newValue, oldValue) => {
                assert(newValue === newInvalidValue);
                assert(oldValue === newValidValue);
                onInvalidRun += 1;
            });

        model.set('key', newValidValue);

        assert(onValidRun === 1);
        assert(onInvalidRun === 0);

        model.set('key', newInvalidValue);

        assert(onValidRun === 1);
        assert(onInvalidRun === 1);
    });

    it('destroy', () => {
        model.set({anyParam: 'anyValue'});

        const otherModel = new MainModel();

        model.onChange('anyParam', () => {
        });
        model.listenTo(otherModel, 'anyParam', () => {
        });

        model.destroy();

        assert.deepEqual(model.getListening(), []);
        assert.deepEqual(model.getAllListeners(), {});
        assert.deepEqual(model.getAllAttributes(), {});
    });
});
