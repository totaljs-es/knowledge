# Storage and integrations

Choose the model already used by the feature. Not every app stores data in SQL.

## Persistence and cache ownership

| Model | How to extend it |
|---|---|
| Metadata in memory, serialized to FileStorage | Mutate the existing collection, call `FUNC.save()`, refresh affected rendering caches when necessary |
| SQL through `DATA` and `querybuilderpg` | Keep projections, filters, identifiers, response shapes and adapter initialization |
| Named persisted memory object | Keep `MEMORIZE` object ownership and existing save hooks |
| Flow state | Keep flow load/save lifecycle and websocket permissions together |

Do not switch models during a cleanup.

A `FUNC.load` typically reads the metadata, initializes defaults, compiles derived objects and emits reload; `FUNC.save` excludes compiled references before serialization. Changing a record can therefore require cache refresh as well as saving. Follow the feature's actual invalidation path rather than inventing a second cache.

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
