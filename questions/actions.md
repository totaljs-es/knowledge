# Actions: questions and answers

## What is an action?

One unit of server logic: a name, the input it accepts, who may call it, and a function. It is defined with `NEWACTION` in a file of `actions/`:

```js
NEWACTION('Contacts|create', {
	name: 'Create a contact',
	input: '*name:String, email:Email, phone:Phone',
	action: async function($, model) {
		model.id = UID();
		model.dtcreated = NOW;
		await DATA.insert('nosql/tbl_contact', model).promise($);
		$.success(model.id);
	}
});
```

## How do I name an action?

`Collection|verb`: the collection in plural with a capital letter, a pipe, and the verb. `Tickets|list`, `Groups|create`, `Users|remove`. Never `/` between the parts.

```js
NEWACTION('Tickets|list', {
	name: 'List of tickets',
	action: function($) {
		DATA.find('nosql/tbl_ticket').callback($);
	}
});
```

## Which verbs do actions use?

| Verb | Does |
|---|---|
| `list` | returns a collection |
| `read` | returns one record |
| `create` | inserts and answers with the new id |
| `update` | modifies one record |
| `save` | creates or updates by `id` |
| `remove` | deletes one record |

## Where do I put the actions?

In `actions/`, one file per collection: `actions/contacts.js`. An application written before Total.js 5 added this folder has its actions in `schemas/`, which is loaded in the same way: leave them there. In an application with plugins, in `plugins/<name>/actions/`. The routes that call them go in `controllers/` or in the `index.js` of the plugin.

## What is the folder schemas/?

The folder of the actions in the applications written before Total.js 5 added `actions/`. Total.js 5 loads both in the same way, so a `NEWACTION` in `schemas/tickets.js` works as one in `actions/tickets.js`. In an application that has `schemas/`, keep writing its actions there and do not move them; a new application uses `actions/`. The name comes from `NEWSCHEMA`, which groups actions and is also part of Total.js 5.

## How do I declare the input of an action?

With a text in `input`: the fields separated by commas, `*` before a required field and the type after `:`.

```js
input: '*name:String, email:Email, phone:Phone, isactive:Boolean, tags:[String]'
```

The body arrives validated as the second argument of the function: `action: function($, model)`.

## Which types can a field have?

`String`, `String(100)` with a maximum length, `Number`, `Boolean`, `Date`, `UID`, `Email`, `Phone`, `URL`, `Color`, `Icon`, and a list with brackets: `[String]`. A wrong value answers 400 with the name of the field.

## How do I read the id of the address?

Declare it in `params` and read it in `$.params`:

```js
NEWACTION('Contacts|read', {
	name: 'Read a contact',
	params: '*id:UID',
	action: async function($) {
		var item = await DATA.read('nosql/tbl_contact').id($.params.id).error(404).promise($);
		$.callback(item);
	}
});
```

The route has `{id}` in its address: `ROUTE('+API ? -contacts_read/{id} --> Contacts|read')`.

## How do I read the query string in an action?

Declare it in `query` and read it in `$.query`:

```js
NEWACTION('Items|list', {
	name: 'List of items',
	query: 'search:String',
	action: function($) {
		$.callback($.query.search);
	}
});
```

## How does an action answer?

| Call | Use |
|---|---|
| `$.callback(data)` | returns data: a record, a list |
| `$.success()` or `$.success(id)` | the answer of success, with a value if you pass one |
| `$.invalid(404)` | an error with that HTTP status |
| `$.invalid('@(Text for the user)')` | a validation or business error |

Answer once on each path, and `return` after an early answer.

## How do I answer that a record does not exist?

`$.invalid(404)`. With `DATA`, `.error(404)` does it when the query finds nothing:

```js
if (!item) {
	$.invalid(404);
	return;
}
```

```js
var item = await DATA.read('nosql/tbl_contact').id($.params.id).error(404).promise($);
```

## How do I answer with an error message for the user?

`$.invalid('@(text)')`. The `@(...)` marks the text for translation:

```js
if (MAIN.monitor.sites.findItem('url', model.url)) {
	$.invalid('@(The website is already in the list)');
	return;
}
```

## How do I restrict an action to some users?

With `permissions` or `user: true` in the action. The `+` of the route asks for a logged-in user; the check of the action also protects a call that does not come from that route.

```js
NEWACTION('Redirects|save', {
	name: 'Save redirect',
	input: 'id,*url,*target,permanent:Boolean',
	permissions: 'redirects,admin',
	action: function($, model) {
		$.success();
	}
});
```

## How do I reuse the fields of an input?

With a named schema and `@`:

```js
NEWSCHEMA('@Group', '*name,color:Color,icon:Icon,reference,permissions:[String]');

NEWACTION('Groups|create', {
	name: 'Create group',
	input: '@Group',
	action: function($, model) {
		$.success();
	}
});
```

## How do I call one action from another?

`$.action('Name').promise()` inside an action, and `ACTION('Name', model)` outside a request:

```js
var types = await $.action('Items|types').promise();
```

```js
ACTION('Sites|check').callback(ERROR('Sites|check'));
```

## Why is my action async?

Because it waits for the database. Pass `$` to `.promise($)`: an error of the query then answers the request by itself.

```js
action: async function($) {
	var item = await DATA.read('nosql/tbl_contact').id($.params.id).error(404).promise($);
	$.callback(item);
}
```

## Does every action need a name?

Yes: `name` is a short text for people ("Save redirect"). Logs and tools use it. The first argument of `NEWACTION` is its identifier (`Redirects|save`).

## Why does my required list reject an empty list?

A field `*tags:[String]` is required, and an empty list counts as missing. If an empty list is valid, take the `*` away: `tags:[String]`.

## Why is my Boolean false when the field was not sent?

A `Boolean` that is absent is `false`. When the absence must mean "unchanged", declare the action with `partial: true`.
