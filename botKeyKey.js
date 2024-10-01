import TelegramBot from "node-telegram-bot-api";
import { main } from "./index.js"; // Это импорт твоей функции main, если она используется
import createPropertiesForNewPages from "./dataInNotion.js";
import dataBaseIdNotion from "./dataTablesId.js"; 

const _token = process.env.TELEGRAM_BOT_KEY
const databaseID = "fffbe50aaef381e6bb60cb5d836eaad0";

let a;

const bot = new TelegramBot(_token, { polling: true });

// Хранилище для текстов сообщений
const userStates = new Map(); // Сохраняем состояния пользователей
const userTexts = new Map(); // Сохраняем тексты сообщений пользователей

bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  // Проверяем состояние пользователя
  if (userStates.get(chatId) === 'awaiting_project') {
    const project = msg.text;

    const messageText = userTexts.get(chatId);
    
    // Формируем ответ
    const response = `Ви додали задачу у таблицю ${project}`;
    console.log()
    bot.sendMessage(chatId, response);

    // Отправка текста сообщения на сервер
    try {
      const propertiesForNewPages = createPropertiesForNewPages(messageText);
      main(propertiesForNewPages, dataBaseIdNotion[project]);
    } catch (error) {
      console.error("Ошибка при отправке POST-запроса:", error);
    }

    // Сбрасываем состояние пользователя
    userStates.delete(chatId);
  } else {
    // Сохраняем текст сообщения пользователя и устанавливаем состояние
    if (msg.text) {
      userTexts.set(chatId, msg.text);
      userStates.set(chatId, 'awaiting_project'); // Устанавливаем состояние ожидания проекта
      bot.sendMessage(chatId, "До якого проекту додати задачу? ");
    } else {
      bot.sendMessage(chatId, "Ольга ..");
    }
  }
});
