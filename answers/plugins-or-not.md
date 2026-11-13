---
question: Should my application use plugins?
question_es: ¿Debe mi aplicación usar plugins?
---

# Should my application use plugins?

Use plugins when the application has screens to manage data and will grow by features: each feature is a folder in `plugins/` with its routes, its actions, its screen and its form, and adding one does not touch the rest.

Do not use plugins for a small API with one or two collections, or for a website with a few pages: `controllers/`, `actions/` and `views/` are enough.

| The application | Shape | Example |
|---|---|---|
| A small API | No plugins: `controllers/` and `actions/` | [`apps/contacts`](../apps/contacts) |
| Public pages | No plugins: `controllers/` and `views/` | [`apps/website`](../apps/website) |
| Screens to manage data, more features later | Plugins | [`apps/board`](../apps/board) |

```
plugins/tasks/
	index.js              the name, the icon, the position in the menu and the routes
	actions/tasks.js      the actions
	public/index.html     the screen
	public/form.html      the form
```
