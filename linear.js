import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config({ path: './private.env' });

const API_KEY = process.env.LINEAR_API_KEY;
const url = "https://api.linear.app/graphql";
const headers = {
    "Content-Type": "application/json",
    "Authorization": API_KEY,
};

const body = JSON.stringify({
    query:
        `{
            issues {
                nodes {
                    title
                    assignee {
                        name
                    }
                }
            }
        }`,
});

fetch(url, { method: "POST", headers, body })
    .then(response => response.json())
    .then(data => console.log(JSON.stringify(data, null, 2)))
    .catch(error => console.error(error));