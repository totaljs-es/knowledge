require('total5');
require('total5/test');

// The files for agents and models: AGENTS.md and the pointers to it, the skills, llms.txt and llms-full.txt, and the links of the pages.
// They are only useful if they are true, so they are tested. Run: node tests/kit.test.js

var llms = require('../scripts/llms');
var ROOT = Total.Path.join(__dirname, '..');
var SKIP = ['.git', '.claude', '.agents', '.github', '.claude-plugin', '.codex-plugin', 'node_modules', 'scripts', 'tests', 'skills', 'hooks', 'tools'];

function check(message, ok) {
	Test.print(message, ok ? null : 'failed');
}

function exists(file) {
	return Total.Fs.existsSync(Total.Path.join(ROOT, file));
}

function read(file) {
	return Total.Fs.readFileSync(Total.Path.join(ROOT, file), 'utf8').replace(/\r\n/g, '\n');
}

function pages(directory, found) {
	found = found || [];
	var entries = Total.Fs.readdirSync(Total.Path.join(ROOT, directory), { withFileTypes: true });
	for (var i = 0; i < entries.length; i++) {
		var entry = entries[i];
		var path = directory ? directory + '/' + entry.name : entry.name;
		if (entry.isDirectory()) {
			if (SKIP.indexOf(entry.name) === -1)
				pages(path, found);
		} else if (/\.md$/.test(entry.name))
			found.push(path);
	}
	return found;
}

Test.push('files for agents', function(next) {

	check('AGENTS.md exists', exists('AGENTS.md'));
	check('CLAUDE.md points to AGENTS.md', (/@AGENTS\.md/).test(read('CLAUDE.md')));
	check('GEMINI.md points to AGENTS.md', (/@AGENTS\.md/).test(read('GEMINI.md')));
	check('copilot instructions point to AGENTS.md', (/AGENTS\.md/).test(read('.github/copilot-instructions.md')));

	['.claude/skills', '.agents/skills'].forEach(function(base) {
		var folders = Total.Fs.readdirSync(Total.Path.join(ROOT, base));
		check(base + ' has skills', folders.length >= 2);
		folders.forEach(function(name) {
			var text = read(base + '/' + name + '/SKILL.md');
			check(base + '/' + name + ' has a name equal to its folder and a description', new RegExp('^---\\nname: ' + name + '\\ndescription: .{20,}\\n---\\n').test(text));
		});
	});

	['.claude/skills', '.agents/skills'].forEach(function(base) {
		Total.Fs.readdirSync(Total.Path.join(ROOT, base)).forEach(function(name) {
			var text = read(base + '/' + name + '/SKILL.md');
			check(base + '/' + name + ' points to the maintained skill', new RegExp('skills/' + name + '/SKILL\\.md').test(text) && exists('skills/' + name + '/SKILL.md'));
		});
	});

	// The plugin: manifest, the maintained skills and the hook that runs the check
	var plugin = JSON.parse(read('.claude-plugin/plugin.json'));
	var market = JSON.parse(read('.claude-plugin/marketplace.json'));
	var hooks = JSON.parse(read('hooks/hooks.json'));
	check('plugin has a name and a version', plugin.name && /^\d+\.\d+\.\d+$/.test(plugin.version));
	check('marketplace lists the plugin', market.plugins.length === 1 && market.plugins[0].name === plugin.name);
	check('hook runs tools/check.js after an edit', (/Edit/).test(hooks.hooks.PostToolUse[0].matcher) && (/tools\/check\.js/).test(hooks.hooks.PostToolUse[0].hooks[0].command) && exists('tools/check.js'));
	check('the hook of a new session says the rules in a Total.js project', (/tools\/rules\.js/).test(hooks.hooks.SessionStart[0].hooks[0].command) && exists('tools/rules.js'));

	// The same skills as a Codex plugin
	var codex = JSON.parse(read('.codex-plugin/plugin.json'));
	var codexmarket = JSON.parse(read('.agents/plugins/marketplace.json'));
	check('the Codex plugin has the name and the version of the Claude Code plugin and points to the skills', codex.name === plugin.name && codex.version === plugin.version && codex.skills === './skills/');
	check('the Codex marketplace lists the plugin of this repository', codexmarket.plugins.length === 1 && codexmarket.plugins[0].name === codex.name && codexmarket.plugins[0].source.path === './');

	Total.Fs.readdirSync(Total.Path.join(ROOT, 'skills')).forEach(function(name) {
		var text = read('skills/' + name + '/SKILL.md');
		check('skills/' + name + ' has a name equal to its folder and a description', new RegExp('^---\\nname: ' + name + '\\ndescription: .{20,}\\n---\\n').test(text));
	});

	next();
});

