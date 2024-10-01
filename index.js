import { Client } from "@notionhq/client";
import { config } from "dotenv";

config();

const _notionToken = process.env.NOTION_API_KEY


const notion = new Client({ auth: _notionToken });

async function addNotionPageToDatabase(pageProperties, databaseId) {

    const newPage = await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: pageProperties,
    });
    console.log(newPage);
  }

async function main(database, databaseId) {
    for (let i = 0; i < database.length; i++) {
        await addNotionPageToDatabase(database[i], databaseId)
      }
}

export {main}