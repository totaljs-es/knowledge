---
question: How do I test a Total.js 5 application?
question_es: ¿Cómo pruebo una aplicación Total.js 5?
---

# How do I test a Total.js 5 application?

With the test library of the framework, in a `test.js` that starts the application and calls it as a client does.

```js
require('total5');
require('total5/test');

Test.push('contacts', async function(next) {
	// call() is a function of the test that sends the request to the application, as the api() of apps/contacts/test.js
	var response = await call('contacts_create', { name: 'Anna' });
	Test.print('create answers with the id', response.success === true ? null : 'failed');
	next();
});

Test.run();
```

`Test.print(message, error)` fails when the second argument is not empty. Run it with `node test.js`.

What the tests of this repository do, and why:

- They copy the application to a disposable folder and start it there with `node index.js <port>`, so the data of the application is never touched.
- They wait until the application answers before the first check: the server answers before its routes are loaded.
- They check the errors too: without the token, with a wrong field, with an id that does not exist.
- A test that needs a database server uses one only for tests, and says `SKIPPED` when it is not there.

Every application of [`apps/`](../apps) has a `test.js` to copy from. The page: [testing](../conventions/general/testing.md).
