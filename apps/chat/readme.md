# Chat

A chat room with Total.js 5: the people who are in it and their messages travel over one WebSocket. The page is rendered on the server and uses jComponent 20 for the socket and the list of messages.

**The request it answers:** "Create a chat room where everybody sees the messages at once."

**The shape:** an application without plugins. A WebSocket is the way for the server to tell the browser something without being asked; a page that only asks and gets an answer does not need one (see `apps/website`).

| File | What it has |
|---|---|
| `index.js` | Starts the framework |
| `config` | The name of the application and how many messages the room remembers |
| `package.json` | `total5` is the only dependency |
| `controllers/default.js` | The route of the page and the route of the socket, with its function |
| `definitions/init.js` | The messages of the room in `MAIN.messages`, and the components of the interface |
| `views/layout.html`, `join.html`, `chat.html` | The layout, the page that asks for the name and the room |
| `public/css/default.css` | The styles |
| `test.js` | The tests: they start the application and talk in the room with real WebSocket clients |

## The socket on the server

A WebSocket is a route with the method `SOCKET`. Its function receives the socket of the route, `$`, once; the events receive each connection, `client`.

```js
ROUTE('SOCKET /chat/', socket);

function socket($) {

	$.on('open', function(client) {
		client.name = client.query.name;
		client.send({ TYPE: 'history', items: MAIN.messages });   // to this connection
		$.send({ TYPE: 'users', items: users() });                 // to everybody
	});

	$.on('close', function(client) {
		$.send({ TYPE: 'users', items: users() });
	});

	$.on('message', function(client, message) {
		// message is the object that the browser sent
		$.send({ TYPE: 'message', name: client.name, text: message.text, date: new Date() });
	});
}
```

- Messages are objects, sent and received as JSON. Each one has a `TYPE` so that the other side knows what it is.
- `$.connections` has the open connections; when `close` runs, the one that closed is not there any more.
- `client.query` is the query of the address the browser connected to (`/chat/?name=Anna`).
- `client.close(4001)` closes a connection. Here a connection without a name is closed half a second after it opens, when it is completely open.
- What the browser sends is never trusted: the type is checked, the text is trimmed and cut, and the name is the one of the connection, not one that comes in the message.

## The socket in the browser

The component `websocket` connects, connects again when the connection is lost, and gives every message as an event:

```html
<ui-component name="websocket" config="url:/chat/?name=@{encodeURIComponent(model.name)}"></ui-component>
```

```js
ON('message', function(msg) {
	if (msg.TYPE === 'message')
		PUSH('chat.items', msg);
});

SETTER('websocket/send', { TYPE: 'message', text: text });
```

The list is a `ui-bind` with a Tangular template on `chat.items`: adding a message to the model draws it.

## What it does not keep

The messages are in memory (`MAIN.messages`, the last 50): a restart of the application starts an empty room. A room that must keep its messages stores them through `DATA`, as `apps/contacts` stores its contacts.

## Run it

```
npm install
node index.js 8000
```

Open `http://127.0.0.1:8000` in two windows with two names. The first start downloads the components of the interface from `cdn.componentator.com`.

## Test it

```
node test.js
```

The tests talk to the socket. The page was checked in a browser: come in with a name, send a message with Enter and receive the message of another person.
