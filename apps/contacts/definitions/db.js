// The data of the application goes through DATA (QueryBuilder), with the tables named as in SQL: DATA.find('tbl_contact').
// Here the default database is the embedded NoSQL database, so the application needs no database server. An application that moves to
// PostgreSQL changes this definition for the one of its adapter, and its actions stay as they are.
NEWDB('default', F.querybuilders.nosql);
