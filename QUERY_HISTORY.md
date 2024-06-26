# Query History

Here is a history of queries that have been run on the database – they are being saved for documentation purposes but are not currently used in the application.

## Queries

### Query to get first 100 issues in a given workspace –

```python
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
```

### Query to get first 100 issues in the current cycle of a workspace – (currently being used) –

```python
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
```
