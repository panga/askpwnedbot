'use strict';

const request = require('request');

let twitterEnv = process.env.TWITTER_ENV;
let twitterBearer = process.env.TWITTER_BEARER;

const requestOptions = {
  url: `https://api.twitter.com/1.1/account_activity/all/${twitterEnv}/webhooks.json`,
  auth: {
    bearer: twitterBearer
  }
};

request.get(requestOptions, function (error, response, body) {
  console.log(body);
})