# Instructions for GitHub Copilot

The full instructions of this repository are in `AGENTS.md`. The ones that matter most when you write Total.js 5 code:

- ES5 first: `var`, `function`, classic loops, `'{0}'.format()` instead of template literals. `const` or `let` only at the top of a file, when the code needs it.
- `index.js` is the official start script of Total.js 5, whole and unchanged.
- Use the Total.js prototypes (`findItem`, `parseJSON`, `slug`...) in the backend and Tangular in the frontend before any other function.
- Do not `require()` Node.js modules: use `Total.Fs`, `Total.Path`, `Total.Crypto`...
- Actions are named `Collection|verb`; routes live in `controllers/` or the plugin's `index.js`. Settings are in the file `config`.
