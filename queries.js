// THIS FILE IS TO STORE ALL QUERIES and minimize the code in "linear.js".
// THIS WILL ALSO RENDER QUERY_HISTORY redundant and once this is finalized, the file will be removed from the repo.

// inital query to get distinct workspace IDs
export const initialQuery = JSON.stringify({
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

// query for all issues in the current cycle/sprint in a given workspace
export function queryCurrCycleIssues(workspaceID){
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

// query for all issues in the previous cycle/sprint in a given workspace
export function queryCycleHistory(workspaceID){
    return JSON.stringify({
        query: `{
            team(id: "${workspaceID}") {
                id
                name
                cycles(first: 4) {
                    nodes {
                        id
                        startsAt
                        issues(first: 100) {
                            nodes {
                                id
                                title
                                createdAt
                            }
                        }
                    }
                }   
            }
        }`
    })
}