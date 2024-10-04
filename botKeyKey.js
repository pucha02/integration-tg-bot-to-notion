import TelegramBot from "node-telegram-bot-api";
import { main } from "./index.js";
import createPropertiesForNewPages from "./dataInNotion.js";
import dataBaseIdNotion from "./dataTablesId.js";
import { sendingToNotionDB } from "./botFunctions/sendingToNotionDB.js";

const _token = process.env.TELEGRAM_BOT_KEY;

const bot = new TelegramBot(_token, { polling: true });

const userStates = new Map();
const userTexts = new Map();

bot.on("message", startBotMassage);

bot.onText(/\/add/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Увведіть назву проекту, який хочете додати");
  userStates.set(chatId, "adding_new_project");

});

function startBotMassage(msg) {
  if (!msg.text.startsWith("/")&&msg.text) {
    const chatId = msg.chat.id;
    switch (userStates.get(chatId)) {
      case "awaiting_project":
        sendingToNotionDB(bot, msg, chatId, userTexts, userStates, dataBaseIdNotion, createPropertiesForNewPages, main)
        break;
    
      case "adding_new_project":
        bot.sendMessage(chatId, "Увведіть id таблиці");
        userStates.set(chatId, "database_ID");
        break;
      
      case "database_ID":
        dataBaseIdNotion[`${userTexts}`] = ""
    
      default:
        if (msg.text) {
          userTexts.set(chatId, msg.text);
          userStates.set(chatId, "awaiting_project");
          bot.sendMessage(chatId, `До якого проекту додати задачу?`);
        } else {
          bot.sendMessage(chatId, "Ольга ..");
        }
        break;
    }
    
  }
}
