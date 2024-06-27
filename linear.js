import dotenv from "dotenv";
import { Workspace, fetchQuery, fetchCurrIssues, fetchNextIssues, fetchPrevIssues, fetchIDs } from "./workspace.js";

// configuring private environment, securly holding API keys
dotenv.config({ path: './private.env' });

// initializing YVA and DOTCOM workspaces
const yvaWorkspace = new Workspace();
const dotcomWorkspace = new Workspace();
const workspaces = [yvaWorkspace, dotcomWorkspace];

// assigning API keys to workspaces
yvaWorkspace.key = process.env.YVA_API_KEY;
dotcomWorkspace.key = process.env.DOTCOM_API_KEY;

// fetching all IDs from all workspaces – needed before fetching issues
await fetchIDs(workspaces);

await fetchCurrIssues(workspaces);
await fetchPrevIssues(workspaces);
await fetchNextIssues(workspaces);
