'use strict';

// The files for the models that read these pages: llms.txt (an index, in the format of https://llmstxt.org) and llms-full.txt
// (every page in one file). They are built from the pages of the repository, so they cannot differ from them, and a test checks it.
// This is a tooling script that runs with plain Node.js: it is not part of a Total.js application.
//
//   node scripts/llms.js            prints llms.txt
//   node scripts/llms.js --write    writes llms.txt and llms-full.txt

var Fs = require('fs');
var Path = require('path');

var ROOT = Path.join(__dirname, '..');
var BASE = 'https://raw.githubusercontent.com/totaljs-es/knowledge/main/';

var SUMMARY = 'Total.js 5 knowledge in one place: the conventions (ES5 first, Total.js prototypes and Tangular first, no imports from Node.js, pipe-separated action names, routes in controllers or in the plugin) and small complete applications, tested, that show them at work.';

var DETAILS = 'Read the general rules, then the pages of the zone you work in, and look at the application with the shape you need. Written for Total.js 5 (`total5` on npm) and jComponent 20.';

// Every page, in the order in which it is read: [section, file, title, what it says]
var PAGES = [
	['Start here', 'README.md', 'README', 'What is here: the conventions, the applications and the rules of both'],
	['Start here', 'AGENTS.md', 'AGENTS.md', 'For an agent: how to use these pages and the rules that apply to every change'],
	['General', 'conventions/general/workflow.md', 'Write and refactor workflow', 'Select a reference, preserve contracts, correct code and verify behaviour'],
	['General', 'conventions/general/native-patterns.md', 'Native patterns', 'Direct framework calls, existing helpers and execution context'],
	['General', 'conventions/general/project-structure.md', 'Project structure', 'Native runtime folders, private inputs, internal docs/examples, entry point and move checks'],
	['General', 'conventions/general/javascript-style.md', 'JavaScript style', 'ES5 over ES6, prototypes and Tangular first, no imports from Node.js, formatting and names'],
	['General', 'conventions/general/testing.md', 'Native tests and tools', 'Direct total5/test bootstrap, suite config, disposable databases and visual verification'],
	['Backend', 'conventions/backend/actions.md', 'Actions', 'NEWACTION: naming with a pipe, input and params, answers, permissions, DATA'],
	['Backend', 'conventions/backend/action-kits.md', 'Standalone actions with tests', 'Folder per action, contract, suite config, small samples, database integration, local-server tests and the checker'],
	['Backend', 'conventions/backend/routes-and-auth.md', 'Routes and authentication', 'ROUTE syntax for APIs, pages and uploads, and the single AUTH'],
	['Backend', 'conventions/backend/definitions-and-modules.md', 'Definitions and modules', 'auth, init, func and db, config, automatic MODS loading, lifecycle and standalone-tool boundaries'],
	['Backend', 'conventions/backend/storage-and-integrations.md', 'Storage and integrations', 'Existing persistence, RESTBuilder, configuration and lifecycle'],
	['Backend', 'conventions/backend/gotchas.md', 'Gotchas of the server', 'Behaviours that differ from what you would guess'],
	['Database', 'conventions/database/sql-scripts.md', 'SQL scripts', 'PostgreSQL files, names, columns, order of the columns, code lists'],
	['Database', 'conventions/database/queries.md', 'Queries with DATA', 'read, find, autoquery, insert, modify, remove, conditions, raw SQL'],
	['Frontend', 'conventions/frontend/components.md', 'Components', 'Use the existing jComponent components, preferred ones, exec, intranetcss, COMPONENTATOR()'],
	['Frontend', 'conventions/frontend/plugins-ui.md', 'Plugins with UI', 'Server part, screens, forms, PLUGIN() and tapi'],
	['Frontend', 'conventions/frontend/views-and-layout.md', 'Views and layout', 'The layout, directives, translations, public pages'],
	['Frontend', 'conventions/frontend/binding-and-forms.md', 'Binding and forms', 'Connected screen/importer/form flow, binding, translations and lifecycle'],
	['Frontend', 'conventions/frontend/cms-widgets.md', 'CMS widgets', 'Native single-file format, metadata, settings, scoped CSS, rendering and previews'],
	['Frontend', 'conventions/frontend/css.md', 'CSS', 'Formatting, CLASS scoping, predefined classes'],
	['Applications', 'apps/contacts/readme.md', 'Contacts: an API without plugins', 'Actions, routes in controllers, a token and the embedded NoSQL database'],
	['Applications', 'apps/website/readme.md', 'Website: views and a layout', 'Public pages rendered on the server, without plugins and without a database'],
	['Applications', 'apps/board/readme.md', 'Board: an application with plugins', 'Each feature with its routes, actions, screen and form, in jComponent 20']
];

exports.PAGES = PAGES;

exports.index = function() {

	var lines = ['# Total.js knowledge', '', '> ' + SUMMARY, '', DETAILS, ''];
	var section = null;

	for (var i = 0; i < PAGES.length; i++) {
		var page = PAGES[i];
		if (page[0] !== section) {
			section = page[0];
			lines.push('## ' + section, '');
		}
		lines.push('- [' + page[2] + '](' + BASE + page[1] + '): ' + page[3]);
	}

	lines.push('');
	return lines.join('\n');
};

exports.full = function() {

	var lines = ['# Total.js knowledge: every page', '', '> ' + SUMMARY, ''];

	for (var i = 0; i < PAGES.length; i++) {
		var page = PAGES[i];
		var text = Fs.readFileSync(Path.join(ROOT, page[1]), 'utf8').replace(/\r\n/g, '\n').trim();
		lines.push('---', '', 'Source: ' + BASE + page[1], '', text, '');
	}

	return lines.join('\n');
};

if (require.main === module) {
	if (process.argv.indexOf('--write') !== -1) {
		Fs.writeFileSync(Path.join(ROOT, 'llms.txt'), exports.index());
		Fs.writeFileSync(Path.join(ROOT, 'llms-full.txt'), exports.full());
		console.log('llms.txt and llms-full.txt written');
	} else
		process.stdout.write(exports.index());
}
