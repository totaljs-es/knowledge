---
question: How do I start a new Total.js 5 application?
question_es: ¿Cómo empiezo una aplicación nueva con Total.js 5?
---

# How do I start a new Total.js 5 application?

A Total.js 5 application is a folder with three files and the folders it needs:

```
index.js        the official start script, whole and unchanged
config          the settings, one "key : value" per line
package.json    "total5" is the dependency
controllers/    the routes
actions/        the actions
definitions/    what runs at the start: AUTH, schedules, shared state
views/          the pages, when it has pages
public/         the static files
```

```json
{
	"name": "myapp",
	"version": "1.0.0",
	"main": "index.js",
	"dependencies": {
		"total5": ">=0.0.20-4"
	},
	"scripts": {
		"start": "node index.js 8000"
	}
}
```

```text
name              : My application
```

`index.js` is always the official start script of the framework: copy it from [project structure](../conventions/general/project-structure.md), do not write a shorter one. Then `npm install` and `node index.js 8000`.

The settings are in the file `config`, not in `config.json` and not in environment variables. The smallest complete examples are [`apps/website`](../apps/website) (pages) and [`apps/contacts`](../apps/contacts) (an API).
