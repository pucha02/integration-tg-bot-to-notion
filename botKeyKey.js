import TelegramBot from "node-telegram-bot-api";
import { main } from "./index.js"; // Это импорт твоей функции main, если она используется
import createPropertiesForNewPages from "./dataInNotion.js";

const _token = process.env.TELEGRAM_BOT_KEY
const databaseID = "fffbe50aaef381e6bb60cb5d836eaad0";
let a;

const bot = new TelegramBot(_token, { polling: true });

// Хранилище для текстов сообщений
const userTexts = new Map();

bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  // Сохраняем текст сообщения пользователя
  if (msg.text) {
    userTexts.set(chatId, msg.text);
    bot.sendMessage(chatId, "До якого проекту додати задачу? ", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Високий", callback_data: "button1" }],
          [{ text: "Середній", callback_data: "button2" }],
          [{ text: "Низький", callback_data: "button3" }],
          
        ],
      },
    });
  } else {
    bot.sendMessage(chatId, "Ольга ..");
  }
});

bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  let response;
  let btnId
  if (data === "button1") {
    response = "Ви обрали високий пріоритет";
    btnId = 'dc882f8e-9b66-4038-96f1-8cc42e96d475'
  } else if (data === "button2") {
    response = "Ви обрали середній пріоритет";
    btnId = 'aaf21ba2-99b9-4060-80fa-5aed867a7469'
  } else if (data === "button3") {
    response = "Ви обрали низький пріоритет";
    btnId = '227739da-e417-46ff-a540-2569f78d5300'
  }

  bot.sendMessage(chatId, response);

  // Получаем текст сообщения, сохраненный ранее
  const messageText = userTexts.get(chatId);
  // Отправка текста сообщения на сервер только после нажатия кнопки
  const postData = {
    userId: chatId,
    messageText: messageText || "Нет текста",
  };

  try {
    const propertiesForNewPages = createPropertiesForNewPages(messageText, btnId)
    main(propertiesForNewPages, databaseID);
  } catch (error) {
    console.error("Ошибка при отправке POST-запроса:", error);
  }
});