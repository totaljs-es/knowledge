require('total5');
require('total5/test');

// tools/check.js: every rule must flag its bad form and accept its good form. Run: node tests/check.test.js

var checker = require('../tools/check');

function rules(text, type) {
	return checker.text(text, { file: 'x', type: type }).map(function(item) {
		return item.rule;
	});
}

function check(message, ok) {
	Test.print(message, ok ? null : 'failed');
}

Test.push('check: server code', function(next) {

	check('flags require of a Node.js module', rules("var fs = require('fs');", 'js').indexOf('node-require') !== -1);
	check('accepts Total.Fs', rules('var fs = Total.Fs;', 'js').length === 0);
	check('flags Total.OS', rules('Total.OS.cpus();', 'js').indexOf('total-case') !== -1);
	check('accepts Total.Os', rules('Total.Os.cpus();', 'js').length === 0);
	check('flags a slash in an action name', rules("NEWACTION('Tickets/list', {", 'js').indexOf('name-separator') !== -1);
	check('accepts a pipe in an action name', rules("NEWACTION('Tickets|list', {", 'js').length === 0);
	check('accepts a named schema', rules("NEWSCHEMA('@Group', '*name');", 'js').length === 0);
	check('flags a slash in the action of a route', rules("ROUTE('+API ? -tickets --> Tickets/list');", 'js').indexOf('route-target') !== -1);
	check('accepts a pipe in the action of a route', rules("ROUTE('+API ? -tickets --> Tickets|list');", 'js').length === 0);
	check('flags a message without translation', rules("$.invalid('Invalid file name');", 'js').indexOf('user-text') !== -1);
	check('accepts a translated message', rules("$.invalid('@(Invalid file name)');", 'js').length === 0);
	check('accepts a status and a single word', rules("$.invalid(404); $.invalid('token');", 'js').length === 0);
	check('ignores comments', rules("// require('fs')\n/*\nrequire('os')\n*/", 'js').length === 0);
	check('flags indentation with spaces once', rules('function a() {\n    return 1;\n    }', 'js').filter(function(rule) { return rule === 'spaces-indent'; }).length === 1);
	check('flags let and const inside a function as style', checker.text('function a() {\n\tlet b = 1;\n}', { file: 'x', type: 'js' })[0].severity === 'style');
	check('accepts const and let at the top of a file', rules('const A = 1;\nlet b = 2;', 'js').length === 0);
	next();
});

Test.push('check: interface files', function(next) {

	check('flags an inline handler', rules('<button onclick="save()">x</button>', 'html').indexOf('inline-handler') !== -1);
	check('accepts exec', rules('<button class="exec" data-exec="?/save">@(Save)</button>', 'html').length === 0);
	check('flags text without translation', rules('<button name="cancel">Cancel</button>', 'html').indexOf('plain-text') !== -1);
	check('accepts translated text', rules('<button name="cancel">@(Cancel)</button><h2>@(Redirects)</h2>', 'html').length === 0);
	check('flags a second HTTP client', rules('<script>fetch("/api/");</script>', 'html').indexOf('plain-http') !== -1);
	next();
});

Test.push('check: files', function(next) {

	var root = Total.Path.join(__dirname, 'fixtures', 'app');
	var write = Total.Path.join(root, 'schemas', 'tickets.js');
	var found = checker.file(write);
	var rule = found.map(function(item) {
		return item.rule;
	});

	check('finds the application root', checker.root(write) === root);
	check('checks a schema file', rule.indexOf('node-require') !== -1 && rule.indexOf('name-separator') !== -1);
	check('reports the syntax error of a file', checker.file(Total.Path.join(root, 'schemas', 'broken.js')).some(function(item) { return item.rule === 'syntax'; }));
	check('skips a client script in public', checker.file(Total.Path.join(root, 'public', 'app.js')).length === 0);
	check('skips files outside an application', checker.file(__filename).length === 0);

	var hook = checker.hook({ tool_input: { file_path: write, new_string: "var fs = require('fs');" } });
	check('hook asks for a correction with exit code 2', hook.code === 2 && (/node-require/).test(hook.message));
	check('hook is silent for text that follows the rules', checker.hook({ tool_input: { file_path: Total.Path.join(root, 'schemas', 'good.js'), content: Total.Fs.readFileSync(Total.Path.join(root, 'schemas', 'good.js'), 'utf8') } }).code === 0);
	check('hook is silent for a file that is not checked', checker.hook({ tool_input: { file_path: __filename, content: "require('fs')" } }).code === 0);
	next();
});

Test.run();
