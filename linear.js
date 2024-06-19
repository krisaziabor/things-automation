import dotenv from "dotenv";
import fetch from "node-fetch";

// configuring private environment, securly holding API keys
dotenv.config({ path: './private.env' });

// intializing variables for API keys
const DOTCOM_API_KEY = process.env.DOTCOM_API_KEY;
const YVA_API_KEY = process.env.YVA_API_KEY;
const url = "https://api.linear.app/graphql";

// header for API requests
const headers = apiKey => ({
    "Content-Type": "application/json",
    "Authorization": apiKey,
});


// defining workspace struct
const workspace = {
    id: "",
    key: "",
}

// getters and setters for workspace struct
workspace.getID = () => workspace.id;
workspace.setID = id => workspace.id = id;
workspace.getKey = () => workspace.key;
workspace.setKey = key => workspace.key = key;

// initializing YVA and DOTCOM workspaces
const yvaWorkspace = workspace;

const initialQuery = JSON.stringify({
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

const fetchQuery = (url, apiKey, query) => fetch(url, { method: "POST", headers: headers(apiKey), body:query })
    .then(response => response.json())
    .then(data => {
        return data; // Return the data for further processing
    })
    .catch(error => console.error(error));


const fetchIDs = async () => {
    try {
        const dotcomResponse = await fetchQuery(url, DOTCOM_API_KEY, initialQuery);
        const yvaResponse = await fetchQuery(url, YVA_API_KEY, initialQuery);
        // OFFICIAL WAY OF GETTING WORKSPACE ID
        const workspaceIDs = [dotcomResponse.data.teams.nodes[0].id, yvaResponse.data.teams.nodes[0].id];
        console.log(workspaceIDs);

    } catch (error) {
        console.error(error);
    }
};

fetchIDs();

// const allIssues = JSON.stringify({
//     query:
//         `{
//             team(id: "${fetchIDs()[0]}") {
//                 id
//                 name

//                 issues(first: 100) {
//                     nodes {
//                         id
//                         title
//                         description
//                         createdAt
//                         archivedAt
//                     }
//             }
//         }
            
//     }`,
// });


// const fetchIssues = async () => {
//     try {
//         const response = await fetchQuery(url, )
//     }

