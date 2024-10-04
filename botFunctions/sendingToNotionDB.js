export const sendingToNotionDB = (bot, msg, chatId, userTexts, userStates, dataBaseIdNotion, createPropertiesForNewPages, main) => {
  const projectName = msg.text;
  const taskName = userTexts.get(chatId);

  const response = `Ви додали задачу у таблицю ${projectName}`;
  console.log();
  bot.sendMessage(chatId, response);

  const transformProjectName = projectName
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
};
