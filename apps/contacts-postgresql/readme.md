# Contacts on PostgreSQL

The API of [`apps/contacts`](../contacts) with its data in PostgreSQL. Its actions, its routes and its authorization are the same files, byte for byte: what changes is the definition of the database.

**The request it answers:** "My contacts API has grown: move its data to PostgreSQL."

**The shape:** an application without plugins, with `DATA` (QueryBuilder) on PostgreSQL. An application written with `DATA` from the start moves here without touching its actions.

## What differs from apps/contacts

| File | In `apps/contacts` | Here |
|---|---|---|
| `definitions/db.js` | `NEWDB('default', F.querybuilders.nosql);` | `require('querybuilderpg').init('default', CONF.database, 1, ERROR('PostgreSQL'));` |
| `config` | | `database : postgresql://user:password@localhost/contacts` |
| `package.json` | | the dependency `querybuilderpg` |
| `database.sql` | | the table `tbl_contact` |
| `definitions/init.js` | | creates the table from `database.sql` the first time the application starts |

`schemas/contacts.js`, `controllers/api.js` and `definitions/auth.js` do not change. A test checks that they are the same files.

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
