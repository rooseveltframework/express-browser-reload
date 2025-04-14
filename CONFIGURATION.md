## API

These are the parameters you can pass to the constructor.

- `route` *[String]*: What Express route to put the client-side JS file on. Default: `/express-browser-reload.js`.
- `skipDeletingConnections` *[Boolean]*: Whether to skip purging HTTP connections on the Express server when it restarts. If you're already handling this on your Express server yourself, set this param to `true` to prevent errors. Default: `false`.
