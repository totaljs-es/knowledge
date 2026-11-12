// The first start creates the table of the application from database.sql, as the official example of Total.js does
ON('ready', async function() {

	var tables = await DATA.query("SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='tbl_contact' LIMIT 1").promise();

	if (tables.length)
		return;

	var sql = Total.Fs.readFileSync(PATH.root('database.sql'), 'utf8');
	await DATA.query(sql).promise();
});
