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
    .then(data => {
        return data; // Return the data for further processing
    })
    .catch(error => console.error(error));

// apiKeys.forEach((apiKey) => {
//     fetchWithApiKey(url, apiKey);
// });

const fetchData = async () => {
    try {
        const dotcomResponse = await fetchWithApiKey(url, DOTCOM_API_KEY);
        const yvaResponse = await fetchWithApiKey(url, YVA_API_KEY);
        // OFFICIAL WAY OF GETTING WORKSPACE ID
        const workspaceIDs = [dotcomResponse.data.teams.nodes[0].id, yvaResponse.data.teams.nodes[0].id];
        console.log(workspaceIDs);

    } catch (error) {
        console.error(error);
    }
};

fetchData();

