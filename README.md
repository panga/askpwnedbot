# AskPwnedBot 

Ask Pwned Bot uses https://haveibeenpwned.com API to check if your account has been pwned.

The implementation of the webhook is done using https://webtask.io/ a serverless solution.

## Test on Telegram

https://t.me/askpwnedbot

## Test on Twitter

https://twitter.com/askpwnedbot

## Deploy on Telegram

1. Create a Telegram Bot and get its token:

https://core.telegram.org/bots

2. Deploy the webtask:

`wt create askpwnedbot-telegram.js --name askpwnedbot-telegram --secret BOT_TOKEN=$BOT_TOKEN`

3. Set the webhook:

```
curl -X POST -d "url=$WEBTASK_URL" -H "Content-Type: application/x-www-form-urlencoded" https://api.telegram.org/bot$BOT_TOKEN/setWebhook
```

## Deploy on Twitter

1. Create a Twitter app + developer account to use Account Activity API

https://developer.twitter.com/en/docs/accounts-and-users/subscribe-account-activity/overview

2. Deploy the webtask:

`wt create askpwnedbot-twitter.js --name askpwnedbot-twitter --secret TWITTER_BOT_ID=$TWITTER_BOT_ID --secret TWITTER_CONSUMER_KEY=$TWITTER_CONSUMER_KEY --secret TWITTER_CONSUMER_SECRET=$TWITTER_CONSUMER_SECRET --secret TWITTER_ACCESS_TOKEN_KEY=$TWITTER_ACCESS_TOKEN_KEY --secret TWITTER_ACCESS_TOKEN_SECRET=$TWITTER_ACCESS_TOKEN_SECRET`

3. Setup the webhook:

`node scripts/setup_twitter_webhook.js`

4. Setup the subscription:

`node scripts/setup_twitter_subscription.js`

## License

[Apache License 2.0](LICENSE)