# AGENTS.md

This repository is the knowledge of Total.js 5 for agents and models: the conventions, and small complete applications that show them at work. Read it before writing or changing Total.js code.

## How to use it

1. Read the rules below. They apply to every change.
2. Open the pages of the zone you work in: `conventions/general/`, `conventions/backend/`, `conventions/database/` or `conventions/frontend/`. Start with `conventions/general/workflow.md` when choosing a pattern or correcting existing code.
3. Look at the application with the shape you need in `apps/`: its `readme.md` says the request it answers and why it has that shape.
4. In an existing project, copy the pattern of its nearest working feature; use these pages to decide what is idiomatic.

## Rules that apply to every change

- Total.js 5 only. Do not use Total.js 4 APIs. The interface is jComponent 20.
- `"total5": "latest"` is the stable version. Before using something that only a beta has (see `reference/`), check the version the project depends on and say which version it needs.
- ES5 first: `var`, `function`, classic loops, `'{0}'.format()` instead of template literals, no arrow functions. `const` or `let` only where the code needs it, as a constant at the top of a file; inside a function write `var`. `async` / `await` where the code waits for the database.
- `index.js` is always the official start script of Total.js 5, whole and unchanged (see `conventions/general/project-structure.md`). It is the one file that keeps its own style.
- Use Total.js prototypes (`findItem`, `format`, `parseJSON`, `slug`, `isEmail`...) in the backend and Tangular templates in the frontend before any other function.
- In initialized app code, do not `require()` exposed Node.js modules: use `Total.Fs`, `Total.Path`, `Total.Crypto`, `Total.Os`, `Total.Zlib`, etc.
- Settings are in the file `config` (not `config.json`, not environment variables), read with `CONF`. `total5` is the dependency in `package.json`, as `latest`.
- Actions are named `Collection|verb` with a pipe: `Tickets|list`, `Reports|Categories|list`. Never `/` or `\` in an action or schema name.
- Routes are in `controllers/`, or in the `index.js` of the plugin when the application has plugins. An existing application that declares `route:` in its actions keeps its style; never register the same endpoint twice.
- An application that will grow by features is made with plugins; a small API or a website with a few pages is not. See the applications of `apps/`.
- Loaded application modules are accessed through `MODS`, shared helpers hang from `FUNC` and shared state from `MAIN`.
- Keep the storage of an existing application. In a new one the records go through `DATA` (QueryBuilder) from the start, with SQL names: `DATA.find('nosql/tbl_contact')` on the embedded NoSQL database, and the same table without the prefix `nosql/` when it moves to PostgreSQL; `NOSQL()` is for an embedded store that will never be SQL, `MEMORIZE()` for a small named object, `FILESTORAGE()` for files. In request queries use `.promise($)` / `.callback($)`; ids are `UID()`, dates are `NOW`.
- Preserve URLs, permissions, input and output shapes, settings keys and model paths during a style correction. Do not add an abstraction when a direct native call fits.
- Frontend: match the jComponent major version of the application; use an existing component before writing one; load catalogue components with `COMPONENTATOR()`.
- Every text for people is `@(Text)`, in English.
- Tabs, semicolons, `'` for short strings, lowercase file names with `-`.
- After editing JavaScript run `node --check file.js`; start the application and call the route you changed. Do not say that tests passed when the project has none.

## Layout

- `conventions/`: the pages, one folder per zone (`general/`, `backend/`, `database/`, `frontend/`).
- `apps/`: small complete applications, each with its `readme.md` and its `test.js`.
- `reference/`: what each version of Total.js 5 adds, tried with that version. A feature of a beta is used only in a project that depends on that version.
- `llms.txt` (index) and `llms-full.txt` (every page in one file): for models. They are generated, do not edit them by hand.
- `scripts/llms.js`: builds the two files above and lists the pages in order.
- `skills/`: the skills to write and to review Total.js 5 code (`.claude/skills/` and `.agents/skills/` point to them).
- `tools/check.js`: checks application files against the rules a script can decide. `tools/rules.js` prints the rules above. `tools/test.js` runs the tests of every application.
- `hooks/hooks.json`: for the plugin, the check after each edit and the rules at the start of a session in a Total.js project.
- `.claude-plugin/` makes the repository a Claude Code plugin; `.codex-plugin/` and `.agents/plugins/` make it a Codex plugin.
- `tests/`: tests of the files for agents, of the check and of the links of the pages.

## Using this knowledge from another project

Point your agent at `llms.txt` (an index with a link to every page) or at `llms-full.txt` (all the pages at once):

- https://raw.githubusercontent.com/totaljs-es/knowledge/main/llms.txt
- https://raw.githubusercontent.com/totaljs-es/knowledge/main/llms-full.txt

A project can add a line to its own `AGENTS.md`: "Follow the Total.js 5 knowledge of https://github.com/totaljs-es/knowledge".

## Plugins and check

- Claude Code: `/plugin marketplace add totaljs-es/knowledge`, then `/plugin install totaljs@totaljs-knowledge`. It adds the two skills, the check after each edit and the rules at the start of a session.
- Codex: `codex plugin marketplace add totaljs-es/knowledge`, then `codex plugin add totaljs`. It adds the two skills.

Check files by hand: `node tools/check.js <file|directory>` (`--strict` makes style findings fail, `--json` prints JSON). It only checks files inside a project that depends on `total5`, in the Total.js folders (`schemas/`, `controllers/`, `definitions/`, `modules/`, `plugins/`, `actions/`, `views/`).

## Checking this repository

- `npm test` checks the files for agents, that every page is listed in `llms.txt`, that `llms.txt` and `llms-full.txt` match the pages, that every link works, the check itself, and it runs the tests of every application.
- After you change or add a page, run `npm run llms` and `npm test`. A new page is also added to the list in `scripts/llms.js`.

## Keeping this knowledge true

Every rule here comes from code that exists, and every application here starts and passes its tests. When you add a rule, add an example from a real file or from the framework source, and say which. When you add an application, add its tests.
