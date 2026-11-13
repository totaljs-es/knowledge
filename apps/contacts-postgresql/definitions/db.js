// The data of the application goes through DATA (QueryBuilder): DATA.find('tbl_contact').
// Here the default database is PostgreSQL, with the connection of the config. apps/contacts keeps the same data in the embedded NoSQL
// database, where the same tables have the prefix nosql/ (DATA.find('nosql/tbl_contact')): the queries of both applications are the same.
// Total.js 5 has its own client of PostgreSQL from 0.0.20-4: no package. The empty name is the default database.
DATA.init('postgresql', '', CONF.database);