Test.push('llms.txt and llms-full.txt', function(next) {

	check('llms.txt matches the pages (run npm run llms)', read('llms.txt') === llms.index());
	check('llms-full.txt matches the pages (run npm run llms)', read('llms-full.txt') === llms.full());

	var listed = llms.PAGES.map(function(page) {
		return page[1];
	});

	pages('').forEach(function(file) {
		if (['llms.txt', 'llms-full.txt', 'CLAUDE.md', 'GEMINI.md'].indexOf(file) === -1)
			check(file + ' is listed in scripts/llms.js', listed.indexOf(file) !== -1);
	});

	listed.forEach(function(file) {
		check(file + ' exists', exists(file));
	});

	next();
});

Test.push('the answers', function(next) {

	var files = Total.Fs.readdirSync(Total.Path.join(ROOT, 'answers'));
	check('there are answers', files.length >= 10);

	files.forEach(function(name) {
		var file = 'answers/' + name;
		var text = read(file);
		var head = text.match(/^---\nquestion: (.{10,})\nquestion_es: (.{10,})\n---\n\n# (.+)\n/);
		check(file + ' has its question in English and in Spanish, and the title is the question', !!head && head[1] === head[3]);

		// The code of an answer follows the rules it teaches; a block that shows the bad form says "avoid"
		var blocks = (text.match(/```js\n[\s\S]*?```/g) || []).filter(function(block) {
			return block.indexOf('// avoid') === -1;
		});
		check(file + ' has no arrow function and no template literal in its code', blocks.every(function(block) {
			return !(/=>/).test(block) && !(/`[^`\n]*\$\{/).test(block.replace(/^```js\n|```$/g, ''));
		}));
		check(file + ' does not require a Node.js module in its code', blocks.every(function(block) {
			return !(/require\('(fs|path|crypto|os|http|https|zlib)'\)/).test(block);
		}));
		check(file + ' points to an application or a page of this repository', (/\]\(\.\.\/(apps|conventions|reference)\//).test(text) || name === 'not-express.md');
	});

	next();
});

Test.push('the pages', function(next) {

	var all = pages('').concat(['CLAUDE.md', 'GEMINI.md']);

	['.agents/skills', '.claude/skills', 'skills'].forEach(function(base) {
		Total.Fs.readdirSync(Total.Path.join(ROOT, base)).forEach(function(name) {
			all.push(base + '/' + name + '/SKILL.md');
		});
	});

	all.forEach(function(file) {
		var regex = /\]\(([^)#\s]+)(#[^)]*)?\)/g;
		var text = read(file);
		var match;
		while ((match = regex.exec(text))) {
			if (/^(https?:|mailto:)/.test(match[1]))
				continue;
			// The official guides are copies and are not edited: one of them mentions a page that its source does not have either
			if (file === 'reference/jcomponent/aicontext/component-development.md' && match[1] === 'jcomponent-components.md')
				continue;
			var target = Total.Path.normalize(Total.Path.join(Total.Path.dirname(Total.Path.join(ROOT, file)), match[1]));
			check(file + ' links to ' + match[1], Total.Fs.existsSync(target));
		}
	});

	// The pages that teach the rules may show the bad form, after "avoid" or "instead of": the rest must follow them.
	['conventions/backend/actions.md', 'conventions/backend/routes-and-auth.md', 'conventions/database/queries.md', 'conventions/frontend/plugins-ui.md'].forEach(function(file) {
		var blocks = read(file).match(/```js\n[\s\S]*?```/g) || [];
		blocks.forEach(function(block) {
			check(file + ' does not require a Node.js module in an example', !(/require\('(fs|path|crypto|os|http|https|zlib)'\)/).test(block));
			check(file + ' has no arrow function in an example', !(/=>/).test(block));
		});
	});

	next();
});

Test.run();
