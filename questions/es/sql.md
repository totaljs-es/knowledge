# Scripts SQL para PostgreSQL: preguntas y respuestas

## ¿Dónde va el esquema de la base de datos?

En `database.sql`: el esquema actual entero, para que una instalación nueva necesite un solo archivo. Un cambio en una aplicación ya instalada va en un script aparte a su lado, con la fecha en el nombre: `database-2024-10-30.sql`.

## ¿Cómo nombro las tablas, las vistas y las funciones?

Todo en minúsculas, en singular, con un prefijo:

| Objeto | Prefijo | Ejemplo |
|---|---|---|
| tabla | `tbl_` | `tbl_user`, `tbl_ticket_time` |
| lista de códigos | `cl_` | `cl_status` |
| vista | `view_` | `view_ticket` |
| procedimiento almacenado | `sp_` | `sp_user` |
| función | `fn_` | `fn_user` |

## ¿Cómo nombro las columnas?

- `id` es la clave primaria, un `text` que el código rellena con `UID()`.
- Una clave ajena es la tabla más `id`: `userid`, `folderid`.
- Las fechas empiezan por `dt`: `dtcreated`, `dtupdated`, `dtremoved`.
- Los booleanos empiezan por `is`: `isremoved`, `ispublic`.
- El mismo nombre para lo mismo en todas las tablas: `name`, `body`, `search`, `sortindex`, `icon`, `color`.

## ¿Qué tipos de columna uso?

`text`, no `varchar`. Las listas son `_text`, los datos estructurados `json` o `jsonb`, los números pequeños `int2`, las fechas `timestamp`, los indicadores `bool`.

## ¿Cómo escribo una tabla?

Primero los identificadores, después los campos principales, los números, los booleanos, y las fechas al final. Después las restricciones y la clave primaria:

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

## ¿Quién rellena el id y las fechas de una fila?

La acción, no la base de datos: `model.id = UID()` y `model.dtcreated = NOW` antes de insertar. La columna `dtcreated` tiene además el valor por defecto `timezone('utc'::text, now())`.

## ¿Qué es una lista de códigos?

Una tabla `cl_` con las opciones de la aplicación (estados, tipos). Cambia pocas veces y se lee una vez a memoria:

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

## ¿Cómo ordeno un script SQL?

Tablas, después vistas, después funciones y procedimientos almacenados, después índices, cada parte bajo un comentario (`-- TABLES`, `-- VIEWS`, `-- INDEXES`). Envuelve el script en `BEGIN;` y `COMMIT;` para que se aplique entero o no se aplique.

## ¿Cómo nombro los índices y las claves ajenas?

Un índice es `<tabla>_idx<qué>`: `tbl_ticket_idxstatus`. Una clave ajena es `<tabla>_<columna>_fkey`: `tbl_ticket_folderid_fkey`.

## ¿Qué columnas registran quién cambió una fila?

`createdby`, `updatedby` y `removedby` como `jsonb`, con `dtcreated`, `dtupdated` y `dtremoved`. Son una convención del proyecto: las rellena el código. Sin un usuario con sesión déjalas vacías en lugar de inventar uno.
