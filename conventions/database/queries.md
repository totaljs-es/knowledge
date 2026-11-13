# Queries with `DATA`

For SQL-backed features, Total.js uses `DATA` and the configured database: PostgreSQL with `DATA.init('postgresql', '', CONF.database)` from Total.js 5 0.0.20-4, or `querybuilderpg` in an application made before. Do not introduce SQL into a FileStorage/MEMORIZE feature just to match this page. Use the builder for what it can express; write raw SQL only when needed.

For request-bound results use `.promise($)` (in an async action), `.callback($)` or `.callback($.done(id))`. In jobs and shared helpers without a request use `.promise()` with explicit error handling or an error-first callback. Do not invent a request context. Some source apps enqueue background writes without awaiting them; do not copy that when the response depends on the write succeeding.

## Read

```js
// one record
var item = await DATA.read('tbl_user').fields('id,name').id(params.id).error('@(User not found)').promise($);

// several
var items = await DATA.find('tbl_tag').fields('id,search').where('folderid', id).promise($);

// values from a list
var apps = await DATA.find('op.tbl_app_permission').fields('id,appid').in('id', permissions).promise($);
```

- `.fields('a,b')` selects columns; name them, do not read `*`.
- `.id(value)` filters by the primary key.
- `.error('@(text)')` or `.error(404)` answers with that error when nothing is found. It is what turns a missing row into a 404.

## A list for the UI

`autoquery` reads the query string (`?q=`, `sort`, `page`, `limit`) and builds the query. Name the allowed fields and their types, a default sort and a maximum page size:

```js
NEWACTION('Groups|list', {
	name: 'List of groups',
	action: function($) {
		DATA.find('op.view_group').autoquery($.query, 'id:UID,name,color,icon,users:Number,dtcreated:Date,dtupdated:Date', 'dtcreated_desc', 100).callback($);
	}
});
```

A reusable joined list often reads from a `view_`. `DATA.list(...)` is used for paginated output and `DATA.find(...)` for plain lists. Preserve the response shape expected by the UI rather than swapping them because their query chains look similar.

## Write

```js
model.id = UID();
model.dtcreated = NOW;
await DATA.insert('tbl_ticket_time', model).promise($);

model.dtupdated = NOW;
await DATA.modify('op.tbl_group', model).id(params.id).error('@(Group not found)').promise($);

await DATA.remove('tbl_tag').id(params.id).error(404).promise($);
await DATA.remove('tbl_notification').where('ticketid', params.id).where('typeid', 'logwork').promise($);
```

- Fill `id` with `UID()` and the dates with `NOW` in the action, not in the database.
- Remove fields that are not columns before `insert` / `modify` (`model.permissions = undefined`).
- Update or insert in one call: `DATA.modify('tbl_x', data, true).id(id).insert(fn, params)`.

## Success after a write

When a write should return the app's success envelope rather than its raw database result, use:

```js
DATA.remove('tbl_tag').id($.params.id).error(404).callback($.done($.params.id));
```

Keep the established response contract. A raw `.callback($)` and `$.done(id)` are not interchangeable responses.

## Conditions

`where(field, value)`, `in(field, array)`, `notin(field, array)`, `search(field, keyword)`, `or(function(b) { b.search('name', m); b.search('email', m); })`.

```js
var keywords = text.toKeywords(true, true);
for (var i = 0; i < keywords.length; i++)
	builder.search('a.search', keywords[i]);
```

## Raw SQL

`DATA.query('UPDATE tbl_ticket a SET worked=(SELECT ...) WHERE a.id=$1', [id]).promise($)`.

- Prefer parameters (`$1`) over building the text.
- When a value must go into the text, escape it with `PG_ESCAPE(value)` before `.format()`. Never concatenate user input.

## Schemas (namespaces)

A table can be addressed with its schema: `op.tbl_user`. Keep the prefix consistent inside one file.
