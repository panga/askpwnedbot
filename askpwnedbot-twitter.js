'use strict';

const Crypto = require('crypto');
const Request = require('request-promise');
const Promise = require('bluebird');
const _ = require('lodash');

function processEvents(events) {
    let promises = [];
    let parent = this;

    if (events && events.direct_message_events) {
        _.forEach(events.direct_message_events, (dmEvent) => {
            if (dmEvent.type === 'message_create') {
                const text = dmEvent.message_create.message_data.text;
                const sender_id = dmEvent.message_create.sender_id;

                if (sender_id !== parent.twitter.bot_id) {
                    const context = _.merge({
                        sender_id: sender_id
                    }, parent);

                    promises.push(Promise.resolve(text)
                        .bind(context)
                        .then(getBreaches)
                        .then(processBreaches)
                        .then(sendResponse));
                }
            }
        });
    }

    return Promise.all(promises).bind(parent);
}

function getBreaches(account) {
    return Request.get(`https://haveibeenpwned.com/api/v2/breachedaccount/${account}?truncateResponse=true`, {
        headers: {
            'User-Agent': 'AskPwnedBot-Twitter'
        },
        json: true
    }).catch((e) => {
        return [];
    });
}

function processBreaches(breaches) {
    if (breaches.length === 0) {
        return Promise
            .resolve("You're lucky! You have not been pwned yet ;-)")
            .bind(this);
    } else {
        const domains = _.reduce(breaches, function(acc, obj) {
            return acc + (acc === '' ? '' : ', ') + obj.Name;
        }, '');

        return Promise
            .resolve(`Ohh, you have been pwned ${breaches.length} time(s)! Domain(s): ${domains}`)
            .bind(this);
    }
}

function sendResponse(responseText) {
    const message = {
        event: {
            type: 'message_create',
            message_create: {
                target: {
                    recipient_id: this.sender_id
                },
                message_data: {
                    text: responseText
                }
            }
        }
    };

    return Request.post(`https://api.twitter.com/1.1/direct_messages/events/new.json`, {
        oauth: this.twitter.oauth,
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'AskPwnedBot-Twitter'
        },
        body: message
    });
};

module.exports = (ctx, cb) => {
    if (ctx.query.crc_token) {
        const token = ctx.query.crc_token;
        console.log(`Handling CRC request for token=${token}`);
        const twitterCrc = Crypto
            .createHmac('sha256', ctx.secrets.TWITTER_CONSUMER_SECRET)
            .update(token)
            .digest('base64');
        cb(null, {
            response_token: "sha256=" + twitterCrc
        });
    } else {
        let twitter = {
            bot_id: "" + ctx.secrets.TWITTER_BOT_ID,
            oauth: {
                consumer_key: ctx.secrets.TWITTER_CONSUMER_KEY,
                consumer_secret: ctx.secrets.TWITTER_CONSUMER_SECRET,
                token: ctx.secrets.TWITTER_ACCESS_TOKEN_KEY,
                token_secret: ctx.secrets.TWITTER_ACCESS_TOKEN_SECRET
            }
        };

        const context = {
            twitter: twitter,
            events: ctx.body,
        };

        Promise
            .resolve(context.events)
            .bind(context)
            .then(processEvents)
            .catch((e) => {
                cb(e);
            }).finally(() => {
                cb(null, {});
            });
    }
}