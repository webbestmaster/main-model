/* global describe, it, beforeEach, afterEach */
/* eslint no-invalid-this: 0 */

const {assert} = require('chai');
const Mediator = require('./../mediator');

describe('Mediator', () => {
    let mediator = null;

    beforeEach(() => {
        mediator = new Mediator();
        return mediator;
    });

    afterEach(() => mediator.destroy());

    it('constructor', () => {
        mediator = new Mediator();
        assert(mediator instanceof Mediator);
    });

    it('subscribe', () => {
        const channelName = 'myChannel';

        mediator.subscribe(channelName, () => {
        });

        assert(mediator.channels[channelName].length === 1);
    });

    it('publish', done => {
        const channelName = 'coordinates';
        const context = {};
        const data = {
            key1: 1,
            key2: 2
        };

        function getData(arg1, arg2) {
            assert(context === this);
            assert(arg1 === data.key1);
            assert(arg2 === data.key2);
            done();
        }

        mediator.subscribe(channelName, getData, context);

        mediator.publish(channelName, [data.key1, data.key2]);

        // should not any error
        mediator.publish('unExistingChannel', () => {});
    });

    it('unSubscribe', () => {
        const channelName = 'forUnSubscribe';
        const contextFn = {};
        const callbackFn = () => {};

        function subscribe(mediatorForSubscribe) {
            mediatorForSubscribe.unSubscribe();
            mediatorForSubscribe.subscribe(channelName, callbackFn, contextFn);
            mediatorForSubscribe.subscribe(channelName, callbackFn);
        }

        subscribe(mediator);
        assert(mediator.channels[channelName].length === 2);

        // unSubscribe from all channels
        mediator.unSubscribe();
        assert(mediator.channels[channelName].length === 0);


        // unSubscribe from one channels
        subscribe(mediator);
        mediator.unSubscribe(channelName);
        assert(mediator.channels[channelName].length === 0);

        // unSubscribe from channels by callback
        subscribe(mediator);
        mediator.unSubscribe(channelName, callbackFn);
        assert(mediator.channels[channelName].length === 0);

        // unSubscribe from channels by context
        subscribe(mediator);
        mediator.unSubscribe(channelName, null, contextFn);
        assert(mediator.channels[channelName].length === 1);

        // unSubscribe from channels by callback and context
        subscribe(mediator);
        mediator.unSubscribe(channelName, callbackFn, contextFn);
        assert(mediator.channels[channelName].length === 1);

        // should not any error
        mediator.unSubscribe('unExistingChannel', () => {});
    });
});
