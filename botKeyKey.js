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

const showMenu = (chatId) => {
  bot.sendMessage(chatId, "Вітаємо у нашому боті", {
    reply_markup: {
      keyboard: [
        [{ text: "Додати проєкт" }],
        [{ text: "Подивитися список проектів" }],
        [{ text: "Відмінити дію" }],
        [{ text: "Видалити проєкт" }],
      ],
      resize_keyboard: true,
      one_time_keyboard: false,
    },
  });
};

bot.on("message", startBotMassage);

bot.onText(/\/add/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Увведіть назву проекту, який хочете додати");
  userStates.set(chatId, "adding_new_project");
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  showMenu(chatId);
  bot.sendMessage(msg.chat.id, "Введіть задачу")
});

bot.onText(/Додати проєкт/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Увведіть назву проекту, який хочете додати");
  userStates.set(chatId, "adding_new_project");
});

bot.onText(/Подивитися список проектів/, (msg) => {
  const chatId = msg.chat.id;
  const projectsList = Object.keys(dataBaseIdNotion).join("\n");
  bot.sendMessage(chatId, `Список проектів:\n${projectsList}`);
});

bot.onText(/Відмінити дію/, (msg) => {
  userStates.delete(msg.chat.id);
  bot.sendMessage(msg.chat.id, "Введіть задачу")
});

bot.onText(/Видалити проєкт/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Увведіть назву проекту, який хочете видалити");
  userStates.set(chatId, "delete_project");
});

function startBotMassage(msg) {
  if (
    !msg.text.startsWith("/") &&
    msg.text &&
    msg.text !== "Додати проєкт" &&
    msg.text !== "Подивитися список проектів" &&
    msg.text !== "Видалити проєкт" &&
    msg.text !== "Відмінити дію"
  ) {
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
        const projectKey = keyProjectName.get(chatId);
        const projectValue = valueProjectName.get(chatId);
        dataBaseIdNotion[`${projectKey}`] = projectValue;
        bot.sendMessage(chatId, "проект додан");
        userStates.delete(chatId);
        break;

      case "delete_project":
        if(dataBaseIdNotion[`${msg.text}`]) {
          delete dataBaseIdNotion[`${msg.text}`]
          bot.sendMessage(chatId, "Проект видалено")   
          userStates.delete(chatId)      
        } else {
          const projectsList = Object.keys(dataBaseIdNotion).join("\n");
          bot.sendMessage(chatId, `Неправильно введено назву, спробуйте ще \n Список проектів:\n${projectsList}`)       
        }
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
