# The application: questions and answers

## Which folders does a Total.js 5 application have?

The framework loads each folder by its name:

```
index.js            the official start script
config              settings, one "key : value" per line
package.json        "total5" is the dependency
controllers/        routes
definitions/        auth.js, init.js, func.js, db.js: loaded at start
actions/            actions (an older application has them in schemas/)
modules/            integrations with other systems
plugins/<name>/     a feature with its server part and its screen
views/              layout and pages
public/             static files for the browser
```

A small API needs only `index.js`, `config`, `package.json`, `controllers/`, `actions/` and `definitions/`.

## What goes in index.js?

The official start script of Total.js 5, whole and unchanged: `helpers/index.js` of the framework. Its heart is this, and the commented options of the official file stay in it:

```js
require('total5');

const options = {};

options.release = process.argv.includes('--release');
options.servicemode = process.argv.includes('--service') || process.argv.includes('--servicemode');

Total.run(options);
```

Do not write a shorter one by hand and do not restyle it: it is the one file that keeps its own style.

## How do I start a Total.js 5 application?

```
npm install
node index.js 8000
```

The number is the port. Add `--release` for release mode: `node index.js 8000 --release`.

## What does package.json need?

Only `total5`. The framework has the server, the routes, the templates, the database builder and the tests inside:

```json
{
	"name": "contacts",
	"version": "1.0.0",
	"private": true,
	"dependencies": {
		"total5": ">=0.0.20-2"
	}
}
```

## How is the config file written?

It is a plain file named `config`, without an extension, with one `key : value` per line. A line that starts with `//` is a comment:

```
name              : Contacts

// The requests of the API must send this value in the header "x-token"
token             : change-this-token
```

The code reads a value with `CONF.token`. It is not JSON and it is not a `.env` file.

## Where do I read a setting in the code?

In `CONF`, with the key of the file `config`:

```js
if (token === CONF.token)
	$.success(BOT);
```

The settings that belong to the framework start with `$`, as `$api`. Keys and addresses of databases stay out of the repository.

## Where do shared helper functions go?

In `definitions/func.js`, as functions of `FUNC`, named in lowercase without separators:

```js
// definitions/func.js
FUNC.refreshtags = async function() {
	REPO.tags = await DATA.find('tbl_tag').fields('id,search').promise();
};
```

Actions and controllers call `FUNC.refreshtags()`.

## Where do I keep state in memory?

In `MAIN`, the object of the application, filled in a file of `definitions/`:

```js
// definitions/db.js
MAIN.products = [
	{ id: 'bread', name: 'Sourdough bread', price: 4.5 }
];
```

`REPO` holds cached lookups that the interface also needs. Do not create new globals.

## Where does the work of the start go?

In `ON('ready', ...)` of `definitions/init.js`: it runs when the application is up.

```js
// definitions/init.js
ON('ready', function() {
	COMPONENTATOR('ui', 'exec,locale,input,form,validate', true);
});
```

## How do I name files and folders?

All lowercase, words separated by `-`, never `_`: `search-results.html`. Static files go by type in `public/`: `/img/`, `/js/`, `/css/`, `/fonts/`. One plugin per feature, named after it: `plugins/redirects`.

## What is a module and how do I use it?

A file of `modules/` is an integration with another system or a service of its own. The framework loads it and registers its exports in `MODS`, under the name of the file:

```js
var data = MODS.visitors.today();
```

Do not load an application module with `require(PATH.root('modules/...'))`. A name with a dash uses brackets: `MODS['knowledge-source']`.

## Should a new application use plugins?

It depends on the project. An application that will grow by features is made with plugins: each feature is a folder `plugins/<name>/` with its routes, its actions and its screen. A small service with one or two collections does not need them: `controllers/` and `actions/` are enough.

## Do I need Express or other packages?

No. Total.js 5 is not built on Express and does not use its middleware. Routes, actions, validation, templates, WebSocket, the database builder and the tests are in `total5`. The only other package a common application adds is the adapter of its database, as `querybuilderpg` for PostgreSQL.

## Which version of Total.js 5 do I install?

`"total5": ">=0.0.20-2"` in `package.json`: version 0.0.20 or later. Today it installs the beta of 0.0.20, which fixes several problems of 0.0.19, and the stable 0.0.20 when it is published. `npm view total5 dist-tags` says which versions they are today. Total.js 4 (`total4`) is the previous framework and its code is not the same.
