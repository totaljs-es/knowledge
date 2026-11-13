---
name: totaljs-write
description: Use when you write or change Total.js 5 code (an action, a route, a plugin, a SQL script, a component, a view) so it follows the conventions of real Total.js apps.
---

# Write Total.js 5 code

Start from the nearest working feature of the project you edit: read its route, action and screen together, and write the new one the same way. The pages: [workflow](../../conventions/general/workflow.md), [actions](../../conventions/backend/actions.md), [routes](../../conventions/backend/routes-and-auth.md), [queries](../../conventions/database/queries.md), [plugins with UI](../../conventions/frontend/plugins-ui.md), [binding and forms](../../conventions/frontend/binding-and-forms.md).

## Server

- File zones: actions in `actions/` (or `actions/`), routes in `controllers/` or the plugin `index.js`, shared helpers in `FUNC`, shared state in `MAIN`, loaded modules through `MODS`.
- Action name: `Collection|verb` with a pipe (`Tickets|list`). Declare `name`, `input` / `params` / `query`, `permissions` or `user`, then `action`. Keep the route style of the app: `ROUTE('+API ? -tickets_read/{id} --> Tickets|read')` or `route:` in the action.
- Validate ownership and business rules inside the action: the declared input does not do it.
- Answer once: `$.callback(data)`, `$.success(id)`, `$.invalid(404)`, `$.invalid('@(Text)')`. In `async` actions pass `$` to `.promise($)`.
- Storage as the app has it: `DATA` for SQL, `FILESTORAGE`, `MEMORIZE`. Ids are `UID()`, dates are `NOW`. Outgoing HTTP is `RESTBuilder`.
- ES5 in new code, tabs, semicolons, `'{0}'.format()`, Total.js prototypes first. Application code never does `require()` of Node.js modules: `Total.Fs`, `Total.Path`, `Total.Crypto`, `Total.Os`.
- Every text for people is `@(Text)`, in English.

## Interface

- Plugin = folder with `index.js` (`exports.icon`, `name`, `permissions`, `visible`, `install`) and `public/index.html` + `public/form.html`.
- A screen is `<ui-plugin class="CLASS">` plus `PLUGIN(function(exports) { ... })`; the form is loaded with `<ui-component name="importer">`. Call the server with `exports.tapi('endpoint ERROR', data, callback)`; buttons use the class `exec` with `data-exec="?/name"`.
- Use an existing jComponent component of the loaded major version; load catalogue components with `COMPONENTATOR()`. Scope CSS with `CLASS`.

## Check what you wrote

```bash
node ${CLAUDE_SKILL_DIR}/../../tools/check.js path/to/changed/files
```

It reports defects (`error`), rules with legacy exceptions (`warn`) and preferences for new code (`style`). A plugin install also runs it after each edit. Then run `node --check`, start the app and call the changed route. Report the reference you followed, the checks that ran and what you could not verify.

For a standalone action follow [action kits](../../conventions/backend/action-kits.md); for tests, [testing](../../conventions/general/testing.md); for CMS widgets, [CMS widgets](../../conventions/frontend/cms-widgets.md).
