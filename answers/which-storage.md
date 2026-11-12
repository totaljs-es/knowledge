---
question: Where do I keep the data of a Total.js 5 application?
question_es: ¿Dónde guardo los datos de una aplicación Total.js 5?
---

# Where do I keep the data of a Total.js 5 application?

It depends on what the data is:

| The data | Use |
|---|---|
| The records of the application (contacts, tasks, orders) | `DATA` with QueryBuilder: `DATA.find('nosql/tbl_contact')` on the embedded NoSQL database |
| An embedded store that will never be SQL (a log, a queue) | `NOSQL('name')` |
| A small object that is kept by itself (settings, counters) | `MEMORIZE('name')` |
| Files | `FILESTORAGE('name')` |

```js
var items = await DATA.find('nosql/tbl_contact').sort('name').promise($);
var item = await DATA.read('nosql/tbl_contact').id($.params.id).error(404).promise($);
await DATA.insert('nosql/tbl_contact', model).promise($);
await DATA.modify('nosql/tbl_contact', model).id($.params.id).error(404).promise($);
await DATA.remove('nosql/tbl_contact').id($.params.id).error(404).promise($);
```

The embedded database needs no server, no definition and no dependency: the file is `databases/tbl_contact.nosql`. Name the tables and the fields as in SQL from the start (`tbl_contact`, `isdone`, `dtcreated`), so that the application can move to PostgreSQL later.

Examples: [`apps/contacts`](../apps/contacts) (`DATA`), [`apps/files`](../apps/files) (`FILESTORAGE`), [`apps/monitor`](../apps/monitor) (`MEMORIZE`). The page: [storage](../conventions/backend/storage-and-integrations.md).
