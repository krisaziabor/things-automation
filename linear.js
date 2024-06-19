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

class Workspace {
    constructor(id = "", key = "", cycle = "", prevCycle = "", nextCycle = "") {
        this.id = id;
        this.key = key;
        this.cycle = cycle;
        this.prevCycle = prevCycle;
        this.nextCycle = nextCycle;
    }
}


// initializing YVA and DOTCOM workspaces
const yvaWorkspace = new Workspace();
const dotcomWorkspace = new Workspace();
const workspaces = [yvaWorkspace, dotcomWorkspace];

yvaWorkspace.key = YVA_API_KEY;
dotcomWorkspace.key = DOTCOM_API_KEY;

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
        // console.log(yvaResponse.data.teams.nodes);
        // console.log("YVA",yvaResponse.data.teams.nodes[0].id);
        // console.log("DOTCOM",dotcomResponse.data.teams.nodes[0].id);
        const workspaceIDs = [dotcomResponse.data.teams.nodes[0].id, yvaResponse.data.teams.nodes[0].id];
        // console.log(workspaceIDs);
        dotcomWorkspace.id = workspaceIDs[0];
        yvaWorkspace.id = workspaceIDs[1];
        return workspaceIDs;

    } catch (error) {
        console.error(error);
    }
};

await fetchIDs();


function queryAllIssues(workspaceID){
    return JSON.stringify({
        query: `{
            team(id: "${workspaceID}") {
                id
                name
                issues(first: 100) {
                    nodes {
                        id
                        title
                        createdAt
                    }
                }
            }
        }`
    });
}

async function fetchIssues(workspace) {
    const query = queryAllIssues(workspace.id);
    const response = await fetchQuery(url, workspace.key, query);
    return response;
}


async function fetchAllIssues() {
    for (let i = 0; i < workspaces.length; i++) {
        const workspace = workspaces[i];
        const issues = await fetchIssues(workspace);
        console.log(issues.data.team.issues.nodes);
    }
}

fetchAllIssues();
