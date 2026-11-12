ON('ready', async function() {

	// The components of the interface, downloaded once as one file: the pages load it with @{REPO.ui}
	COMPONENTATOR('ui', 'exec,errorhandler,locale,input,validate,empty,notify,approve', true);

	// An application without users cannot be used: the first one is made here
	var users = await DATA.find('nosql/tbl_user').take(1).promise();

	if (!users.length)
		await DATA.insert('nosql/tbl_user', { id: UID(), name: 'Admin', email: CONF.admin_email, password: 'admin'.sha256(CONF.auth_secret), sa: true, isdisabled: false, dtcreated: NOW }).promise();
});
