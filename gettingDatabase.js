import { Client } from "@notionhq/client";

const apiKey = 'ntn_y37436089877fAfkurwr4UARwiXgA5DmkTdgFOgtk9gfZb';
const databaseId = '1200df22f09b8005a7a7c24dc5e3de77';

// const url = `https://api.notion.com/v1/users`;
// const headers = {
//     'Authorization': `Bearer ${apiKey}`,
//     'Notion-Version': '2022-06-28'
// };

// fetch(url, { headers })
//     .then(response => response.json())
//     .then(data => {
//         console.log(data);
//     })
//     .catch(error => {
//         console.error('Error fetching data:', error);
//     });

    const notion = new Client({ auth: apiKey });
    
    (async () => {
      const pageId = '1210df22f09b80d1bb22d56b7eb87e86';
      const response = await notion.pages.retrieve({ page_id: pageId });
      console.log(response.properties);
    })();