# Storage and integrations

Choose the model already used by the feature. Not every app stores data in SQL.

## Persistence and cache ownership

| Model | How to extend it |
|---|---|
| Metadata in memory, serialized to FileStorage | Mutate the existing collection, call `FUNC.save()`, refresh affected rendering caches when necessary |
| SQL through `DATA` (`DATA.init('postgresql', ...)`, or `querybuilderpg` in an older application) | Keep projections, filters, identifiers, response shapes and adapter initialization |
| Named persisted memory object | Keep `MEMORIZE` object ownership and existing save hooks |
| Flow state | Keep flow load/save lifecycle and websocket permissions together |

Do not switch models during a cleanup.

A `FUNC.load` typically reads the metadata, initializes defaults, compiles derived objects and emits reload; `FUNC.save` excludes compiled references before serialization. Changing a record can therefore require cache refresh as well as saving. Follow the feature's actual invalidation path rather than inventing a second cache.

## A new application: which storage

An existing feature keeps its model. A new application chooses by what the data is:

| The data | Use |
|---|---|
| The records of the application (contacts, tasks, orders), small today and maybe on PostgreSQL tomorrow | `DATA` with QueryBuilder from the start: `DATA.find('nosql/tbl_contact')` on the embedded NoSQL database |
| An embedded store that will never be SQL (a log, a queue, a cache on disk) | `NOSQL('name')` directly |
| A small named object that is kept by itself (settings, counters) | `MEMORIZE('name')` |
| Files and their metadata | `FILESTORAGE('name')` |

`DATA` works on the embedded NoSQL database with the prefix `nosql/` before the name of the table. It needs no definition and no dependency:

```js
var items = await DATA.find('nosql/tbl_contact').sort('name').promise($);
var item = await DATA.read('nosql/tbl_contact').id($.params.id).error(404).promise($);
await DATA.insert('nosql/tbl_contact', model).promise($);
await DATA.modify('nosql/tbl_contact', model).id($.params.id).error(404).promise($);
await DATA.remove('nosql/tbl_contact').id($.params.id).error(404).promise($);
```

The file is `databases/tbl_contact.nosql`, the same one that `NOSQL('tbl_contact')` reads. Name the tables and the columns as in SQL from the start (`tbl_contact`, `isdone`, `dtcreated`; see [SQL scripts](../database/sql-scripts.md)).

An application written this way moves to PostgreSQL without writing its queries again: it adds the definition of its adapter and takes the prefix `nosql/` away from the table names.

```js
// definitions/db.js (Total.js 5 0.0.20-4 or later: no package)
DATA.init('postgresql', '', CONF.database);
```

```js
var items = await DATA.find('tbl_contact').sort('name').promise($);
```

The prefix is the form of the framework's own tests and of the CMS (`DATA.modify('nosql/pages', ...)`). Checked with Total.js 5 0.0.19: `apps/contacts` (embedded database) and `apps/contacts-postgresql` (PostgreSQL 18) of the [knowledge repository](https://github.com/totaljs-es/knowledge) have the same queries and pass the same tests.

## Outgoing requests

Use `RESTBuilder` and the existing integration configuration. A notification that is intentionally independent can use `RESTBuilder.POST(...).callback(NOOP)`; use explicit error handling when an action's result depends on the remote call.

Illustrative request-dependent pattern (adapted to the request style in the framework's `builders.js`, `RESTP.promise`):

```js
var response = await RESTBuilder.GET(CONF.serviceurl).promise($);
```

Check the remote status and response shape required by the integration before returning success. Do not assume a network-success callback proves a valid business response. In a job without `$`, use an error-first callback or handle `.promise()` rejection. Reuse project timeouts, authentication and cancellation conventions when present; verify support in the installed version.

## Configuration and lifecycle

Read configuration through `CONF` and follow the target app's settings loader. Use `LOADCONFIG` and `configure` hooks; service listeners refresh or reload state periodically. Do not add a parallel environment/config system to a feature that already has settings.

- Startup work belongs in the existing ready/init path.
- React to configuration changes through the existing `ON('configure', ...)` / `EMIT('configure')` flow.
- Repeated maintenance uses the app's `ON('service', function(counter) { ... })` convention where available, rather than one timer per action call.
- Keep request-dependent errors observable. Use `ERROR('context')` where the surrounding app expects a logging callback; use `NOOP` only for deliberately ignored results.

Do not copy development credentials or permissive demo auth into a new deployment.
