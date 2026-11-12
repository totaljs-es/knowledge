---
question: Is Total.js like Express? Which packages do I need?
question_es: ¿Total.js es como Express? ¿Qué paquetes necesito?
---

# Is Total.js like Express? Which packages do I need?

No. Total.js 5 is one package, `total5`, and it already has what an Express application adds with packages. An application does not install them and does not write `app.get()`.

| Instead of | Total.js 5 has |
|---|---|
| `express`, `app.get('/', ...)` | `ROUTE('GET /', fn)` in `controllers/` |
| `body-parser`, `joi` | `input` of `NEWACTION`: the body is parsed and checked |
| `dotenv`, `process.env` | the file `config` and `CONF` |
| `ejs`, `pug` | the views of `views/` with `@{...}` |
| `multer` | a route with `@upload` and `$.files` |
| `socket.io`, `ws` | `ROUTE('SOCKET /', fn)` |
| `node-cron`, `setInterval` | `CRON()` and `ON('service')` |
| `axios`, `node-fetch` | `RESTBuilder` |
| `uuid` | `UID()` |
| a database for a small application | the embedded NoSQL database through `DATA` |

The only other dependency of the applications of this repository is `querybuilderpg`, for PostgreSQL.
