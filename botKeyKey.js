import TelegramBot from "node-telegram-bot-api";
import { main } from "./index.js"; // Это импорт твоей функции main, если она используется
import createPropertiesForNewPages from "./dataInNotion.js";
import dataBaseIdNotion from "./dataTablesId.js";

const _token = process.env.TELEGRAM_BOT_KEY;

let a;

const bot = new TelegramBot(_token, { polling: true });

const userStates = new Map();
const userTexts = new Map();

bot.on("message", startBotMassage);

function startBotMassage (msg) {
    const chatId = msg.chat.id;
  
    if (userStates.get(chatId) === "awaiting_project") {
      const projectName = msg.text;
  
      const taskName = userTexts.get(chatId);
  
      const response = `Ви додали задачу у таблицю ${projectName}`;
      console.log();
      bot.sendMessage(chatId, response);
  
      var transformProjectName = projectName
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase();
      console.log(transformProjectName);
  
      if (dataBaseIdNotion.hasOwnProperty(transformProjectName)) {
        try {
          const propertiesForNewPages = createPropertiesForNewPages(taskName);
          main(propertiesForNewPages, dataBaseIdNotion[transformProjectName]);
          bot.sendMessage(chatId, "Ви успішно відправили задачу");
        } catch (error) {
          console.error("Ошибка при отправке POST-запроса:", error);
        }
      } else {
        bot.sendMessage(chatId, "Неправильно введено назву проекту");
      }
  
      userStates.delete(chatId);
    } else {
      if (msg.text) {
        userTexts.set(chatId, msg.text);
        userStates.set(chatId, "awaiting_project");
        bot.sendMessage(chatId, "До якого проекту додати задачу? ");
      } else {
        bot.sendMessage(chatId, "Ольга ..");
      }
    }
}