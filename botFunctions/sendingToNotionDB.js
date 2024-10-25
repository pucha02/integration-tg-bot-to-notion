export const sendingToNotionDB = async (
  bot,
  msg,
  chatId,
  userTexts,
  userStates,
  dataBaseIdNotion,
  createPropertiesForNewPages,
  main,
  person = null,
  date = null
) => {

  var flag = false;

  if ((person, date)) {
    var dataDate = date.get(chatId);
    var dataPerosn = person.get(chatId);
    flag = true;
  }

  var projectName = msg.text;
  const taskName = userTexts.get(chatId);
  

  if(flag) {
    projectName = 'teamcalendar'
  }

  const response = `Ви успішно додали задачу`;

  const transformProjectName = projectName
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
  console.log(transformProjectName);

  if (dataBaseIdNotion.hasOwnProperty(transformProjectName)) {
    try {
      var propertiesForNewPages = createPropertiesForNewPages(taskName);
      if (flag) {
        var propertiesForNewPages = createPropertiesForNewPages(
          taskName,
          dataDate,
          dataPerosn
        );
      } else {
        var propertiesForNewPages = createPropertiesForNewPages(taskName);
      }
      await main(propertiesForNewPages, dataBaseIdNotion[transformProjectName]);
      bot.sendMessage(chatId, `${response}`);
      bot.sendMessage(chatId, '🟢 Введіть подію/задачу' );
    } catch (error) {
      console.error("Ошибка при отправке POST-запроса:", error);
    }
    userStates.delete(chatId);
  } else {
    bot.sendMessage(
      chatId,
      `Неправильно введено назву таблиці або невірне id таблиці ${transformProjectName}`
    );
    bot.sendMessage(
      chatId,
      `Спробуйте ще`
    );
  }
};