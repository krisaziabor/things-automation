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

// defining Workspace class
class Workspace {
    constructor(id = "", key = "", cycle = "", prevCycle = "", nextCycle = "") {
        this.id = id;
        this.key = key;
        // three cycles/sprints of issues – current, previous, next
        this.cycle = cycle;
        this.prevCycle = prevCycle;
        this.nextCycle = nextCycle;
    }
}


// initializing YVA and DOTCOM workspaces
const yvaWorkspace = new Workspace();
const dotcomWorkspace = new Workspace();
const workspaces = [yvaWorkspace, dotcomWorkspace];

// assigning API keys to workspaces
yvaWorkspace.key = YVA_API_KEY;
dotcomWorkspace.key = DOTCOM_API_KEY;


// general function for fetching data from API
const fetchQuery = async (url, apiKey, query) => {
    try {
        const response = await fetch(url, { method: "POST", headers: headers(apiKey), body: query });
        return await response.json();
    } catch (error) {
        console.error(error);
    }
};

// inital query to get distinct workspace IDs
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

// fetching distinct workspace IDs
const fetchIDs = async () => {
    try {
        // fetching data from API with two queries for two API keys
        const dotcomResponse = await fetchQuery(url, DOTCOM_API_KEY, initialQuery);
        const yvaResponse = await fetchQuery(url, YVA_API_KEY, initialQuery);

        // parsing IDs from response JSON
        const workspaceIDs = [dotcomResponse.data.teams.nodes[0].id, yvaResponse.data.teams.nodes[0].id];

        // assigning IDs to workspace objects
        dotcomWorkspace.id = workspaceIDs[0];
        yvaWorkspace.id = workspaceIDs[1];

        // if successful, return IDs
        return workspaceIDs;

    } catch (error) {
        // if error, log it
        console.error(error);
    }
};


// fetching all IDs from all workspaces – needed before fetching issues
await fetchIDs();


// query for all issues in a given workspace
function queryCurrCycleIssues(workspaceID){
    return JSON.stringify({
        query: `{
            team(id: "${workspaceID}") {
                id
                name
                activeCycle {
                    id
                    issues(first: 100) {
                        nodes {
                            id
                            title
                            createdAt
                        }
                    }
                }
            }
        }`
    });
}

// fetching all issues from workspace
async function fetchIssues(workspace) {
    const query = queryCurrCycleIssues(workspace.id);
    const response = await fetchQuery(url, workspace.key, query);
    return response;
}

// fetching issues from all workspaces by iterating through collection/array of workspaces
async function fetchAllIssues() {
    for (let i = 0; i < workspaces.length; i++) {
        const workspace = workspaces[i];
        const issues = await fetchIssues(workspace);
        // console.log(issues.data.team.issues.nodes);
        console.log(issues.data.team.activeCycle.issues.nodes);
    }
}

fetchAllIssues();
