# AskPwnedBot 

Ask Pwned Bot uses https://haveibeenpwned.com API to check if your account has been pwned.

The implementation of the webhook is done using https://webtask.io/ a serverless solution.

## Test on Telegram

https://t.me/askpwnedbot

## Deploy on Telegram

1. Create a Telegram Bot and get its token:

https://core.telegram.org/bots

2. Deploy the webtask:

`wt create askpwnedbot-telegram.js --secret BOT_TOKEN=$BOT_TOKEN`

3. Set the webhook:

```
curl -X POST -d "url=$WEBTASK_URL" -H "Content-Type: application/x-www-form-urlencoded" https://api.telegram.org/bot$BOT_TOKEN/setWebhook
```

## License

[Apache License 2.0](LICENSE)