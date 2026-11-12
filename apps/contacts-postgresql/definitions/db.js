// The data of the application goes through DATA (QueryBuilder): DATA.find('tbl_contact').
// Here the default database is PostgreSQL, with the connection of the config. apps/contacts keeps the same data in the embedded NoSQL
// database, where the same tables have the prefix nosql/ (DATA.find('nosql/tbl_contact')): the queries of both applications are the same.
require('querybuilderpg').init('default', CONF.database, 1, ERROR('PostgreSQL'));
