export const createPropertiesForNewPages = (messageText) => {
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

export const toDoListTable = (messageText) => {
  return [
    {
      Name: {
        type: "title",
        title: [{ type: "text", text: { content: messageText } }],
      },
      Status: {
        type: "status",
        status: {
          id: '488bef4b-7f99-41ad-add8-b1266fbc3fae',
          name: 'Вхідні',
          color: 'green'
        }
      },
    },
  ];
}