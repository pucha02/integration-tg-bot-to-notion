export const sendingToNotionDB = (
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
      main(propertiesForNewPages, dataBaseIdNotion[transformProjectName]);
      bot.sendMessage(chatId, `${response}`);
    } catch (error) {
      console.error("Ошибка при отправке POST-запроса:", error);
    }
  } else {
    bot.sendMessage(
      chatId,
      `Неправильно введено назву таблиці або невірне id таблиці ${transformProjectName}`
    );
  }
  userStates.delete(chatId);
};
