// Who the request is: the session of the cookie. The framework keeps the sessions in memory and reads the cookie; onread loads the
// user of a session the first time, and again when the session has not been used for a while (expire).
var opt = {};

opt.secret = CONF.auth_secret;
opt.cookie = CONF.auth_cookie;
opt.expire = '5 minutes';
opt.strict = false;
opt.ddos = 10;

opt.onread = async function(meta, next) {

	var session = await DATA.read('nosql/tbl_session').id(meta.sessionid).where('userid', meta.userid).promise();

	if (!session || new Date(session.dtexpire) < NOW) {
		next(404);
		return;
	}

	var user = await DATA.read('nosql/tbl_user').id(meta.userid).promise();

	// What the rest of the application knows about the user: never the password
	if (user && !user.isdisabled)
		next(null, { id: user.id, name: user.name, email: user.email, sa: user.sa === true });
	else
		next(404);
};

AUTH(opt);

// The actions that sign in and out use it
MAIN.session = opt;
