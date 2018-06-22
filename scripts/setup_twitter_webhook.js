'use strict';

const request = require('request');

let twitterOAuth = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  token: process.env.TWITTER_ACCESS_TOKEN_KEY,
  token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
};

let twitterEnv = process.env.TWITTER_ENV;
let webhookUrl = process.env.TWITTER_WEBTASK_URL;

let requestOptions = {
  url: `https://api.twitter.com/1.1/account_activity/all/${twitterEnv}/webhooks.json`,
  oauth: twitterOAuth,
  headers: {
    'Content-type': 'application/x-www-form-urlencoded'
  },
  form: {
    url: webhookUrl
  }
};

request.post(requestOptions, function (error, response, body) {
  console.log(body);
})