---
question: How do I move an application from the embedded database to PostgreSQL?
question_es: ¿Cómo paso una aplicación de la base de datos embebida a PostgreSQL?
---

# How do I move an application from the embedded database to PostgreSQL?

An application that uses `DATA` from the start changes three things, and no query is written again. Total.js 5 has its own client of PostgreSQL from 0.0.20-4 (`"total5": ">=0.0.20-4"` in `package.json`), so there is no package to add:

1. Add the connection to `config`: `database : postgresql://user:password@localhost/myapp`.
2. Add the definition of the database:

```js
// definitions/db.js
DATA.init('postgresql', '', CONF.database);
```

3. Take the prefix `nosql/` away from the table names:

```js
// before
var items = await DATA.find('nosql/tbl_contact').sort('name').promise($);

// after
var items = await DATA.find('tbl_contact').sort('name').promise($);
```

The tables must exist in PostgreSQL: write them in `database.sql`, with the same names the application already used.

[`apps/contacts`](../apps/contacts) and [`apps/contacts-postgresql`](../apps/contacts-postgresql) are the same application before and after; a test checks that their actions differ only in that prefix.
