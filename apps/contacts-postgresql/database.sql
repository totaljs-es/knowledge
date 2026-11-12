BEGIN;

-- TABLES

CREATE TABLE "public"."tbl_contact" (
	"id" text NOT NULL,
	"name" text,
	"email" text,
	"phone" text,
	"dtupdated" timestamp,
	"dtcreated" timestamp DEFAULT timezone('utc'::text, now()),
	PRIMARY KEY ("id")
);

COMMIT;
