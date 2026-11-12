# Prefer direct native patterns

Operations go directly in actions and plugin methods, with shared behaviour in `FUNC` or a dedicated integration module. There is no service/repository/DTO stack for each feature.

## Choose the existing operation

| Need | First choice | Avoid introducing merely for indirection |
|---|---|---|
| Typed request | `input`, `params`, `query`, shared `@Schema` | A second validator for the same type checks |
| Find a cached item | `items.findItem('id', id)` | A one-use lookup service |
| Query SQL | `DATA.read/find/list/insert/modify/remove` | A repository class mirroring the builder |
| Outgoing HTTP | `RESTBuilder` | A fetch/axios wrapper that duplicates existing transport |
| App paths | `PATH.root/public/databases/temp` | Hard-coded machine paths or a new path resolver |
| App files and metadata | Existing `FILESTORAGE`, `MEMORIZE`, `FUNC.load/save` | A new persistence backend for the same data |
| Shared business operation | Existing action or a small `FUNC.name` | Forwarding through several functions without adding behaviour |
| UI state and calls | `PLUGIN`, model paths, `exports.tapi`, components | A second state store or HTTP client |
| UI events | `exec` and plugin methods | Separate event wiring for standard buttons |

These are selection defaults, not a ban on helpers. A helper earns its place by expressing a reused operation or isolating an integration, not by forwarding the same arguments. Keep names and object shapes familiar to the surrounding app.

## Input is already typed; business rules still matter

Example:

```js
NEWACTION('Redirects|read', {
	name: 'Read redirect',
	input: '*id',
	permissions: 'redirects,admin',
	action: function($, model) {
		var item = MAIN.db.redirects.findItem('id', model.id);
		if (item)
			$.callback(item);
		else
			$.invalid(404);
	}
});
```

Do not reparse `model.id` or add an alternative success envelope. In a user-owned feature, also constrain the lookup to the owner or tenant using the target app's existing rule.

## Know the execution context

`Total.*`, `DATA`, `NOW` and prototypes are available after framework initialization; browser `SET`/`PLUGIN` APIs belong to the loaded UI library. A standalone Node script must initialize what it needs. Never replace a tool's valid Node import with an unavailable app global.
