NEWACTION('Account|login', {
	name: 'Sign in',
	input: '*email:Email, *password:String',
	action: async function($, model) {

		// Ten wrong tries from the same client close the door for ten minutes
		if (BLOCKED($, 10, '10 minutes')) {
			$.invalid('@(Too many tries, wait a few minutes)');
			return;
		}

		var user = await DATA.read('nosql/tbl_user').where('email', model.email).where('password', model.password.sha256(CONF.auth_secret)).promise($);

		// The same answer for an email that does not exist and for a wrong password
		if (!user || user.isdisabled) {
			$.invalid('@(Invalid credentials)');
			return;
		}

		BLOCKED($, -1);

		var session = {};
		session.id = UID();
		session.userid = user.id;
		session.ip = $.ip;
		session.dtexpire = NOW.add(CONF.auth_cookie_expire);
		session.dtcreated = NOW;

		await DATA.insert('nosql/tbl_session', session).promise($);
		MAIN.session.authcookie($, session.id, user.id, CONF.auth_cookie_expire);
		$.success();
	}
});

NEWACTION('Account|logout', {
	name: 'Sign out',
	action: async function($) {
		// Only this session: the same user may be signed in on another device
		await DATA.remove('nosql/tbl_session').id($.sessionid).promise($);
		MAIN.session.logout($);
		$.success();
	}
});

NEWACTION('Account|read', {
	name: 'The user of the session',
	action: function($) {
		$.callback($.user);
	}
});

NEWACTION('Account|password', {
	name: 'Change the password of the user of the session',
	input: '*password:String',
	action: async function($, model) {

		if (model.password.length < 8) {
			$.invalid('@(The password needs 8 characters or more)');
			return;
		}

		await DATA.modify('nosql/tbl_user', { password: model.password.sha256(CONF.auth_secret), dtupdated: NOW }).id($.user.id).error(404).promise($);
		$.success();
	}
});
