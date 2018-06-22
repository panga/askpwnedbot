const request = require('request');

let twitterOAuth = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    token: process.env.TWITTER_ACCESS_TOKEN_KEY,
    token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  };
  
const dm_params = {
  "event": {
    "type": "message_create",
    "message_create": {
      "target": {
        "recipient_id": "36847073"
      },
      "message_data": {
        "text": "What color bird is your fav?",
        "quick_reply": {
          "type": "options",
          "options": [
            {
              "label": "Red Bird",
              "description": "A description about the red bird.",
              "metadata": "external_id_1"
            },
            {
              "label": "Blue Bird",
              "description": "A description about the blue bird.",
              "metadata": "external_id_2"
            },
            {
              "label": "Black Bird",
              "description": "A description about the black bird.",
              "metadata": "external_id_3"
            },
            {
              "label": "White Bird",
              "description": "A description about the white bird.",
              "metadata": "external_id_4"
            }
          ]
        }
      }
    }
  }
}

const request_options = {
  url: 'https://api.twitter.com/1.1/direct_messages/events/new.json',
  oauth: twitterOAuth,
  json: true,
  headers: {
    'content-type': 'application/json'
  },
  body: dm_params
}

request.post(request_options, function (error, response, body) {
  console.log(body)
});