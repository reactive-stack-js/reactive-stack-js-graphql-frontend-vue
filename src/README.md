# reactive stack js - vue

## src

### graphql query example

```javascript
    fetch("//localhost:3007/graphql", {
        method: "POST",
        headers: AuthService.getAuthHeader(),
        body: JSON.stringify({
            query: '{ user(id: "5f5a304a10f01d00f802af65") {_id name provider} }'
        })
    })
        .then((response) => response.json())
        .then((data) => console.log(" - graphql data response:", data));
```
