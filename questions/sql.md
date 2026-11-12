# SQL scripts for PostgreSQL: questions and answers

## Where does the schema of the database go?

In `database.sql`: the whole current schema, so a new installation needs one file. A change to an installed application goes in a separate script next to it, named with its date: `database-2024-10-30.sql`.

## How do I name tables, views and functions?

All lowercase, singular, with a prefix:

| Object | Prefix | Example |
|---|---|---|
| table | `tbl_` | `tbl_user`, `tbl_ticket_time` |
| code list | `cl_` | `cl_status` |
| view | `view_` | `view_ticket` |
| stored procedure | `sp_` | `sp_user` |
| function | `fn_` | `fn_user` |

## How do I name columns?

- `id` is the primary key, a `text` filled in the code with `UID()`.
- A foreign key is the table plus `id`: `userid`, `folderid`.
- Dates start with `dt`: `dtcreated`, `dtupdated`, `dtremoved`.
- Booleans start with `is`: `isremoved`, `ispublic`.
- The same name for the same thing in every table: `name`, `body`, `search`, `sortindex`, `icon`, `color`.

## Which column types do I use?

`text`, not `varchar`. Lists are `_text`, structured data `json` or `jsonb`, small numbers `int2`, dates `timestamp`, flags `bool`.

## How do I write a table?

Identifiers first, then the main fields, numbers, booleans, and dates last. Then the constraints and the primary key:

```sql
CREATE TABLE "public"."tbl_ticket" (
	"id" text NOT NULL,
	"folderid" text,
	"name" text,
	"worked" int4 DEFAULT 0,
	"isremoved" bool DEFAULT false,
	"dtupdated" timestamp,
	"dtcreated" timestamp DEFAULT timezone('utc'::text, now()),
	CONSTRAINT "tbl_ticket_folderid_fkey" FOREIGN KEY ("folderid") REFERENCES "public"."tbl_folder"("id") ON DELETE CASCADE ON UPDATE CASCADE,
	PRIMARY KEY ("id")
);
```

## Who fills the id and the dates of a row?

The action, not the database: `model.id = UID()` and `model.dtcreated = NOW` before the insert. The column `dtcreated` also has the default `timezone('utc'::text, now())`.

## What is a code list?

A `cl_` table with the choices of the application (statuses, types). It rarely changes and is read once into memory:

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

## How do I order a SQL script?

Tables, then views, then functions and stored procedures, then indexes, each part under a comment (`-- TABLES`, `-- VIEWS`, `-- INDEXES`). Wrap the script in `BEGIN;` and `COMMIT;` so that it applies completely or not at all.

## How do I name indexes and foreign keys?

An index is `<table>_idx<what>`: `tbl_ticket_idxstatus`. A foreign key is `<table>_<column>_fkey`: `tbl_ticket_folderid_fkey`.

## Which columns record who changed a row?

`createdby`, `updatedby` and `removedby` as `jsonb`, with `dtcreated`, `dtupdated` and `dtremoved`. They are a convention of the project: the code fills them. Without a logged-in user leave them empty instead of inventing one.
