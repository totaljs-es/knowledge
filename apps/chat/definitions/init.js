// The last messages of the room, kept in memory: a restart of the application starts an empty room
MAIN.messages = [];

// The components of the interface, downloaded once as one file: the layout loads it with @{REPO.ui}
ON('ready', function() {
	COMPONENTATOR('ui', 'exec,errorhandler,websocket,input,enter', true);
});
