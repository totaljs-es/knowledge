# SQL scripts (PostgreSQL)

## Files

- `database.sql` holds the whole current schema, so a new installation needs one file.
- Preserve the existing root SQL-file layout in apps that use it. When grouping SQL and maintenance files in a directory, use `private/database/`; update application readers, migration tools and package allowlists together. This layout policy does not change the SQL contract. See [project structure](../general/project-structure.md).
- A change to an existing installation goes in a separate script next to it, named with a date: `database-2024-10-30.sql`. Prefer the dated name with dashes, as the file rule requires.
- The first lines of an upgrade script say which version it upgrades from and that it must run before the app starts.
- Inside a script, order the objects: **tables, views, functions and stored procedures, indexes**, each part under a banner comment (`-- TABLES`, `-- VIEWS`, `-- INDEXES`).
- Wrap the script in `BEGIN; ... COMMIT;` so that it applies completely or not at all.

## Names

All lowercase, singular.

| Object | Prefix | Example |
|---|---|---|
| table | `tbl_` | `tbl_user`, `tbl_ticket_time` |
| code list (rarely changes, used for choices) | `cl_` | `cl_status`, `cl_type` |
| view | `view_` | `view_ticket` |
| stored procedure | `sp_` | `sp_user` |
| function | `fn_` | `fn_user` |

Name indexes `<table>_idx<what>`: `tbl_ticket_idxstatus`. Name foreign keys `<table>_<column>_fkey`.

## Columns

- Type `text`, not `varchar`. Lists are `_text`, structured data `json` or `jsonb`, small numbers `int2`, dates `timestamp`, flags `bool`.
- `id` is the primary key, `text`, filled in the code with `UID()`. A foreign key is the table plus `id`: `userid`, `folderid`, `parentid`.
- Dates start with `dt`: `dtcreated`, `dtupdated`, `dtremoved`. Booleans start with `is`: `isremoved`, `ispublic`, `isdisabled`.
- Use the same names for the same thing in every table: `name`, `body`, `search`, `sortindex`, `icon`, `color`.
- New feature tables include `id`, `name` and `dtcreated`. Preserve established schemas and externally owned contracts; document a concrete exception instead of treating these columns as optional by default.
- Tables tracking changes normally also have `createdby`, `updatedby`, `removedby` as `jsonb`, and `dtupdated`, `dtremoved`. Without an authenticated actor, keep the author columns nullable rather than fabricating a user. A caller display field such as `username` is separate from authorship.
- `dtcreated` defaults to UTC now: `DEFAULT timezone('utc'::text, now())`.
- A column that lists search keywords is called `search`.

## Order of the columns

Identifiers first, then main fields, numbers, booleans, and dates last. Then the constraints and the primary key.

```sql
CREATE TABLE "public"."tbl_ticket" (
	"id" text NOT NULL,
	"folderid" text,
	"ownerid" text,
	"name" text,
	"search" text,
	"attrs" json,
	"worked" int4 DEFAULT 0,
	"ispublic" bool DEFAULT false,
	"isremoved" bool DEFAULT false,
	"dtupdated" timestamp,
	"dtcreated" timestamp DEFAULT timezone('utc'::text, now()),
	CONSTRAINT "tbl_ticket_folderid_fkey" FOREIGN KEY ("folderid") REFERENCES "public"."tbl_folder"("id") ON DELETE CASCADE ON UPDATE CASCADE,
	PRIMARY KEY ("id")
);
```

## Code lists

A `cl_` table holds the choices of the app and is read once into memory.

```sql
CREATE TABLE "public"."cl_status" (
	"id" text NOT NULL,
	"name" text,
	"icon" text,
	"color" text,
	"sortindex" int2 DEFAULT 0,
	PRIMARY KEY ("id")
);
```

## Format

Tabs (width 4), no useless casts (`name <> 'x'`, not `name <> 'x'::text`), one statement per `;`, a trailing `;` on every command.

## Audit fields and migrations

Authorship fields are project schema conventions, not automatically populated database/framework columns. For a feature that records changes, include the columns and leave the actor null when no authenticated identity exists:

```sql
"createdby" jsonb,
"updatedby" jsonb,
"removedby" jsonb,
"dtcreated" timestamp DEFAULT timezone('utc'::text, now()),
"dtupdated" timestamp,
"dtremoved" timestamp
```

Optional display fields such as username or summary belong only to features that need them. A schema default is not a migration of existing tables: add an upgrade when introducing columns or renaming tables in an installed application.
