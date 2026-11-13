# Project structure

A Total.js 5 app is a folder that the framework loads by convention. Put each kind of file where the framework (and the next reader) expects it.

```
index.js            starts the app: the official start script, whole (see below)
config              settings, one "key : value" per line
package.json        "total5" is the runtime dependency
controllers/        routes: exports.install = function() { ROUTE(...) }
definitions/        auth.js, init.js, func.js, db.js: loaded at start, no exports
modules/            integrations with other systems (cdn, tapi...)
plugins/<name>/     a feature: index.js (server), index.html (UI), actions/, public/
actions/            actions that are not part of a plugin (an older application has them in schemas/)
views/              layout and pages (HTML with @{...} directives)
public/             browser-accessible static files
private/            internal runtime files and grouped SQL/maintenance assets
docs/               development documentation, evidence and standalone examples
database.sql        the full schema; changes go to dated files next to it
```

Optional, when the app is shipped: `Dockerfile`, `docker-compose.yaml`, `bundle.sh` (writes `--bundles--/app.bundle`), `license.txt`, `readme.md`.

## Recognizable application folders

Runtime code and inputs belong in the framework folders above. Classify a file by its consumer, rather than creating a new top-level folder for every concern. `docs/` is for development material; the running application must not read it. Development tools may read evaluation fixtures and reference projects there.

Where things go:

| Material | Location | Consumer |
|---|---|---|
| Enabled-language catalogue | `private/languages.json` | Application and validation tools |
| Interface translations | `resources/<lang>.resource` | Native localization |
| SQL, migration notes and maintenance units | `private/database/` | Startup, installation and maintenance |
| Evaluation fixtures and recorded checks | `docs/evaluations/` | Development tools and reviewers |
| Investigation reports and reproductions | `docs/findings/` | Developers |
| Standalone reference applications | `docs/examples/<name>/` | Readers and example checks |

A language catalogue is configuration data, not the interface translation store. Database-backed editorial translations remain in their existing database. Moving a file does not authorize a storage migration.

Use `public/` only when a browser or public client is intended to retrieve the file. Use `private/` for files the application needs internally. Exclude credentials, local databases and development documentation from deployment archives; whitelist the specific private paths required by the runtime rather than packaging the entire directory. Generated assets are not hand-edited source.

The root `database.sql` and dated upgrades remain valid existing layouts. When grouping internal SQL files, put the group under `private/database/` rather than creating an application-level `database/` folder.

## index.js

The start script is the same in every app: the official one of Total.js 5 ([`helpers/index.js`](https://github.com/totaljs/framework5/blob/master/helpers/index.js) of the framework), whole and unchanged. Do not write a shorter one by hand and do not restyle it: it is the one file that keeps its own style (`const`, `includes`). Its commented lines are the options that a project turns on later.

```js
// ===================================================
// Total.js v5 start script
// https://www.totaljs.com
// ===================================================

require('total5');

const options = {};

// options.ip = '127.0.0.1';
// options.port = parseInt(process.argv[2]);
// options.unixsocket = PATH.join(F.tmpdir, 'app_name.socket');
// options.unixsocket777 = true;
// options.config = { name: 'Total.js' };
// options.sleep = 3000;
// options.inspector = 9229;
// options.watch = ['private'];
// options.livereload = 'https://yourhostname';
// options.watcher = false; // disables watcher
// options.edit = 'wss://www.yourcodeinstance.com/?id=projectname'
// options.editmcp = 'https://yourtotalmcpserverinstance.com/?id=admin'

options.release = process.argv.includes('--release');

// Service mode:
options.servicemode = process.argv.includes('--service') || process.argv.includes('--servicemode');
// options.servicemode = 'definitions,modules,config';

// Cluster:
// options.tz = 'utc';
// options.cluster = 'auto';
// options.limit = 10; // max 10. threads (works only with "auto" scaling)

Total.run(options);
```

Run it with `node index.js 8000` (add `--release` for release mode).

## Where things go

- **A route** follows the app's existing pattern: `controllers/*.js` / plugin `index.js`, or the action's `route:` property.
- **Business logic** belongs in actions: `actions/` or `plugins/<name>/actions/` (an application written before Total.js 5 added that folder has them in `schemas/`, which is loaded in the same way: leave them there); compact plugins may declare actions in `index.js`.
- **Shared helpers** hang from `FUNC` (`FUNC.notify`, `FUNC.save`) and live in `definitions/func.js`.
- **Shared state in memory** hangs from `MAIN` (the app) or `REPO` (cached lookups, e.g. `REPO.tags`).
- **Startup work** (config defaults, loading caches, registering UI components) goes in `ON('ready', ...)` in `definitions/init.js`.
- **Authentication** is one `AUTH(...)` in `definitions/auth.js`.

## Files and folders

- All lowercase, words separated by `-`, never `_`: `search-results.html`.
- Static files by type: `/img/`, `/js/`, `/css/`, `/fonts/`, `/videos/`.
- One plugin per feature, named after the feature: `plugins/redirects`, `plugins/users`.
- Generated output (`--bundles--/`, `tmp/`, `databases/`) is not edited by hand.

## Checks

- `node --check path/to/file.js` for every JavaScript file you change.
- Start the app and call the route you touched. If the project has no test script, do not say tests passed.

After moving files, update runtime readers, exporters, migration tools, isolated-test setup, package allowlists, ignore rules and documentation links together. Preserve source content and recorded evidence. Verify that the archive includes the new runtime paths and excludes internal documentation and credentials.
