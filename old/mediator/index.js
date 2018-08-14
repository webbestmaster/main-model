/* global module */

class Mediator {
    constructor() {
        this.channels = {};
    }

    /**
     *
     * @param {string} channel - channel id
     * @param {function} callback - callback function
     * @param {object} [context] - function context
     * @return {Mediator} - current object
     */
    subscribe(channel, callback, context = this) {
        const mediator = this;
        const {channels} = mediator;

        if (!channels.hasOwnProperty(channel)) {
            channels[channel] = [];
        }

        channels[channel].push([callback, context]);

        return mediator;
    }

    /**
     *
     * @param {string} channel - channel id
     * @param {*[]} [args] - list of arguments
     * @return {Mediator} - current object
     */
    publish(channel, args = []) {
        const mediator = this;
        const {channels} = mediator;

        if (!channels.hasOwnProperty(channel)) {
            return mediator;
        }

        channels[channel].forEach(([callback, context]) => Reflect.apply(callback, context, args));

        return mediator;
    }

    /**
     *
     * @param {string} [channel] - channel id
     * @param {function} [callback] - callback function
     * @param {*} [context] - function context
     * @return {Mediator} - current object
     */
    unSubscribe(channel, callback = null, context = null) {
        const mediator = this;
        const {channels} = mediator;

        if (!channel) {
            Object.keys(channels).forEach((channelName) => mediator.unSubscribe(channelName));
            return mediator;
        }

        if (!channels.hasOwnProperty(channel)) {
            return mediator;
        }

        if (callback === null && context === null) {
            channels[channel] = [];
            return mediator;
        }

        if (callback !== null && context === null) {
            channels[channel] = channels[channel].filter((item) => item[0] !== callback);
            return mediator;
        }

        if (callback === null && context !== null) {
            channels[channel] = channels[channel].filter((item) => item[1] !== context);
            return mediator;
        }

        channels[channel] = channels[channel].filter(
            ([channelCallback, channelContext]) => channelCallback !== callback || channelContext !== context
        );

        return mediator;
    }

    destroy() {
        this.channels = {};
    }
}

module.exports = Mediator;
