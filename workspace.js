import fetch from "node-fetch";
import { queryCurrCycleIssues, queryCycleHistory, initialQuery } from "./queries.js";
import { GRAPHQL } from "./config.js";


// header for API requests
export const headers = apiKey => ({
    "Content-Type": "application/json",
    "Authorization": apiKey,
});

// defining Workspace class
export class Workspace {
    constructor(id = "", key = "", cycle = "", prevCycle = "", nextCycle = "") {
        this.id = id;
        this.key = key;
        // three cycles/sprints of issues – current, previous, next
        this.cycle = cycle;
        this.prevCycle = prevCycle;
        this.nextCycle = nextCycle;
    }
}

// general function for fetching data from API
export const fetchQuery = async (url, apiKey, query) => {
    try {
        const response = await fetch(url, { method: "POST", headers: headers(apiKey), body: query });
        return await response.json();
    } catch (error) {
        console.error(error);
    }
};

// fetching distinct workspace IDs
export async function fetchIDs(workspace_array){
    const idArray = new Array(workspace_array.length);

    for (let i = 0; i < workspace_array.length; i++) {
        const response = await fetchQuery(GRAPHQL.url, workspace_array[i].key, initialQuery);
        // console.log(response.data.viewer.id);
        // console.log(response.data.teams.nodes[0].id);
        workspace_array[i].id = response.data.teams.nodes[0].id;
        idArray[i] = response.data.teams.nodes[0].id;
    }

    // console.log(idArray);
    return idArray;
}

// fetching all issues from workspace
export async function fetchIssues(workspace) {
    const query = queryCurrCycleIssues(workspace.id);
    const response = await fetchQuery(GRAPHQL.url, workspace.key, query);
    return response;
}

export async function fetchCycleHistory(workspace) {
    const query = queryCycleHistory(workspace.id);
    const response = await fetchQuery(GRAPHQL.url, workspace.key, query);
    return response;
}

// fetching issues from all workspaces by iterating through collection/array of workspaces
export async function fetchCurrIssues(workspaces) {
    for (let i = 0; i < workspaces.length; i++) {
        const workspace = workspaces[i];
        const issues = await fetchIssues(workspace);
        console.log("CURRENT ISSUES");
        console.log(issues.data.team.activeCycle.issues.nodes);
    }
}

export async function fetchPrevIssues(workspaces) {
    for (let i = 0; i < workspaces.length; i++) {
        const workspace = workspaces[i];
        const issues = await fetchCycleHistory(workspace);
        console.log("PREVIOUS ISSUES");
        if (issues.data.team.cycles.nodes.length < 4) {
            console.log("Not enough cycles to fetch previous cycle issues");
        }
        else {
            console.log(issues.data.team.cycles.nodes[3].issues.nodes);
        }
    }
}

export async function fetchNextIssues(workspaces) {
    for (let i = 0; i < workspaces.length; i++) {
        const workspace = workspaces[i];
        const issues = await fetchCycleHistory(workspace);
        console.log("NEXT ISSUES");
        console.log(issues.data.team.cycles.nodes[1].issues.nodes);
    }
}