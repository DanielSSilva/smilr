//
// Smilr bot, using Bot Framework & Builder SDK 3.x
// Ben Coleman, 2018
//

require('dotenv').config()

const restify = require('restify');
const builder = require('botbuilder');
const botbuilder_azure = require("botbuilder-azure");
const utils = require('./utils');
const request = require('request');

// Setup Restify Server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
  console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
const connector = new builder.ChatConnector({
  appId: process.env.MicrosoftAppId,
  appPassword: process.env.MicrosoftAppPassword,
  openIdMetadata: process.env.BotOpenIdMetadata
});


// Listen for messages from users 
server.post('/api/messages', connector.listen());

// var tableName = 'botdata';
// var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
// var tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);
var inMemoryStorage = new builder.MemoryBotStorage();

// Create your bot with a function to receive messages from the user
// This default message handler is invoked if the user's utterance doesn't
// match any intents handled by other dialogs.
var bot = new builder.UniversalBot(connector, function (session, args) {
  session.send("I'm sorry I didn't understand, that.\nI'm not smart, I'm only made of code 😞", session.message.text);
  session.beginDialog('HelpDialog');
});

bot.set('storage', inMemoryStorage);

// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v2.0/apps/' + luisAppId + '?subscription-key=' + luisAPIKey;

// Create a recognizer that gets intents from LUIS, and add it to the bot
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
bot.recognizer(recognizer);

// Add first run dialog
bot.dialog('firstRun', function (session) {    
  session.userData.firstRun = true;
  session.beginDialog('GreetingDialog')
}).triggerAction({
  onFindAction: function (context, callback) {
      // Only trigger if we've never seen user before
      if (!context.userData.firstRun) {
          // Return a score of 1.1 to ensure the first run dialog wins
          callback(null, 1.1);
      } else {
          callback(null, 0.0);
      }
  }
});

// Add a dialog for each intent that the LUIS app recognizes.
// See https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-recognize-intent-luis 
bot.dialog('GreetingDialog',
  (session) => {
    let r = utils.getRandomInt(3);
    switch (r) {
      case 0: intro = "Hi! I'm Smilr,"; break;
      case 1: intro = "Hello, welcome to Smilr"; break;
      case 2: intro = "This is Smilr"; break;
    }
    session.send(`${intro}, I'm a bot for giving feedback on events, hacks and workshops you have attended`);
    session.endDialog();
  }
).triggerAction({
  matches: 'greeting'
})

bot.dialog('HelpDialog', [
  (session) => {
    let r = utils.getRandomInt(3);
    switch (r) {
      case 0: intro = "I think you could do with some help"; break;
      case 1: intro = "Maybe you need some help"; break;
      case 2: intro = "Sounds like you need a hand"; break;
    }

    session.send(`${intro}`);
    builder.Prompts.confirm(session, "Would you like to see today's events?");
  },
  (session, results) => {
    if(results.response) {
      session.beginDialog('ActiveEventsDialog');
    }
  }]
).triggerAction({
  matches: 'help'
})

bot.dialog('ActiveEventsDialog', [
  async (session) => {
    let eventsCount = 0;
    let res = await request('http://smilr-api.azurewebsites.net/api/events');

    console.log(res);
    
    if(eventsCount > 0) {
      session.endDialog(`HERE'S YOUR EVENTS HUMAN`);
    } else {
      session.endDialog(`Sorry there are no events running today`);
    }
    session.endDialog();
  }]
).triggerAction({
  matches: 'events-active'
})

bot.dialog('CancelDialog',
  (session) => {
    session.send(`OK, let's not do that`);
    session.endDialog();
  }
).triggerAction({
  matches: 'cancel'
})



