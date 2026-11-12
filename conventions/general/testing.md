# Native tests and development tools

Use the target project's test layout and runner. New Total.js test suites load the framework directly and use its test library:

```js
require('total5');
require('total5/test');

Test.push('Contract', function(next) {
	var value = '<strong>'.encode();
	Test.print('encodes HTML-like text', value === '&lt;strong&gt;' ? null : value);
	next();
});

Test.run();
```

`Test.print(label, error)` fails when error is truthy. A successful run must reach the final test count and exit with status 0. Verify that a deliberate failure exits nonzero; unexpected exceptions must not turn an incomplete run into a successful result. Do not catch an assertion's failure in the same block that is meant to catch an action rejection.

Load required dependencies normally (`require('total5')`, `require('total5/test')`, and the adapter where needed). Do not search machine-specific framework folders, silently replace a missing dependency, or skip mandatory tests because the framework is absent. Install the dependencies documented by the project.

After initialization use `Total.Fs`, `Total.Path`, `Total.Child` and the other exposed modules. For a Node module without a dedicated exported property, use `REQUIRE('vm')`, for example. Bootstrap and third-party package imports remain valid. A plain Node tool that deliberately does not initialize Total.js retains its Node imports; do not convert unrelated tooling just to change its style.

## Configuration and samples

Use one `config` or `config.json` for the settings the suite actually needs. A standalone suite can load a plain config explicitly:

```js
LOADCONFIG(Total.Fs.readFileSync(Total.Path.join(__dirname, 'config'), 'utf8'));
```

This does not load the consuming application's config, authentication or modules. Do not duplicate the same settings in config, config-test and config-example files. Test-only settings are not part of the copied action's runtime contract. Keep credentials out of commits and read suite settings through `CONF`, not custom environment lookups in actions.

Keep small setup/sample data in test.js when that is the project pattern. A fixtures directory is optional for substantial external samples, not a required abstraction. A shared runner is appropriate when it removes duplicated setup; do not reorganize an existing suite or move its per-action test inventory without a concrete reason.

## Database integration

Tests may use PostgreSQL and the same native `DATA` adapter as the application. These are database integration checks; they are not credential-free pure unit tests. Configure the adapter once on the default connection when the action uses that connection. Do not add a database-name option to every action just to make it testable.

Use a clean, disposable database dedicated to tests. Before any destructive setup, verify the actual database with `current_database()` and reject an unexpected target. Warn next to the test connection setting if tables will be dropped/recreated or their contents overwritten. Do not use the application's database or silently create/migrate its production schema. Keep setup portable; do not depend on a particular desktop PostgreSQL distribution.

Document dependencies, setup, the command, covered behaviors and any skipped integration groups. Distinguish native/database results from real-provider or browser verification. Remote-provider calls should be mocked or served locally for unit tests; explicitly selected integration tests may use real sources. A failed requested download is a failed check, not a reason to silently use another source.

## Browser and visual checks

Playwright can control its installed Chromium or an installed Chrome. Chromium is a portable default (`npx playwright install chromium`); selecting Chrome is optional and is not application configuration. Match the UI library used by the consuming application.

Verify behavior, two independent instances, repeated updates and desktop/mobile layout. Generate a screenshot of the final artifact and open it to assess appearance. A screenshot file's existence or passing DOM assertions does not establish visual quality. Keep isolated widget/component smoke tests distinct from testing the full editor/application and its published output.

## References

- [Framework 5 test.js](https://github.com/totaljs/framework5/blob/7d2d553fc774090081b4e3b1ae75a52ef06b42b8/test.js): Test.push, Test.print and Test.run.
- [Framework 5 global.js](https://github.com/totaljs/framework5/blob/7d2d553fc774090081b4e3b1ae75a52ef06b42b8/global.js): REQUIRE and framework globals.
- [CMS widget kit test.js](https://github.com/totaljs-es/cms-widgets/blob/63892ff/test.js), [config](https://github.com/totaljs-es/cms-widgets/blob/63892ff/tests/config), [browser tool](https://github.com/totaljs-es/cms-widgets/blob/63892ff/tools/browser.js): native runner, pinned sources and browser checks.
