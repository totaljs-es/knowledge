// The data of the application goes through DATA (QueryBuilder), with the tables named as in SQL: DATA.find('tbl_contact').
// Here the default database is PostgreSQL, with the connection of the config. This definition is what differs from apps/contacts, which keeps
// the same data in the embedded NoSQL database: the actions and the routes of both applications are the same files.
require('querybuilderpg').init('default', CONF.database, 1, ERROR('PostgreSQL'));
