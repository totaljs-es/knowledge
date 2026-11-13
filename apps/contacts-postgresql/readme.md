# Contacts on PostgreSQL

The API of [`apps/contacts`](../contacts) with its data in PostgreSQL. Its routes and its authorization are the same files, and its actions are the same code: only the prefix `nosql/` of the table name is gone.

**The request it answers:** "My contacts API has grown: move its data to PostgreSQL."

**The shape:** an application without plugins, with `DATA` (QueryBuilder) on PostgreSQL. An application written with `DATA` from the start moves here by adding the definition of the database and taking the prefix `nosql/` away from its table names; no query is written again.

## What differs from apps/contacts

| File | In `apps/contacts` | Here |
|---|---|---|
| `actions/contacts.js` | `DATA.find('nosql/tbl_contact')` | `DATA.find('tbl_contact')` |
| `definitions/db.js` | | `DATA.init('postgresql', '', CONF.database);` |
| `config` | | `database : postgresql://user:password@localhost/contacts` |
| `package.json` | | `"total5": ">=0.0.20-4"`, the first version with the client of PostgreSQL |
| `database.sql` | | the table `tbl_contact` |
| `definitions/init.js` | | creates the table from `database.sql` the first time the application starts |

`controllers/api.js` and `definitions/auth.js` do not change, and `actions/contacts.js` changes only in that prefix. A test checks both.

The table has the names of the SQL conventions, which the application used from the start: `tbl_contact`, `id` as `text` filled with `UID()`, `dtcreated` and `dtupdated`.

## Run it

Create the database and write its connection in `config`:

```
createdb contacts
npm install
node index.js 8000
```

The API is the one of `apps/contacts`.

## Test it

The tests need PostgreSQL and a database only for them, because they drop and create the table `tbl_contact` there:

```
createdb knowledge_test
node test.js
```

The connection is at the top of `test.js`. When PostgreSQL does not answer, the tests say `SKIPPED` and end with the code 3.
