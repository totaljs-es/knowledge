exports.install = function() {

	// Without a session: only the sign in
	ROUTE('-API    ?    +login                   --> Account|login');

	// With a session
	ROUTE('+API    ?    -logout                  --> Account|logout');
	ROUTE('+API    ?    -account                 --> Account|read');
	ROUTE('+API    ?    +account_password        --> Account|password');

	ROUTE('+API    ?    -notes                   --> Notes|list');
	ROUTE('+API    ?    +notes_save              --> Notes|save');
	ROUTE('+API    ?    -notes_remove/{id}       --> Notes|remove');

	// Only for an administrator: the action checks it
	ROUTE('+API    ?    -users                   --> Users|list');
	ROUTE('+API    ?    +users_create            --> Users|create');
	ROUTE('+API    ?    -users_remove/{id}       --> Users|remove');
};
