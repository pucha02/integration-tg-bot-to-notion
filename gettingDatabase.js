const apiKey = 'secret_adKCm6v53fvC0u1zjQYzjm8XQjbs4rtrS06pqbbxYo0';
const databaseId = 'fffbe50aaef38107b7bfddd914113435';

const url = `https://api.notion.com/v1/databases/${databaseId}`;
const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Notion-Version': '2022-06-28'
};

fetch(url, { headers })
    .then(response => response.json())
    .then(data => {
        console.log(data.properties['Пріоритет'].select);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
