# Actions

An action is one unit of server logic: a name, the input it accepts, who may call it, and a function. Define it with `NEWACTION` in an `actions/` file. An application written before Total.js 5 added that folder has its actions in `schemas/`, which is loaded in the same way: leave them there. One file has all the actions of a collection (`actions/tickets.js`); a folder for each action is only the layout of a [kit of standalone actions](action-kits.md).

```js
NEWACTION('Redirects|save', {
	name: 'Save redirect',
	input: 'id,*url,*target,permanent:Boolean',
	permissions: 'redirects,admin',
	action: function($, model) {

		if (model.id) {
			var item = MAIN.db.redirects.findItem('id', model.id);
			if (!item) {
				$.invalid(404);
				return;
			}
			item.dtupdated = NOW;
			item.url = model.url;
			item.target = model.target;
			item.permanent = model.permanent;
		} else {
			model.id = UID();
			model.dtcreated = NOW;
			MAIN.db.redirects.push(model);
		}

		FUNC.save();
		$.success();
	}
});
```

## Naming

`Collection|verb`, collection in plural and capitalized: `Tickets|list`, `Groups|create`, `Users|remove`. Separate the two parts with a pipe `|`.

Use `|` between parts of action and schema names, never `/` or `\`: `Tickets|list`, `Reports|Categories|list`, `@Reports|Categories`. A simple name such as `Tickets` or `@Group` needs no separator. This applies to grouped and nested names too.

Existing code may contain slash names; they are not the naming rule to reproduce. When correcting them, update registrations, route targets, `ACTION` / `$.action` calls and direct action-name `tapi()` calls together. Check automatically generated endpoint names and existing external callers; preserve public URLs with explicit routes or compatibility mappings where needed. Do not change URL path separators or plugin method paths such as `?/refresh`: this rule applies to action/schema names.

The framework's MCP sanitizer maps both `/` and `|` to `_`; the pipe convention is our naming choice, not an MCP requirement.

The usual verbs:

| Verb | Does | Input |
|---|---|---|
| `list` | returns a collection, often with `autoquery` | query string |
| `read` | returns one record | `params: '*id:UID'` |
| `create` | inserts, answers with the new id | `input` |
| `update` | modifies one record | `params` + `input` |
| `save` | create or update by `id` | `input` with optional `id` |
| `remove` | deletes or flags one record | `params` |

Always give the action a human `name:` ("Save redirect"): it is used in logs and tools.

## Input and params

- `input:` is the body, `params:` is the route parameters (`{id}`), `query:` is the query string.
- A text spec: `'*name,color:Color,icon:Icon,permissions:[String]'`. A leading `*` makes a field required. After `:` goes the type (`Boolean`, `Number`, `UID`, `Email`, `Phone`, `Color`, `Date`, `String(100)`, `[String]`).
- Reuse a definition with a named schema and `@`:

```js
NEWSCHEMA('@Group', '*name,color:Color,icon:Icon,reference,permissions:[String]');

NEWACTION('Groups|create', {
	name: 'Create group',
	input: '@Group',
	action: async function($, model) { /* ... */ }
});
```

- Route parameters arrive in `$.params`, not as an argument: `$.params.id`.
- A list typed `*field:[String]` is required: an empty list counts as missing. If empty is valid, drop the `*`.

## Answering

| Call | Use |
|---|---|
| `$.callback(data)` | return data (a record, a list, an id) |
| `$.success()` / `$.success(id)` | the success answer of the app (`DEF.onSuccess`: by default `{ success: true }`, with the value if you pass one) |
| `$.invalid(404)` | not found; the number is the HTTP status |
| `$.invalid('@(Text for the user)')` | validation or business error; `@(...)` marks it for translation |

Complete each response path once. Use an early `return` when code would otherwise fall through after answering; a terminal callback does not need a redundant return. A delegated `.callback($)` or `.callback($.done(id))` also completes the action.

## Permissions

`permissions: 'redirects,admin'` uses the app's `UNAUTHORIZED` policy. Preserve the app's authorization mechanism: some actions use `permissions`, others `user: true`, `sa`, or an explicit `UNAUTHORIZED($, ...)` check. Authentication and access to a particular record are separate checks. Menu visibility grants no server access.

For a protected action that may also be called internally, declare the appropriate action-level check; the `+` on an HTTP route alone does not protect other invocation paths. `public: true` in reference code is not proof that an endpoint is anonymous; inspect the route and action checks. See `builders.js` action execution in the framework source.

## Options and calling

Beyond `input`, an action can declare `summary` (the description of the tool when it is exposed), `config` (defaults read as `$.config`), `output` (a filter: only the declared keys leave the action), `timeout`, `cache` and `mcp: true`. Callers override per call: `ACTION('Name', payload).config({}).env('test').user(user).promise()`. `.promise()` resolves with the answer and rejects with the error list. Standalone actions with tests: see [action kits](action-kits.md).

## Async and data

Actions are `async` when they await `DATA` calls. Pass `$` to `.promise($)` so errors answer the request for you:

```js
action: async function($) {
	var params = $.params;
	var model = await DATA.read('op.tbl_group').id(params.id).error('@(Group not found)').promise($);
	$.callback(model);
}
```

See [queries](../database/queries.md) for `DATA`.

## Calling one action from another

`$.action('Items|types').promise()` (or `ACTION('Items|types', model).promise()` outside a request). Keep shared pieces in an action instead of copying code.

## Grouped schemas are also Total.js 5

`NEWSCHEMA('Tickets', function(schema) { schema.action('list', { ... }); });`. Reusable input definitions and grouped actions are Total.js 5. Keep the target project's established form.

## Keep an action small

Split a repeated operation or a distinct responsibility when it improves readability. Length alone is not a reason to add a helper or an action chain. Large filter builders (e.g. a `makefilter($, builder)` function inside the schema) stay next to the actions that use them.
