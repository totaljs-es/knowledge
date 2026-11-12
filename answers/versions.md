---
question: Which version of Total.js 5 should I use, and what does the beta add?
question_es: ¿Qué versión de Total.js 5 debo usar y qué añade la beta?
---

# Which version of Total.js 5 should I use, and what does the beta add?

Use `"total5": "latest"` in `package.json`: it is the stable version. When this was written the stable version was `0.0.19` and the beta was `0.0.20`; `npm view total5 dist-tags` says which they are today.

Total.js 5 is the current framework. Total.js 4 (`total4`) is the previous one and its code is not the same: do not mix them.

What 0.0.20 adds is in [reference](../reference/total5-0.0.20.md): actions as MCP tools, the cache of an action, the field types `JSON` and `IP`, `$.content()`, `total5 test` and fakes for tests. Use one of those only in a project that depends on `total5@beta` or on 0.0.20 and later, and say which version it needs.

When you are not sure that a function exists in the version of the project, say so and check it in the source of the framework instead of guessing.
