import TelegramBot from "node-telegram-bot-api";
import { main } from "./index.js";
import createPropertiesForNewPages from "./dataInNotion.js";
import dataBaseIdNotion from "./dataTablesId.js";
import { sendingToNotionDB } from "./botFunctions/sendingToNotionDB.js";

const _token = process.env.TELEGRAM_BOT_KEY;

const bot = new TelegramBot(_token, { polling: true });

const userStates = new Map();
const userTexts = new Map();
const keyProjectName = new Map();
const valueProjectName = new Map();

bot.on("message", startBotMassage);

bot.onText(/\/add/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Увведіть назву проекту, який хочете додати");
  userStates.set(chatId, "adding_new_project");
});

function startBotMassage(msg) {
  if (!msg.text.startsWith("/") && msg.text) {
    const chatId = msg.chat.id;
    switch (userStates.get(chatId)) {
      case "awaiting_project":
        sendingToNotionDB(
          bot,
          msg,
          chatId,
          userTexts,
          userStates,
          dataBaseIdNotion,
          createPropertiesForNewPages,
          main
        );
        break;

      case "adding_new_project":
        keyProjectName.set(chatId, msg.text);
        bot.sendMessage(chatId, "Введiть  id таблицi");
        userStates.set(chatId, "setting_database_ID");
        break;

      case "setting_database_ID":
        valueProjectName.set(chatId, msg.text);
        const projectKey = keyProjectName.get(chatId)
        const projectValue = valueProjectName.get(chatId)
        dataBaseIdNotion[`${projectKey}`]=projectValue
        bot.sendMessage(chatId, "проект додан");
        userStates.delete(chatId);
        break;
        
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