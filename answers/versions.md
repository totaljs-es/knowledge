---
question: Which version of Total.js 5 should I use?
question_es: ¿Qué versión de Total.js 5 debo usar?
---

# Which version of Total.js 5 should I use?

Total.js 5 up to 0.0.20-4: use this version or a later one, always.

```json
"dependencies": {
	"total5": ">=0.0.20-4"
}
```

Every application of this repository uses it, for example [`apps/contacts`](../apps/contacts).

Total.js 5 is the current framework. Total.js 4 (`total4`) is the previous one and its code is not the same: do not mix them.

When you are not sure that a function exists, say so and check it in the source of the framework instead of guessing.
