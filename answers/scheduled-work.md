---
question: How do I run something on a schedule?
question_es: ¿Cómo ejecuto algo de forma programada?
---

# How do I run something on a schedule?

In a file of `definitions/`. `ON('service')` is for "every N minutes" and `CRON` for a time of the day or of the week.

```js
// definitions/jobs.js

// The framework emits "service" every minute, with the number of minutes since the start
ON('service', function(counter) {
	if (counter % 5 === 0)
		ACTION('Sites|check').callback(ERROR('Sites|check'));
});

// Every day at midnight: minute hour day month weekday
CRON('0 0 * * *', function() {
	// ...
});
```

Put the work in an action and let the schedule only call it: the API can call it too, and it can be tested without waiting.

Write the minutes of a `CRON` as a list (`0,15,30,45 * * * *`). The step form (`*/15 * * * *`) runs every minute in Total.js 5 0.0.19; it works as a step from 0.0.20.

Do not use `setInterval` or a package for schedules. The complete application: [`apps/monitor`](../apps/monitor).
