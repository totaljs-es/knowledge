# Accounts

An application with sign in: users, sessions with a cookie, and notes that belong to each user. The data goes through `DATA` on the embedded NoSQL database, so it needs nothing else to run.

**The request it answers:** "Create an application where people sign in with their email and password, and each one sees only their own notes. An administrator creates the users."

**The shape:** an application without plugins, with two pages rendered by the server: the page to sign in, for a request without a session, and the application, for a request with one. The pattern of the session is the one of the applications of Total.js (the object given to `AUTH`, `authcookie` to sign in and `logout` to sign out).

| File | What it has |
|---|---|
| `index.js` | Starts the framework |
| `config` | The secret of the passwords, the cookie of the session and the email of the first user |
| `definitions/auth.js` | Who the request is: the session of the cookie, and the user that it loads |
| `definitions/init.js` | The components of the interface, and the first user when there is none |
| `controllers/default.js` | The two pages: `+GET /` with a session, `-GET /*` without one |
| `controllers/api.js` | The routes of the API: `-` for the sign in, `+` for the rest |
| `actions/account.js` | `Account|login`, `Account|logout`, `Account|read`, `Account|password` |
| `actions/notes.js` | `Notes|list`, `Notes|save`, `Notes|remove`: every query has the id of the user of the session |
| `actions/users.js` | `Users|list`, `Users|create`, `Users|remove`: only for an administrator, and the action checks it |
| `views/login.html`, `views/index.html` | The page to sign in and the application, with jComponent 20 |
| `test.js` | The tests: two browsers, each with its own cookie |

## Run it

```
npm install
node index.js 8000
```

Open <http://127.0.0.1:8000/> and sign in with `admin@example.com` and the password `admin`. Change `auth_secret` in `config` before the first start, and the password after the first sign in.

## What to take from it

- **The route says whether there is a session, the action says who may do it.** `+` in a route means a signed-in user and `-` means none: the sign in is `-API`, so a request with a session does not reach it. That a user is an administrator, or that a note is theirs, is checked in the action.
- **A note of another user does not exist.** `Notes|save` and `Notes|remove` add `.where('userid', $.user.id)` to the query, so the answer for the note of someone else is 404, the same as for a note that is not there. The id that comes in the request is never enough.
- **The password is never kept and never leaves.** It is stored as `password.sha256(CONF.auth_secret)`, the list of users asks for its fields without it, and `$.user` is made in `onread` with only what the application needs.
- **The same answer for a wrong email and a wrong password**, and `BLOCKED($, 10, '10 minutes')` stops a client that keeps trying.
- **A session is a row and a cookie.** `Account|login` inserts the row of the session and calls `MAIN.session.authcookie($, session.id, user.id, expire)`; `Account|logout` removes that row (`$.sessionid`) and calls `MAIN.session.logout($)`. Signing out of one device leaves the others signed in.
- **The page without a session is at every address** (`-GET /*`), so a link to any part of the application leads to the sign in and not to an error.

## Test it

```
node test.js
```

The tests copy the application to a disposable folder and start it there. They check that the API and the pages refuse a request without a session, the sign in with a wrong and a right password, that a user who is not an administrator cannot manage users, that each user sees, changes and removes only their own notes, the change of password and the sign out.
