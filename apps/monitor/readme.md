# Monitor

An application that checks websites on a schedule with Total.js 5 and says which ones are down. It remembers the websites and the result of their last check in a small object that the framework keeps in a file.

**The request it answers:** "Create an application that checks every few minutes that my websites answer."

**The shape:** an application without plugins. Its work starts by itself, on a schedule, and not with a request. Its state is small and has no queries: a few websites and their last check. That is what `MEMORIZE` is made for; records that grow and are searched go through `DATA` (see `apps/contacts`).

| File | What it has |
|---|---|
| `index.js` | Starts the framework |
| `config` | The name, the token, every how many minutes the websites are checked and how long one has to answer |
| `package.json` | `total5` is the only dependency |
| `controllers/api.js` | The routes of the API |
| `schemas/sites.js` | The actions: `Sites|list`, `Sites|create`, `Sites|remove`, `Sites|check` |
| `definitions/init.js` | The state of the application: `MAIN.monitor = MEMORIZE('monitor', 1000)` |
| `definitions/jobs.js` | The schedule: the check and the reset of the counts at midnight |
| `definitions/auth.js` | Who the request is: the token of the header `x-token` |
| `test.js` | The tests: they start the application and a small server that plays the websites |

## Work on a schedule

```js
// The framework emits "service" every minute, with the number of minutes since the start
ON('service', function(counter) {
	if (counter % CONF.interval === 0)
		ACTION('Sites|check').callback(ERROR('Sites|check'));
});

// Every day at midnight
CRON('0 0 * * *', function() {
	// ...
});
```

- The work itself is an action, `Sites|check`. The schedule only calls it, and the API can call it too (`sites_check`): the same code runs at its time and when someone asks, and it can be tested without waiting.
- `ON('service')` is for "every N minutes". `CRON` is for a time of the day or of the week: `minute hour day month weekday`.
- In Total.js 5 0.0.19 the step form of `CRON` (`*/5 * * * *`) runs every minute, not every five: it is fixed in 0.0.20. With the stable version write the list (`0,15,30,45 * * * *`) or use `ON('service')`.
- No `setInterval` and no package for schedules.

## A request to another server

```js
RESTBuilder.GET(site.url).timeout(CONF.timeout).exec(function(err, response, output) {
	site.status = output && output.status ? output.status : 0;
});
```

`output.status` is the status of the answer. A website that does not answer in time gives 408, and an address where nothing listens gives 0.

## A small state that is kept by itself

```js
MAIN.monitor = MEMORIZE('monitor', 1000);

if (!MAIN.monitor.sites)
	MAIN.monitor.sites = [];
```

`MEMORIZE('monitor')` is an object that is read from `databases/memorize_monitor.json` when the application starts. After a change, `MAIN.monitor.save()` writes it (here one second later; ten seconds without the second argument), and `MAIN.monitor.set(key, value)` changes a key and saves. A test checks that the websites are still there after a restart.

## Run it

```
npm install
node index.js 8000
```

| Schema of `POST /api/` | Data | Answer |
|---|---|---|
| `sites` | | the websites with their last check: `status`, `ms`, `isdown`, `checks`, `failures`, `dtchecked` |
| `sites_create` | `name`, `url` (both required) | `{ success: true, value: id }` |
| `sites_remove/{id}` | | `{ success: true, value: id }`, or 404 |
| `sites_check` | | checks every website now and answers with the list |

Every request needs the header `x-token`.

## Test it

```
node test.js
```

The tests call `sites_check` and do not wait for the schedule. The schedule was checked by hand: with `interval : 1` a website had its first check 60 seconds after the start.
