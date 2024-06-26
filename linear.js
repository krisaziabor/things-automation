import dotenv from "dotenv";
import { initialQuery } from "./queries.js";
import { Workspace, fetchQuery, fetchCurrIssues, fetchNextIssues, fetchPrevIssues } from "./workspace.js";
import { GRAPHQL } from "./config.js";

// configuring private environment, securly holding API keys
dotenv.config({ path: './private.env' });

// intializing variables for API keys
const DOTCOM_API_KEY = process.env.DOTCOM_API_KEY;
const YVA_API_KEY = process.env.YVA_API_KEY;


// initializing YVA and DOTCOM workspaces
const yvaWorkspace = new Workspace();
const dotcomWorkspace = new Workspace();
const workspaces = [yvaWorkspace, dotcomWorkspace];

// assigning API keys to workspaces
yvaWorkspace.key = YVA_API_KEY;
dotcomWorkspace.key = DOTCOM_API_KEY;

// fetching distinct workspace IDs
// NEEDS TO BE GENERALIZED and SENT TO WORKSPACE.JS
const fetchIDs = async () => {
    try {
        // fetching data from API with two queries for two API keys
        const dotcomResponse = await fetchQuery(GRAPHQL.url, DOTCOM_API_KEY, initialQuery);
        const yvaResponse = await fetchQuery(GRAPHQL.url, YVA_API_KEY, initialQuery);

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

await fetchCurrIssues(workspaces);
await fetchPrevIssues(workspaces);
await fetchNextIssues(workspaces);
