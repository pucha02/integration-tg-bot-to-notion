function createPropertiesForNewPages(messageText) {
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
            id: 'dc882f8e-9b66-4038-96f1-8cc42e96d475',
          },
        },
      },
    ];
  }

export default createPropertiesForNewPages