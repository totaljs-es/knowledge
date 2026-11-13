# Contacts

An API of contacts with Total.js 5: list, read, create, update and remove. The data goes through `DATA` (QueryBuilder) on the embedded NoSQL database (`DATA.find('nosql/tbl_contact')`), so the application needs nothing else to run. It can move to PostgreSQL later by taking the prefix `nosql/` away: see [`apps/contacts-postgresql`](../contacts-postgresql).

**The request it answers:** "Create an API for contacts (name, email and phone) with a token, without a database server."

**The shape:** an application without plugins. It fits a small service with one or two collections. An application that will grow by features is made with plugins.

| File | What it has |
|---|---|
| `index.js` | Starts the framework |
| `config` | The name of the application and the token of the API |
| `package.json` | `total5` is the only dependency |
| `controllers/api.js` | The routes of the API, one line each |
| `actions/contacts.js` | The actions: `Contacts|list`, `Contacts|read`, `Contacts|create`, `Contacts|update`, `Contacts|remove` |
| `definitions/auth.js` | Who the request is: the token of the header `x-token` |
| `test.js` | The tests: they start the application and call every action |

## Run it

```
npm install
node index.js 8000
```

Every request is a `POST` to `/api/` with the header `x-token` and the action in `schema`:

```
POST http://127.0.0.1:8000/api/
x-token: change-this-token
content-type: application/json

{ "schema": "contacts_create", "data": { "name": "Anna", "email": "anna@example.com" } }
```

| Schema | Data | Answer |
|---|---|---|
| `contacts` or `contacts?search=an` | | the contacts, sorted by name |
| `contacts_read/{id}` | | the contact, or 404 |
| `contacts_create` | `name` (required), `email`, `phone` | `{ success: true, value: id }` |
| `contacts_update/{id}` | `name` (required), `email`, `phone` | `{ success: true, value: id }`, or 404 |
| `contacts_remove/{id}` | | `{ success: true, value: id }`, or 404 |

A request without the token is answered with 401, and a wrong field with 400 and the name of the field.

## Test it

```
node test.js
```
