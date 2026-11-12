# knowledge

Total.js 5 knowledge for AI models: small complete applications, examples and answers that follow the conventions, tested and ready to learn from.

[Totem](https://github.com/totaljs-es/totem) is the first model that learns from it. Any model, and any person, can use it.

## What is here

| Folder | Content |
|---|---|
| `apps/` | Small complete applications. Each one starts, has its tests and says in its `readme.md` the request it answers and why it has that shape |
| `tools/` | The script that runs the tests of every application |

| Application | Shape | Storage |
|---|---|---|
| [`apps/contacts`](apps/contacts) | An API without plugins, with a token | Embedded NoSQL |
| [`apps/website`](apps/website) | A website without plugins: views and a layout rendered on the server | A list in memory |
| [`apps/board`](apps/board) | An application with plugins: each feature has its routes, actions, screen and form (jComponent 20) | Embedded NoSQL |

## The rules of everything here

- **It runs.** An application enters when it starts and its tests pass. `npm test` runs them all.
- **Total.js 5 and jComponent 20**, as the [conventions](https://github.com/totaljs-es/conventions) say.
- **ES5**: `var` and `function`. `async` / `await` only where the code waits for the database (`await NOSQL(...).promise($)`).
- **Routes** are in `controllers/`, or in the `index.js` of the plugin when the application has plugins. Never inside the action.
- **Actions** are named `Collection|verb`, with a pipe.
- **Settings** are in the file `config`, and `total5` is `latest` in `package.json`.
- **`index.js`** is always the official start script of Total.js 5, whole and unchanged ([`helpers/index.js`](https://github.com/totaljs/framework5/blob/master/helpers/index.js) of the framework). It is the one file that keeps its own style.
- **No real data**: names, emails and tokens are invented.

## Run the tests

```
npm install
npm test
```

## License

MIT
