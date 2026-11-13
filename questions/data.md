# Data with DATA: questions and answers

## Where do I keep the records of a new application?

In the embedded NoSQL database, through `DATA`, with the prefix `nosql/` before the name of the table. It needs no server, no definition and no dependency:

```js
var items = await DATA.find('nosql/tbl_contact').sort('name').promise($);
```

The file is `databases/tbl_contact.nosql`.

## How do I list records?

```js
NEWACTION('Contacts|list', {
	name: 'List of contacts',
	action: async function($) {
		var items = await DATA.find('nosql/tbl_contact').sort('name').promise($);
		$.callback(items);
	}
});
```

## How do I read one record?

`DATA.read()` with `.id()`. `.error(404)` answers 404 when it does not exist:

```js
var item = await DATA.read('nosql/tbl_contact').id($.params.id).error(404).promise($);
```

## How do I insert a record?

Fill the id with `UID()` and the date with `NOW` in the action:

```js
model.id = UID();
model.dtcreated = NOW;
await DATA.insert('nosql/tbl_contact', model).promise($);
$.success(model.id);
```

## How do I update a record?

```js
model.dtupdated = NOW;
await DATA.modify('nosql/tbl_contact', model).id($.params.id).error(404).promise($);
$.success($.params.id);
```

## How do I remove a record?

```js
await DATA.remove('nosql/tbl_contact').id($.params.id).error(404).promise($);
$.success($.params.id);
```

## How do I make a unique id?

`UID()`. It is a function of the framework: no package and no `require`.

```js
model.id = UID();
```

## How do I filter a query?

With conditions on the builder: `where(field, value)`, `in(field, array)`, `notin(field, array)`, `search(field, keyword)`.

```js
var items = await DATA.find('tbl_tag').fields('id,search').where('folderid', id).promise($);
```

## How do I choose the fields a query returns?

`.fields('a,b')`. Name them; do not read everything:

```js
var item = await DATA.read('tbl_user').fields('id,name').id(params.id).error('@(User not found)').promise($);
```

## How do I make a list with paging, sorting and filters from the query string?

With `autoquery`: it reads `?page=`, `limit`, `sort` and the fields you allow, with a default sort and a maximum page size.

```js
NEWACTION('Groups|list', {
	name: 'List of groups',
	action: function($) {
		DATA.find('op.view_group').autoquery($.query, 'id:UID,name,color,icon,users:Number,dtcreated:Date,dtupdated:Date', 'dtcreated_desc', 100).callback($);
	}
});
```

## How do I connect the application to PostgreSQL?

Put the address of the database in `config` and write one definition. Total.js 5 has its own client of PostgreSQL: no package to add.

```
database : postgresql://user:password@localhost/myapp
```

```js
// definitions/db.js
DATA.init('postgresql', '', CONF.database);
```

The empty name is the default database. `?pooling=5` at the end of the address keeps a pool of five connections.

The queries are the same `DATA` calls, with the name of the table without a prefix: `DATA.find('tbl_contact')`.

## How do I move from the embedded database to PostgreSQL?

Take the prefix `nosql/` away from the table names, add the definition with `DATA.init('postgresql', '', CONF.database)` and create the tables with `database.sql`. The queries do not change:

```js
// before
var items = await DATA.find('nosql/tbl_contact').sort('name').promise($);

// after
var items = await DATA.find('tbl_contact').sort('name').promise($);
```

## What is querybuilderpg?

The package that connected `DATA` to PostgreSQL before Total.js 5 had its own client. An application made with it has `require('querybuilderpg').init(...)` in `definitions/db.js` and the package in `package.json`: leave it as it is. A new application uses `DATA.init('postgresql', '', CONF.database)` and adds no package.

## How do I run raw SQL?

`DATA.query()` with parameters:

```js
await DATA.query('UPDATE tbl_ticket SET worked=worked+1 WHERE id=$1', [id]).promise($);
```

Prefer parameters (`$1`). When a value must go into the text, escape it with `PG_ESCAPE(value)`. Never concatenate what a user sent.

## How do I answer with success after a write without async?

`.callback($.done(id))` answers with the success of the application and that value:

```js
DATA.remove('tbl_tag').id($.params.id).error(404).callback($.done($.params.id));
```

`.callback($)` answers with the raw result of the query instead.

## How do I use DATA outside a request?

`.promise()` without `$`, with its own error handling, or a callback with the error first:

```js
FUNC.refreshtags = async function() {
	REPO.tags = await DATA.find('tbl_tag').fields('id,search').promise();
};
```

## How do I search by text in several fields?

With `or` and `search`:

```js
builder.or(function(b) {
	b.search('name', text);
	b.search('email', text);
});
```

## Do I need to set up QueryBuilder for the embedded database?

No. QueryBuilder comes loaded with Total.js 5 and the prefix `nosql/` sends the query to the embedded database. Only a database server needs one line: `DATA.init('postgresql', '', CONF.database)`.

## How do I name tables and fields in the embedded database?

As in SQL from the first day, so the application can move to PostgreSQL later: tables `tbl_contact`, dates `dtcreated` and `dtupdated`, flags `isdone`, a foreign key as the table plus `id` (`userid`).
