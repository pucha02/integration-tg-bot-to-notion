export const sendingToNotionDB = (bot, msg, chatId, userTexts, userStates, dataBaseIdNotion, createPropertiesForNewPages, main) => {
  const projectName = msg.text;
  const taskName = userTexts.get(chatId);

  const response = `Ви успішно додали задачу`;

  const transformProjectName = projectName
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
  console.log(transformProjectName);

  if (dataBaseIdNotion.hasOwnProperty(transformProjectName)) {
    try {
      const propertiesForNewPages = createPropertiesForNewPages(taskName);
      main(propertiesForNewPages, dataBaseIdNotion[transformProjectName]);
      bot.sendMessage(chatId, `${response}`);
    } catch (error) {
      console.error("Ошибка при отправке POST-запроса:", error);
    }
  } else {
    bot.sendMessage(chatId, "Неправильно введено назву таблиці або невірне id таблиці");
  }
  userStates.delete(chatId);
};