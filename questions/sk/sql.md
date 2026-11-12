# SQL skripty pre PostgreSQL: otázky a odpovede

## Kam patrí schéma databázy?

Do `database.sql`: celá aktuálna schéma, aby nová inštalácia potrebovala jeden súbor. Zmena v už nainštalovanej aplikácii ide do samostatného skriptu vedľa neho, pomenovaného dátumom: `database-2024-10-30.sql`.

## Ako pomenujem tabuľky, pohľady a funkcie?

Všetko malými písmenami, v jednotnom čísle, s prefixom:

| Objekt | Prefix | Príklad |
|---|---|---|
| tabuľka | `tbl_` | `tbl_user`, `tbl_ticket_time` |
| číselník | `cl_` | `cl_status` |
| pohľad | `view_` | `view_ticket` |
| uložená procedúra | `sp_` | `sp_user` |
| funkcia | `fn_` | `fn_user` |

## Ako pomenujem stĺpce?

- `id` je primárny kľúč, `text`, ktorý kód naplní cez `UID()`.
- Cudzí kľúč je tabuľka plus `id`: `userid`, `folderid`.
- Dátumy sa začínajú na `dt`: `dtcreated`, `dtupdated`, `dtremoved`.
- Booleovské hodnoty sa začínajú na `is`: `isremoved`, `ispublic`.
- Rovnaký názov pre rovnakú vec v každej tabuľke: `name`, `body`, `search`, `sortindex`, `icon`, `color`.

## Aké typy stĺpcov použijem?

`text`, nie `varchar`. Zoznamy sú `_text`, štruktúrované údaje `json` alebo `jsonb`, malé čísla `int2`, dátumy `timestamp`, príznaky `bool`.

## Ako napíšem tabuľku?

Najprv identifikátory, potom hlavné polia, čísla, booleovské hodnoty a dátumy na konci. Potom obmedzenia a primárny kľúč:

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

## Kto plní id a dátumy riadku?

Akcia, nie databáza: `model.id = UID()` a `model.dtcreated = NOW` pred vložením. Stĺpec `dtcreated` má navyše predvolenú hodnotu `timezone('utc'::text, now())`.

## Čo je číselník?

Tabuľka `cl_` s voľbami aplikácie (stavy, typy). Mení sa zriedka a číta sa raz do pamäte:

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

## Ako usporiadam SQL skript?

Tabuľky, potom pohľady, potom funkcie a uložené procedúry, potom indexy, každá časť pod komentárom (`-- TABLES`, `-- VIEWS`, `-- INDEXES`). Skript obaľ do `BEGIN;` a `COMMIT;`, aby sa použil celý alebo vôbec.

## Ako pomenujem indexy a cudzie kľúče?

Index je `<tabuľka>_idx<čo>`: `tbl_ticket_idxstatus`. Cudzí kľúč je `<tabuľka>_<stĺpec>_fkey`: `tbl_ticket_folderid_fkey`.

## Ktoré stĺpce zaznamenávajú, kto zmenil riadok?

`createdby`, `updatedby` a `removedby` ako `jsonb`, spolu s `dtcreated`, `dtupdated` a `dtremoved`. Sú konvenciou projektu: plní ich kód. Bez prihláseného používateľa ich nechaj prázdne namiesto vymýšľania.
