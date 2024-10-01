function createPropertiesForNewPages(messageText, btnId) {
    return [
      {
        Name: {
          type: "title",
          title: [{ type: "text", text: { content: messageText } }],
        },
        Статус: {
          type: "status",
          status: {
            name: "Не розпочато", // Это фиксированное значение, но можно сделать аргументом
          },
        },
        Пріоритет: {
          select: {
            id: btnId,
          },
        },
      },
    ];
  }

export default createPropertiesForNewPages