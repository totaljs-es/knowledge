// The users, for an administrator. A route with + only says that there is a session: who may do it is checked here.
function admin($) {
	if ($.user.sa)
		return true;
	$.invalid(401);
	return false;
}

NEWACTION('Users|list', {
	name: 'List of users',
	action: async function($) {

		if (!admin($))
			return;

		// The password never leaves the server
		var items = await DATA.find('nosql/tbl_user').fields('id,name,email,sa,isdisabled,dtcreated').sort('name').promise($);
		$.callback(items);
	}
});

NEWACTION('Users|create', {
	name: 'Create a user',
	input: '*name:String, *email:Email, *password:String, sa:Boolean',
	action: async function($, model) {

		if (!admin($))
			return;

		if (model.password.length < 8) {
			$.invalid('@(The password needs 8 characters or more)');
			return;
		}

		var same = await DATA.read('nosql/tbl_user').where('email', model.email).promise($);

		if (same) {
			$.invalid('@(There is already a user with this email)');
			return;
		}

		model.id = UID();
		model.password = model.password.sha256(CONF.auth_secret);
		model.isdisabled = false;
		model.dtcreated = NOW;
		await DATA.insert('nosql/tbl_user', model).promise($);
		$.success(model.id);
	}
});

NEWACTION('Users|remove', {
	name: 'Remove a user with its sessions and its notes',
	params: '*id:UID',
	action: async function($) {

		if (!admin($))
			return;

		if ($.params.id === $.user.id) {
			$.invalid('@(You cannot remove your own user)');
			return;
		}

		await DATA.remove('nosql/tbl_user').id($.params.id).error(404).promise($);
		await DATA.remove('nosql/tbl_session').where('userid', $.params.id).promise($);
		await DATA.remove('nosql/tbl_note').where('userid', $.params.id).promise($);
		$.success($.params.id);
	}
});
