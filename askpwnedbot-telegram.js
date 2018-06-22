'use strict';

const Request = require('request-promise');
const Promise = require('bluebird');
const _ = require('lodash');

function processCommand(text) {
    if (text.startsWith('/')) {
        return Promise.resolve()
            .bind(this)
            .then(helpMessage);
    } else {
        return Promise.resolve(text)
            .bind(this)
            .then(getBreaches)
            .then(processBreaches);
    }
}

function helpMessage() {
    return Promise
        .resolve(`Hi ${this.message.chat.first_name}! Type your email and I'll verify if you have been pwned ;-)`)
        .bind(this);
}

function getBreaches(account) {
    return Request.get(`https://haveibeenpwned.com/api/v2/breachedaccount/${account}?truncateResponse=true`, {
        headers: {
            'User-Agent': 'AskPwnedBot-Telegram'
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

function sendResponse(message) {
    return Request.post(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
        form: {
            chat_id: this.message.chat.id,
            reply_to_message_id: this.message.message_id,
            text: message
        }
    }).catch((e) => {
        return [];
    });
};

module.exports = (ctx, cb) => {
    if (ctx.body && ctx.body.message) {
        const context = {
            botToken: ctx.secrets.BOT_TOKEN,
            message: ctx.body.message,
        };

        Promise
            .resolve(context.message.text)
            .bind(context)
            .then(processCommand)
            .then(sendResponse)
            .catch((e) => {
                cb(e);
            }).finally(() => {
                cb(null, {});
            });
    } else {
        cb(null, {});
    }
}