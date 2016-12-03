var TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
var token = '318996965:AAHGWoq-jJSAZf0lrwcYXOhDDrseVW3kWbU';

// Create a bot that uses 'polling' to fetch new updates
var bot = new TelegramBot(token, { polling: true });

module.exports = bot;

/*
// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, function (msg, match) {
  console.log('msg, match', msg, match);
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  var chatId = msg.chat.id;
  var resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', function (msg) {
  var chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, "Received your message");
});
*/
