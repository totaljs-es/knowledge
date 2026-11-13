---
question: Which version of Total.js 5 should I use, and what does the beta add?
question_es: ¿Qué versión de Total.js 5 debo usar y qué añade la beta?
---

# Which version of Total.js 5 should I use, and what does the beta add?

Use `"total5": ">=0.0.20-4"` in `package.json`: version 0.0.20 or later. The stable version on npm is still `0.0.19`, and 0.0.20 is its beta: it fixes several problems of 0.0.19 (the step of `CRON`, `LOGMAIL` with an object, `@{csrf}` in a view) and adds new things. That line installs the beta now and the stable 0.0.20 when it is published, with no change, and it never installs 0.0.19. `npm view total5 dist-tags` says which versions they are today.

Total.js 5 is the current framework. Total.js 4 (`total4`) is the previous one and its code is not the same: do not mix them.

What 0.0.20 adds is in [reference](../reference/total5-0.0.20.md): actions as MCP tools, the cache of an action, the field types `JSON` and `IP`, `$.content()`, `total5 test` and fakes for tests. A project with `"total5": "latest"` may still have 0.0.19: check its version before using one of those there, and say which version it needs.

When you are not sure that a function exists in the version of the project, say so and check it in the source of the framework instead of guessing.
