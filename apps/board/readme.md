# Board

A board of tasks and notes with Total.js 5, made with plugins. Each feature is a plugin with its routes, its actions, its screen and its form, and the application shows them in a menu.

**The request it answers:** "Create an application to keep my tasks and my notes, where I can add more sections later."

**The shape:** an application with plugins. It fits an application with screens to manage data that will grow by features: a new feature is a new folder in `plugins/`, and nothing else changes. A small API or a website with a few pages does not need plugins.

| File | What it has |
|---|---|
| `index.js` | Starts the framework |
| `config` | The name of the application; it listens only on this computer |
| `controllers/default.js` | The route of the page: it gives the layout the plugins that the user can see |
| `definitions/auth.js` | Who the request is: one local user |
| `definitions/init.js` | The components of the interface that the layout loads |
| `views/index.html` | The layout: the menu, a `page` for the screen of each plugin and an `importer` for its form |
| `public/css/default.css` | The styles of the layout |
| `plugins/tasks/`, `plugins/notes/` | The two features |
| `test.js` | The tests: they start the application and call the API of both plugins |

## A plugin

```
plugins/tasks/
	index.js              the name, the icon, the position in the menu and the routes
	schemas/tasks.js      the actions
	public/index.html     the screen
	public/form.html      the form that opens over the screen
```

The routes of a plugin are in its `index.js`, not in `controllers/`:

```js
exports.icon = 'ti ti-check-circle';
exports.name = '@(Tasks)';
exports.position = 1;

exports.install = function() {
	ROUTE('+API    ?    -tasks                   --> Tasks|list');
	ROUTE('+API    ?    +tasks_save              --> Tasks|save');
};
```

The files of `public/` are served under `/_tasks/`. The screen is a `<ui-plugin>` with one `PLUGIN(function(exports) { ... })`: `?.items` is the data of the plugin, `?/create` is `exports.create`, and `exports.tapi('tasks ERROR', callback)` calls the API and shows the error to the user.

The form is a `miniform` that the layout loads with an `importer`. The screen opens it with a model, and the form refreshes the screen after it saves:

```js
// the screen
exports.create = function() {
	SET('formtasks @default', {});
	SET('common.form', 'formtasks');
};

// the form
exports.submit = function(hide) {
	var model = exports.model;
	exports.tapi('tasks_save ERROR', { id: model.id, name: model.name, note: model.note }, function() {
		hide();
		PLUGINS.tasks.refresh();
	});
};
```

## Add a feature

Copy `plugins/notes` to a new folder, change its name, icon and position in `index.js`, and write its actions, screen and form. The layout finds it by itself.

## It has no sign in

One person uses it on their own computer: `$ip : 127.0.0.1` in the config and one user in `definitions/auth.js`. Before other people reach it, write a real check in `AUTH`, as the token of `apps/contacts`.

## Run it

```
npm install
node index.js 8000
```

Open `http://127.0.0.1:8000`. The first start downloads the components of the interface from `cdn.componentator.com`.

## Test it

```
node test.js
```

The tests call the API. The screens were checked in a browser: create, edit, mark as done and remove a task, and create a note.
