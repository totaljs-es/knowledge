---
question: Where do the routes and the logic of an API go?
question_es: ¿Dónde van las rutas y la lógica de una API?
---

# Where do the routes and the logic of an API go?

The logic is an action, in a file of `schemas/`. The route is one line in a file of `controllers/` and points to the action. The name of an action has a pipe: `Collection|verb`.

```js
// schemas/contacts.js
NEWACTION('Contacts|create', {
	name: 'Create a contact',
	input: '*name:String, email:Email',
	action: async function($, model) {
		model.id = UID();
		model.dtcreated = NOW;
		await DATA.insert('nosql/tbl_contact', model).promise($);
		$.success(model.id);
	}
});
```

```js
// controllers/api.js
exports.install = function() {
	ROUTE('+API    ?    +contacts_create    --> Contacts|create');
};
```

- `input` is the body, `params` the parameters of the address (`{id}`) and `query` the query string. A `*` makes a field required; a wrong value answers 400 with the name of the field.
- The request is a `POST` to `/api/` with `{ "schema": "contacts_create", "data": { ... } }`.
- The first `+` of the route asks for a signed in user; the `+` before the name says that the request has a body, and a `-` that it has none.
- In an application with plugins the routes are in the `index.js` of the plugin. They are never declared inside the action in a new application.

See [`apps/contacts`](../apps/contacts) and [actions](../conventions/backend/actions.md).
