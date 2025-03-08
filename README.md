# express-browser-reload

[![Build Status](https://github.com/rooseveltframework/express-browser-reload/workflows/CI/badge.svg
)](https://github.com/rooseveltframework/express-browser-reload/actions?query=workflow%3ACI) [![npm](https://img.shields.io/npm/v/express-browser-reload.svg)](https://www.npmjs.com/package/express-browser-reload)

Node.js module to refresh your browser when your [Express](https://expressjs.com) server restarts. Works by using a [WebSocket](https://en.wikipedia.org/wiki/WebSocket) to the server and waits for the WebSocket to close to detect the server restarting. Once the server comes back up, the page will be reloaded.

This project is a hard fork of [reload](https://github.com/alallier/reload), which is a more generalized tool with more features beyond the Express world. This fork is maintained by the [Roosevelt web framework](https://github.com/rooseveltframework/roosevelt) [team](https://github.com/orgs/rooseveltframework/people), but it can be used independently of Roosevelt as well.

## Usage

```javascript
const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.type('text/html')
  res.send(`<!doctype html>
<html>
  <head>
    <title>express-browser-reload express sample</title>
  </head>
  <body>
    <p>express-browser-reload express sample</p>
    <!-- all you have to do is include the reload script and have it be on every page of your project -->
    <!-- you do not create this route, reload creates it for you automatically -->
    <script src="/express-browser-reload.js"></script>
  </body>
</html>`)
})

const server = app.listen(3000, () => console.log(`🎧 express-browser-reload express sample app server is running on http://localhost:3000`))

// params for express-browser-reload (currently set to the defaults)
const params = {
  route: '/express-browser-reload.js',
  skipDeletingConnections: false
}

require('express-browser-reload')(app, server, params)
```

Params API:

- `route`: What Express route to put the client-side JS file on. Default: `/express-browser-reload.js`.
- `skipDeletingConnections`: Whether to skip purging HTTP connections on the Express server when it restarts. If you're already handling this on your Express server yourself, set this param to `true` to prevent errors. Default: `false`.
