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
	['Frontend', 'conventions/frontend/tangular.md', 'Tangular templates', 'Values and encoding, conditions, loops, the helpers and your own helper; every example run'],
	['Frontend', 'conventions/frontend/binding-and-forms.md', 'Binding and forms', 'Connected screen/importer/form flow, binding, translations and lifecycle'],
	['Frontend', 'conventions/frontend/cms-widgets.md', 'CMS widgets', 'Native single-file format, metadata, settings, scoped CSS, rendering and previews'],
	['Frontend', 'conventions/frontend/css.md', 'CSS', 'Formatting, CLASS scoping, predefined classes'],
	['jComponent', 'reference/jcomponent/readme.md', 'jComponent 20: the official guides', 'Where these guides come from and what each one is'],
	['jComponent', 'reference/jcomponent/aicontext/ui-component.md', 'Use a component: ui-component', 'name, path, config, default and the special keys'],
	['jComponent', 'reference/jcomponent/aicontext/ui-bind.md', 'Bind data: ui-bind', 'Text, HTML, templates, classes and visibility from a path'],
	['jComponent', 'reference/jcomponent/aicontext/ui-plugin.md', 'A screen with its scope: ui-plugin', 'ui-plugin and PLUGIN(), the ? of paths and methods'],
	['jComponent', 'reference/jcomponent/aicontext/ui-import.md', 'Load a part when needed: ui-import', 'Dynamic content of the interface'],
	['jComponent', 'reference/jcomponent/api.md', 'The API of the library', 'The methods of the library and what a component can implement'],
	['jComponent', 'reference/jcomponent/aicontext/component-development.md', 'Write a component', 'From a description to a component: contract, hooks, data flow, verification'],
	['Reference', 'reference/total5-0.0.20.md', 'What Total.js 5 0.0.20 adds', 'MCP tools from actions, the cache of an action, the types JSON and IP, $.content, the environment of an action, total5 test and fakes; each one tried with the beta'],
	['Answers', 'answers/new-application.md', 'How do I start a new Total.js 5 application?', 'A short answer with its code and the application that shows it'],
	['Answers', 'answers/routes-and-actions.md', 'Where do the routes and the logic of an API go?', 'A short answer with its code and the application that shows it'],
	['Answers', 'answers/plugins-or-not.md', 'Should my application use plugins?', 'A short answer with its code and the application that shows it'],
	['Answers', 'answers/which-storage.md', 'Where do I keep the data of a Total.js 5 application?', 'A short answer with its code and the application that shows it'],
	['Answers', 'answers/move-to-postgresql.md', 'How do I move an application from the embedded database to PostgreSQL?', 'A short answer with its code and the application that shows it'],
	['Answers', 'answers/protect-an-api.md', 'How do I protect an API with a token?', 'A short answer with its code and the application that shows it'],
	['Answers', 'answers/upload-files.md', 'How do I upload and download files?', 'A short answer with its code and the application that shows it'],
	['Answers', 'answers/websocket.md', 'How do I use a WebSocket?', 'A short answer with its code and the application that shows it'],
	['Answers', 'answers/scheduled-work.md', 'How do I run something on a schedule?', 'A short answer with its code and the application that shows it'],
	['Answers', 'answers/pages.md', 'How do I make a page with a layout?', 'A short answer with its code and the application that shows it'],
	['Answers', 'answers/test-an-application.md', 'How do I test a Total.js 5 application?', 'A short answer with its code and the application that shows it'],
	['Answers', 'answers/javascript-style.md', 'Which JavaScript style does Total.js 5 code use?', 'A short answer with its code and the application that shows it'],
	['Answers', 'answers/not-express.md', 'Is Total.js like Express? Which packages do I need?', 'A short answer with its code and the application that shows it'],
	['Answers', 'answers/versions.md', 'Which version of Total.js 5 should I use, and what does the beta add?', 'A short answer with its code and the application that shows it'],
	['Questions', 'questions/application.md', 'The application: questions and answers', 'Folders, the start script, config, helpers, state, modules, plugins or not, packages and versions'],
	['Questions', 'questions/actions.md', 'Actions: questions and answers', 'NEWACTION: names, input, params, query, answers, errors, permissions and calls between actions'],
	['Questions', 'questions/routes.md', 'Routes and authentication: questions and answers', 'API routes, pages, AUTH, a token, BLOCKED, body limits and 404'],
	['Questions', 'questions/data.md', 'Data with DATA: questions and answers', 'The embedded database with the prefix nosql/, read and write, filters, autoquery, PostgreSQL and raw SQL'],
	['Questions', 'questions/storage.md', 'Storage and files: questions and answers', 'Which storage, MEMORIZE, NOSQL, uploads and FILESTORAGE'],
	['Questions', 'questions/services.md', 'Scheduled work, HTTP calls and WebSocket: questions and answers', 'ON(service), CRON, RESTBuilder, SOCKET routes and errors without a request'],
	['Questions', 'questions/views.md', 'Views and pages: questions and answers', '$.view, the layout, loops and conditions, the title, translations and static files'],
	['Questions', 'questions/tangular.md', 'Tangular templates: questions and answers', 'Values, raw, conditions, loops, helpers and templates in a ui-bind'],
	['Questions', 'questions/interface.md', 'The interface with jComponent 20: questions and answers', 'Plugins, screens, tapi, exec, CLASS, components, COMPONENTATOR, forms and CSS'],
	['Questions', 'questions/sql.md', 'SQL scripts for PostgreSQL: questions and answers', 'database.sql, names of tables and columns, types, code lists and the order of a script'],
	['Questions', 'questions/style-and-tests.md', 'Style, tests and versions: questions and answers', 'ES5 first, Total.Fs, format, tests, what 0.0.20 adds and what to do when not sure'],
	['Questions', 'questions/server.md', 'Mail, translations, redirects, CORS, encryption, cache and threads: questions and answers', 'MAIL and HTMLMAIL, resources and LOCALIZE, $.redirect, the route #404, CORS, the request limit, ENCRYPT and DECRYPT, CACHE and NEWTHREAD'],
	['Questions in Spanish', 'questions/es/application.md', 'La aplicación: preguntas y respuestas', 'The same questions and answers in Spanish, with the same code'],
	['Questions in Spanish', 'questions/es/actions.md', 'Acciones: preguntas y respuestas', 'The same questions and answers in Spanish, with the same code'],
	['Questions in Spanish', 'questions/es/routes.md', 'Rutas y autenticación: preguntas y respuestas', 'The same questions and answers in Spanish, with the same code'],
	['Questions in Spanish', 'questions/es/data.md', 'Datos con DATA: preguntas y respuestas', 'The same questions and answers in Spanish, with the same code'],
	['Questions in Spanish', 'questions/es/storage.md', 'Almacenamiento y archivos: preguntas y respuestas', 'The same questions and answers in Spanish, with the same code'],
	['Questions in Spanish', 'questions/es/services.md', 'Trabajo programado, llamadas HTTP y WebSocket: preguntas y respuestas', 'The same questions and answers in Spanish, with the same code'],
	['Questions in Spanish', 'questions/es/views.md', 'Vistas y páginas: preguntas y respuestas', 'The same questions and answers in Spanish, with the same code'],
	['Questions in Spanish', 'questions/es/tangular.md', 'Plantillas Tangular: preguntas y respuestas', 'The same questions and answers in Spanish, with the same code'],
	['Questions in Spanish', 'questions/es/interface.md', 'La interfaz con jComponent 20: preguntas y respuestas', 'The same questions and answers in Spanish, with the same code'],
	['Questions in Spanish', 'questions/es/sql.md', 'Scripts SQL para PostgreSQL: preguntas y respuestas', 'The same questions and answers in Spanish, with the same code'],
	['Questions in Spanish', 'questions/es/style-and-tests.md', 'Estilo, pruebas y versiones: preguntas y respuestas', 'The same questions and answers in Spanish, with the same code'],
	['Questions in Spanish', 'questions/es/server.md', 'Correo, traducciones, redirecciones, CORS, cifrado, caché e hilos: preguntas y respuestas', 'The same questions and answers in Spanish, with the same code'],
	['Questions in Slovak', 'questions/sk/application.md', 'Aplikácia: otázky a odpovede', 'The same questions and answers in Slovak, with the same code; a draft until a native speaker reviews it'],
	['Questions in Slovak', 'questions/sk/actions.md', 'Akcie: otázky a odpovede', 'The same questions and answers in Slovak, with the same code; a draft until a native speaker reviews it'],
	['Questions in Slovak', 'questions/sk/routes.md', 'Routy a autentifikácia: otázky a odpovede', 'The same questions and answers in Slovak, with the same code; a draft until a native speaker reviews it'],
	['Questions in Slovak', 'questions/sk/data.md', 'Údaje cez DATA: otázky a odpovede', 'The same questions and answers in Slovak, with the same code; a draft until a native speaker reviews it'],
	['Questions in Slovak', 'questions/sk/storage.md', 'Úložisko a súbory: otázky a odpovede', 'The same questions and answers in Slovak, with the same code; a draft until a native speaker reviews it'],
	['Questions in Slovak', 'questions/sk/services.md', 'Plánovaná práca, HTTP volania a WebSocket: otázky a odpovede', 'The same questions and answers in Slovak, with the same code; a draft until a native speaker reviews it'],
	['Questions in Slovak', 'questions/sk/views.md', 'Pohľady a stránky: otázky a odpovede', 'The same questions and answers in Slovak, with the same code; a draft until a native speaker reviews it'],
	['Questions in Slovak', 'questions/sk/tangular.md', 'Šablóny Tangular: otázky a odpovede', 'The same questions and answers in Slovak, with the same code; a draft until a native speaker reviews it'],
	['Questions in Slovak', 'questions/sk/interface.md', 'Rozhranie s jComponent 20: otázky a odpovede', 'The same questions and answers in Slovak, with the same code; a draft until a native speaker reviews it'],
	['Questions in Slovak', 'questions/sk/sql.md', 'SQL skripty pre PostgreSQL: otázky a odpovede', 'The same questions and answers in Slovak, with the same code; a draft until a native speaker reviews it'],
	['Questions in Slovak', 'questions/sk/style-and-tests.md', 'Štýl, testy a verzie: otázky a odpovede', 'The same questions and answers in Slovak, with the same code; a draft until a native speaker reviews it'],
	['Questions in Slovak', 'questions/sk/server.md', 'E-mail, preklady, presmerovania, CORS, šifrovanie, cache a vlákna: otázky a odpovede', 'The same questions and answers in Slovak, with the same code; a draft until a native speaker reviews it'],
	['Applications', 'apps/contacts/readme.md', 'Contacts: an API without plugins', 'Actions, routes in controllers, a token and DATA on the embedded NoSQL database'],
	['Applications', 'apps/contacts-postgresql/readme.md', 'Contacts on PostgreSQL', 'The same queries with DATA on PostgreSQL: the definition of the database and the table names without the prefix nosql/'],
	['Applications', 'apps/files/readme.md', 'Files: upload and download', 'A multipart upload with a size limit, FILESTORAGE, a FILE route for the download and the removal'],
	['Applications', 'apps/monitor/readme.md', 'Monitor: work on a schedule', 'ON(service) and CRON, a request to another server with RESTBuilder, and a small state kept with MEMORIZE'],
	['Applications', 'apps/website/readme.md', 'Website: views and a layout', 'Public pages rendered on the server, without plugins and without a database'],
	['Applications', 'apps/chat/readme.md', 'Chat: a room over a WebSocket', 'A SOCKET route with its open, close and message events, and the websocket component in the browser'],
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

