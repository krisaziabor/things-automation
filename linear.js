import { ApiKey } from "@linear/sdk";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config({ path: './private.env' });

const DOTCOM_API_KEY = process.env.DOTCOM_API_KEY;
const YVA_API_KEY = process.env.YVA_API_KEY;
const apiKeys = [DOTCOM_API_KEY, YVA_API_KEY];
const url = "https://api.linear.app/graphql";

const headers = apiKey => ({
    "Content-Type": "application/json",
    "Authorization": apiKey,
});

// const body = JSON.stringify({
//     query:
//         `{
//             issues {
//                 nodes {
//                     title
//                     assignee {
//                         name
//                     }
//                 }
//             }
//         }`,
// });

const body = JSON.stringify({
    query:
        `{
            viewer {
                id
                name
                email
        }
            teams {
                nodes {
                    id
                    name
                }
        }
    }`,
});


const fetchWithApiKey = (url, apiKey) => fetch(url, { method: "POST", headers: headers(apiKey), body })
    .then(response => response.json())
    .then(body => console.log(JSON.stringify(body, null, 2)))
    .catch(error => console.error(error));

apiKeys.forEach((apiKey) => {
    fetchWithApiKey(url, apiKey);
});