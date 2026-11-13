# knowledge

Total.js 5 knowledge for AI models: small complete applications, examples and answers that follow the conventions, tested and ready to learn from.

[Totem](https://github.com/totaljs-es/totem) is the first model that learns from it. Any model, and any person, can use it.

## What is here

| Folder | Content |
|---|---|
| [`conventions/`](conventions) | How Total.js 5 applications are written, one page per subject: [general](conventions/general), [backend](conventions/backend), [database](conventions/database) and [frontend](conventions/frontend) |
| [`apps/`](apps) | Small complete applications. Each one starts, has its tests and says in its `readme.md` the request it answers and why it has that shape |
| [`answers/`](answers) | Short answers to the questions people ask about Total.js 5, each with its code and the application that shows it at work |
| [`questions/`](questions) | One question and its short answer, 237 of them by subject, in English, in Spanish ([`questions/es/`](questions/es)) and in Slovak ([`questions/sk/`](questions/sk), a draft until a native speaker reviews it) with the same code |
| [`reference/components/`](reference/components) | The 348 published jComponent components: the catalogue with what each one does and the page of each one, copied from its repository |
| [`reference/icons.md`](reference/icons.md) | The names of Total Icons |
| [`reference/`](reference) | What each version of Total.js 5 adds, tried with that version ([0.0.20](reference/total5-0.0.20.md), the beta), and the official guides of [jComponent 20](reference/jcomponent/readme.md): `ui-component`, `ui-bind`, `ui-plugin`, `ui-import`, the API and how to write a component |
| [`skills/`](skills) | Two skills for agents: write Total.js 5 code, and review a change |
| [`tools/`](tools) | `check.js` checks application files against the rules a script can decide, `rules.js` prints the rules, `test.js` runs the tests of every application |
| `llms.txt`, `llms-full.txt` | The index of the pages and every page in one file, for models |
| `knowledge.json` | For a program that searches these pages: the API names and the words of the headings of each one |

| Application | Shape | Storage |
|---|---|---|
| [`apps/contacts`](apps/contacts) | An API without plugins, with a token | `DATA` (QueryBuilder) on the embedded NoSQL database |
| [`apps/contacts-postgresql`](apps/contacts-postgresql) | The same API with its data in PostgreSQL: the same queries, without the prefix `nosql/` | `DATA` (QueryBuilder) on PostgreSQL |
| [`apps/files`](apps/files) | An API to upload and download files, with a token | `FILESTORAGE` |
| [`apps/monitor`](apps/monitor) | Work on a schedule: it checks websites every few minutes and says which ones are down | `MEMORIZE` |
| [`apps/website`](apps/website) | A website without plugins: views and a layout rendered on the server | A list in memory |
| [`apps/chat`](apps/chat) | A chat room over a WebSocket, with a page in jComponent 20 | In memory |
| [`apps/board`](apps/board) | An application with plugins: each feature has its routes, actions, screen and form (jComponent 20) | `DATA` (QueryBuilder) on the embedded NoSQL database |
| [`apps/accounts`](apps/accounts) | Sign in with users and sessions, an administrator, and notes that only their user sees | `DATA` (QueryBuilder) on the embedded NoSQL database |

## Use it

**Any model or agent:** give it [`llms.txt`](https://raw.githubusercontent.com/totaljs-es/knowledge/main/llms.txt) (the index) or [`llms-full.txt`](https://raw.githubusercontent.com/totaljs-es/knowledge/main/llms-full.txt) (everything), or add this line to the `AGENTS.md` of your project: "Follow the Total.js 5 knowledge of https://github.com/totaljs-es/knowledge". [`AGENTS.md`](AGENTS.md) has the rules; `CLAUDE.md`, `GEMINI.md` and `.github/copilot-instructions.md` point to it.

**Claude Code**, as a plugin: the two skills, a check after each edit and the rules at the start of a session in a Total.js project.

```
/plugin marketplace add totaljs-es/knowledge
/plugin install totaljs@totaljs-knowledge
```

**Codex**, as a plugin: the two skills.

```
codex plugin marketplace add totaljs-es/knowledge
codex plugin add totaljs@totaljs-knowledge
```

## The rules of everything here

- **It runs.** An application enters when it starts and its tests pass. `npm test` runs them all.
- **Total.js 5 and jComponent 20**, as the [conventions](conventions) say.
- **ES5 first**: `var` and `function`. `const` or `let` only where the code needs it, as a constant at the top of a file. `async` / `await` only where the code waits for the database (`await NOSQL(...).promise($)`).
- **Routes** are in `controllers/`, or in the `index.js` of the plugin when the application has plugins. Never inside the action.
- **Actions** are named `Collection|verb`, with a pipe.
- **Data** goes through `DATA` (QueryBuilder) from the start, with SQL names and the prefix `nosql/` on the embedded database (`DATA.find('nosql/tbl_contact')`), so an application moves to PostgreSQL without writing its queries again. `NOSQL()`, `MEMORIZE()` and `FILESTORAGE()` are for what they are made for: see [storage](conventions/backend/storage-and-integrations.md).
- **Settings** are in the file `config`, and `total5` is `latest` in `package.json`.
- **`index.js`** is always the official start script of Total.js 5, whole and unchanged ([`helpers/index.js`](https://github.com/totaljs/framework5/blob/master/helpers/index.js) of the framework). It is the one file that keeps its own style.
- **No real data**: names, emails and tokens are invented.

## Run the tests

```
npm install
npm test
```

It checks the files for agents, the links of every page, the check itself and the applications. `apps/contacts-postgresql` needs PostgreSQL and a database for tests (`createdb knowledge_test`); without it, it is reported as skipped. After a page changes, `npm run llms` writes `llms.txt` and `llms-full.txt` again.

## License

MIT
