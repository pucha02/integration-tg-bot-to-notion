const apiKey = 'ntn_y37436089877fAfkurwr4UARwiXgA5DmkTdgFOgtk9gfZb';
const databaseId = '1200df22f09b8005a7a7c24dc5e3de77';

import { Client } from "@notionhq/client";

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

    const notion = new Client(apiKey);
    
    (async () => {
      const pageId = '1200df22f09b80a49410ebaabc722517';
      const response = await notion.pages.retrieve({ page_id: pageId });
      console.log(response);
    })();