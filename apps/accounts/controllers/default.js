exports.install = function() {
	// A person with a session gets the application, and one without it gets the page to sign in, at any address
	ROUTE('+GET /', 'index');
	ROUTE('-GET /*', 'login');
};
