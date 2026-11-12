# Gotchas of the server

Things that behave differently from what you would guess. Each one is a rule.

## Answers

- In an **action**, `$.callback(data)` returns data. In a plain **route handler** (`function($)`), `$.callback(err, value)` takes the error first: answer with `$.json(data)` instead.
- `$.invalid(404)`: a number above 399 sets the HTTP status (an omitted error becomes 401 in `ErrorBuilder.push`; use an explicit code for clarity). `$.invalid('@(text)')` answers with the message; its second argument is the `path` of the field the error belongs to, not a status code.
- On a handler you can also set the status yourself: `$.response.status = 401; $.json(...)`.

## Request data

- Route parameters (`{id}`) are in `$.params`.
- In a controller, `$.body` is parsed and `$.payload` holds the buffered raw body for the supported body-parsing path. In an action, `$.payload` / `model` is the action input, not that raw HTTP buffer. For webhook signatures use the controller context and verify the route flags/content type preserve the bytes you sign.
- `$.ip` is the first `X-Forwarded-For` value: forgeable. Use `$.req.socket.remoteAddress` for security limits.
- When changing CSRF handling, check `Controller.prototype.csrf` and view directive support; verify token generation and validation together. Do not introduce an alternative transport solely because a past app needed one.
- Session checks depend on the app's authentication module. Inspect its cookie, token and user-agent checks before assuming a session is portable between clients.

## Schemas and input

- A `Boolean` that is absent is `false`. Use `partial: true` when absence must mean "unchanged".
- With `partial`, a `null` number is ignored; use `0` for "none".
- `*field:[String]` rejects an empty list; drop the `*` if empty is allowed.
- Never `for...in` over an array. Use a classic `for` loop.

## Served JavaScript and static files

- `node --check` does not validate the release minifier or browser execution. Check the served asset when changing regular expressions or template syntax. Diagnose a reproducible failure before disabling `$minifyjs`; do not make a global configuration change as a style fix.
- In release, static files are served from memory: restart the app after changing them. Browsers also cache: force a reload while testing.

## Data

- NoSQL: `NOSQL('x').find().where(...)`; `.sort(field, true)` is **descending**. Updates append a line and mark the old one, so the file grows until it is cleaned.
- NoSQL dates arrive on the server as `Date`, on the client as text.

## Tests

- `opt.config` passed to `Total.run` is overridden by `(env)` entries of the config: set `process.env` first.
- Before running a translation extractor, check its scan scope and keep generated/vendor directories out of the input. Verify the resulting `.resource` files.
