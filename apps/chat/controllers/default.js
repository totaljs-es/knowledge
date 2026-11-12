exports.install = function() {
	ROUTE('GET /', index);
	ROUTE('SOCKET /chat/', socket);
};

// Without a name the page asks for it; with a name it is the room
function index($) {
	var name = ($.query.name || '').trim().substring(0, 30);
	if (name)
		$.view('chat', { name: name });
	else
		$.view('join');
}

function socket($) {

	// The names of the people who are in the room, sorted
	var users = function() {
		var names = [];
		for (var key in $.connections) {
			var client = $.connections[key];
			client.name && names.push(client.name);
		}
		names.sort();
		return names;
	};

	$.on('open', function(client) {

		var name = (client.query.name || '').trim().substring(0, 30);

		// Nobody comes in without a name: the connection is closed a moment later, when it is completely open
		if (!name) {
			setTimeout(function(client) {
				client.close(4001);
			}, 500, client);
			return;
		}

		client.name = name;
		client.send({ TYPE: 'history', items: MAIN.messages });
		$.send({ TYPE: 'users', items: users() });
	});

	$.on('close', function(client) {
		// The connection that closed is not among the connections any more
		client.name && $.send({ TYPE: 'users', items: users() });
	});

	$.on('message', function(client, message) {

		if (!client.name || !message || message.TYPE !== 'message' || typeof(message.text) !== 'string')
			return;

		var text = message.text.trim().substring(0, 500);
		if (!text)
			return;

		var item = { TYPE: 'message', name: client.name, text: text, date: new Date() };

		MAIN.messages.push(item);
		if (MAIN.messages.length > CONF.history)
			MAIN.messages.shift();

		// To everybody in the room, the sender too
		$.send(item);
	});
}