// Words that say nothing about the subject of a page
var STOP = ('the and for with how does can what which where when who should use from into that this are not its you your one way put get make write there about without than them they have has was all any some other more each every between both only also same after before under over').split(' ').reduce(function(map, word) {
	map[word] = 1;
	return map;
}, {});

// knowledge.json: for every page, the API names it uses (ROUTE, CRON, UID) and the words of its headings. A program that searches these pages finds
// with them the page that answers a request although its title says something else. A name or a word that is in more than a third of the pages
// says nothing about one of them and is left out.
exports.meta = function() {

	var documents = [];
	var frequency = {};

	function count(list) {
		list.forEach(function(name) {
			frequency[name] = (frequency[name] || 0) + 1;
		});
	}

	for (var i = 0; i < PAGES.length; i++) {

		var page = PAGES[i];
		var text = Fs.readFileSync(Path.join(ROOT, page[1]), 'utf8').replace(/\r\n/g, '\n');
		var symbols = {};
		var tags = {};

		// API names: a global in capitals that is called, or written as code
		(text.match(/\b[A-Z][A-Z0-9_]{2,}(?=\()|`[A-Z][A-Z0-9_]{2,}`/g) || []).forEach(function(name) {
			symbols[name.replace(/`/g, '').toLowerCase()] = 1;
		});

		((page[2] + '\n' + (text.match(/^#{1,3} .+$/gm) || []).join('\n')).toLowerCase().match(/[a-z][a-z0-9]{2,}/g) || []).forEach(function(word) {
			if (STOP[word])
				return;
			tags[word] = 1;
			// The singular of a plural, so that "files" and "file" find the same page
			if (word.length > 4 && /[^su]s$/.test(word))
				tags[word.substring(0, word.length - 1)] = 1;
		});

		var doc = { file: page[1], symbols: Object.keys(symbols).sort(), tags: Object.keys(tags).sort() };
		count(doc.symbols);
		count(doc.tags);
		documents.push(doc);
	}

	var max = Math.ceil(PAGES.length / 3);

	documents.forEach(function(doc) {
		doc.symbols = doc.symbols.filter(function(name) {
			return frequency[name] <= max;
		});
		doc.tags = doc.tags.filter(function(name) {
			return frequency[name] <= max && doc.symbols.indexOf(name) === -1;
		});
	});

	return JSON.stringify({ documents: documents }, null, '\t') + '\n';
};

if (require.main === module) {
	if (process.argv.indexOf('--write') !== -1) {
		Fs.writeFileSync(Path.join(ROOT, 'llms.txt'), exports.index());
		Fs.writeFileSync(Path.join(ROOT, 'llms-full.txt'), exports.full());
		Fs.writeFileSync(Path.join(ROOT, 'knowledge.json'), exports.meta());
		console.log('llms.txt, llms-full.txt and knowledge.json written');
	} else
		process.stdout.write(exports.index());
}
