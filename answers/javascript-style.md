---
question: Which JavaScript style does Total.js 5 code use?
question_es: ¿Qué estilo de JavaScript usa el código de Total.js 5?
---

# Which JavaScript style does Total.js 5 code use?

ES5 first, and the functions of the framework before any other.

```js
// good
var item = items.findItem('id', id);
var text = 'Hello {0}'.format(name);

// avoid
const item = items.find(m => m.id === id);
const text = `Hello ${name}`;
```

- `var` and `function`; no arrow functions and no template literals. `const` or `let` only where the code needs it, as a constant at the top of a file.
- `async` / `await` where the code waits for the database: `await DATA.find(...).promise($)`.
- The prototypes of Total.js before your own helper: `findItem`, `format`, `parseJSON`, `slug`, `isEmail`.
- No `require()` of a module of Node.js in the application: `Total.Fs`, `Total.Path`, `Total.Crypto`, `Total.Os`.
- Tabs, semicolons, `'` for short texts, file names in lowercase with `-`.
- `index.js` is the one exception: it is the official start script and keeps its own style.

The page: [JavaScript style](../conventions/general/javascript-style.md).
