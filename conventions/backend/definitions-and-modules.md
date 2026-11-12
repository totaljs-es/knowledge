# Definitions and modules

## definitions/

Files here are loaded when the app starts. They export nothing: they register things on the framework. One file per concern.

| File | Holds |
|---|---|
| `auth.js` | the single `AUTH(...)` |
| `init.js` | config defaults and `ON('ready', ...)`: load caches, register UI components |
| `func.js` | shared helpers as `FUNC.name = function() {}` |
| `db.js` | shared state objects (`MAIN.id`, `MAIN.db`) |

```js
// definitions/init.js
CONF.version = '1';
if (!CONF.cdn)
	CONF.cdn = 'https://cdn.componentator.com';

ON('ready', function() {
	setTimeout(FUNC.load, 500);
	COMPONENTATOR('ui', 'exec,locale,input,form,validate,...', true);
});
```

```js
// definitions/func.js
FUNC.refreshtags = async function() {
	REPO.tags = await DATA.find('tbl_tag').fields('id,search').promise();
};
```

- Helpers are named in lowercase without separators: `FUNC.refreshtags`, `FUNC.notify`.
- Use `ON('ready')` for anything that needs the app and the database to be up.
- `EMIT('configure')` / `ON('configure')` is how parts of the app react to a config change.

## config

A plain file, one `key : value` per line. Read it with `CONF.key`. Settings the framework owns start with `$`: `$api`, `$minifyjs`. Secrets (keys, database URLs) do not belong in a repository: keep them in the deployment config.

## modules/

A module is an integration with another system or a self-contained service (`cdn.js`, `visitors.js`). Total.js loads `modules/*.js` automatically and registers the exports under `MODS`, using `exports.id` or the filename without its extension. The loader calls `exports.install()` when that method exists; a module exposing reusable methods does not need an empty installer.

Use that registry from initialized application code. Example:

```js
var data = MODS.visitors.today();
var visitors = MODS.visitors.instance.visitors;
```

Hyphenated IDs use bracket access, for example `MODS['knowledge-source']`. Do not repeatedly import an application module with `require(PATH.root('modules/...'))`. Name application modules `.js`; a `.cjs` helper is not automatically registered by the `modules` scan.

`MODS` exists after framework initialization, but an entry exists only after its module loads. Read another module from an exported method or an appropriate lifecycle callback; do not depend on sibling filename order or introduce circular initialization. Work needing application state or a database belongs in the existing ready/configure lifecycle. An automatically called `install()` must not require arguments supplied only by a later controller.

A standalone Node tool does not acquire loaded application modules merely by requiring `total5`. It may import a shared CommonJS helper directly. Preserve that execution boundary when code is shared with validators or maintenance tools; do not replace valid CLI imports with an unpopulated `MODS` entry. The `total5` bootstrap and third-party database adapters also retain their required imports.

Keep a module independent: it reads `CONF`, not another integration's private internals. Some integrations expose a dedicated global; preserve that public contract when present. New application module consumers use `MODS`.

## Shared state

- `MAIN`: the application's own state (`MAIN.db`, `MAIN.cache`).
- `REPO`: cached lookups that the UI also needs (`REPO.tags`, `REPO.ui`).
- `FUNC`: functions shared by actions and controllers.
- `MODS`: automatically registered application module exports.

Do not create new globals. Hang things from these three.

## Config in the database

When settings live in a table (`cl_config`), load them with `LOADCONFIG(rows)` and emit `configure`, as a `FUNC.reconfigure` does.
