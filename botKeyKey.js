import TelegramBot from "node-telegram-bot-api";
import { main } from "./index.js";
import { createPropertiesForNewPages, toDoListTable } from "./notionObject.js";
import dataBaseIdNotion from "./dataTablesId.js";
import personalCabinet from "./dataPersonalCabinet.js";
import { sendingToNotionDB } from "./botFunctions/sendingToNotionDB.js";

const _token = process.env.TELEGRAM_BOT_KEY;

const bot = new TelegramBot(_token, { polling: true });

const userStates = new Map();
const userTexts = new Map();
const keyProjectName = new Map();
const valueProjectName = new Map();

const showMenu = (chatId) => {
  bot.sendMessage(chatId, "Вітаємо Вас у боті", {
    reply_markup: {
      keyboard: [
        [{ text: "Подивитися список проєктів" }],
        [{ text: "Відмінити дію" }],
        [{ text: "Додати проєкт" }],
        [{ text: "Видалити проєкт" }],
      ],
      resize_keyboard: true,
      one_time_keyboard: false,
    },
  });
};

const options = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: "В проєкти", callback_data: "add_project_task"},
        { text: "В особистий ToDo", callback_data: "add_todo_task" },
      ],
    ],
  },
};

bot.on("message", startBotMassage);

bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;

  if (query.data === "add_project_task") {
    bot.sendMessage(chatId, "У який проєкт додати задачу?");
    userStates.set(chatId, "awaiting_project");
  } else if (query.data === "add_todo_task") {
    bot.sendMessage(chatId, "Введіть свій id");
    userStates.set(chatId, "adding_task_to_ToDo");
  }

  // bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: query.message.message_id });
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  showMenu(chatId);
  bot.sendMessage(chatId, "Введіть подію");
});

bot.onText(/Додати проєкт/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Введіть назву проєкту, який хочете додати");
  userStates.set(chatId, "adding_new_project");
});

bot.onText(/Подивитися список проєктів/, (msg) => {
  const chatId = msg.chat.id;
  const projectsList = Object.keys(dataBaseIdNotion).join("\n");
  bot.sendMessage(chatId, `Список проєктів:\n${projectsList}`);
});

bot.onText(/Відмінити дію/, (msg) => {
  userStates.delete(msg.chat.id);
  bot.sendMessage(msg.chat.id, "Введіть подію");
});

bot.onText(/Видалити проєкт/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Введіть назву проєкту, який хочете видалити");
  userStates.set(chatId, "delete_project");
});

function startBotMassage(msg) {
  if (
    !msg.text.startsWith("/") &&
    msg.text &&
    msg.text !== "Додати проєкт" &&
    msg.text !== "Подивитися список проєктів" &&
    msg.text !== "Видалити проєкт" &&
    msg.text !== "Відмінити дію" &&
    msg.text !== "Додати задачу в ToDo List"
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

      case "input_project_name":
        userStates.set(chatId, "awaiting_project");
        bot.sendMessage(
          chatId,
          `Введіть назву проєкту до якого додати задачу?`
        );
        break;

      case "input_surname":
        if (msg.text) {
          userTexts.set(chatId, msg.text);
          userStates.set(chatId, "adding_task_to_ToDo");
          bot.sendMessage(chatId, `Введіть свое прізвище`);
        } else {
          bot.sendMessage(
            chatId,
            "Введіть будь-ласка текстовій тип повідомлення"
          );
        }
        break;

      case "adding_task_to_ToDo":
        sendingToNotionDB(
          bot,
          msg,
          chatId,
          userTexts,
          userStates,
          personalCabinet,
          toDoListTable,
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
        const projectKey = keyProjectName
          .get(chatId)
          .replace(/[^a-zA-Z0-9]/g, "")
          .toLowerCase();
        const projectValue = valueProjectName
          .get(chatId)
          .replace(/^https:\/\/www\.notion\.so\/|[?].*$/g, "");
        dataBaseIdNotion[`${projectKey}`] = projectValue;
        bot.sendMessage(chatId, "Проєкт додано");
        userStates.delete(chatId);
        break;

      case "delete_project":
        if (dataBaseIdNotion[`${msg.text}`]) {
          delete dataBaseIdNotion[`${msg.text}`];
          bot.sendMessage(chatId, "Проєкт видалено");
          userStates.delete(chatId);
        } else {
          const projectsList = Object.keys(dataBaseIdNotion).join("\n");
          bot.sendMessage(
            chatId,
            `Неправильно введено назву проєкту, спробуйте ще \n Список проектів:\n${projectsList}`
          );
        }
        break;

      default:
        if (msg.text) {
          userTexts.set(chatId, msg.text);
          bot.sendMessage(chatId, "Куди додати подію", options);
        } else {
          bot.sendMessage(
            chatId,
            "Введіть будь-ласка текстовій тип повідомлення"
          );
        }
        break;
    }
  }
}
