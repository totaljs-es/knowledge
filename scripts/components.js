'use strict';

// Brings the published jComponent components and the names of Total Icons into these pages, so that a model looks for what exists before it
// writes a piece of interface by hand. The readme of every component is copied without changes; the catalogue and the list of icons are made
// from them. This is a tooling script that runs with plain Node.js: it is not part of a Total.js application.
//
//   node scripts/components.js <checkout of totaljs/components> <checkout of jComponent>
//
// Then run `npm run llms`.

var Fs = require('fs');
var Path = require('path');
var Child = require('child_process');

var ROOT = Path.join(__dirname, '..');
var components = process.argv[2];
var library = process.argv[3];

if (!components || !library) {
	console.error('node scripts/components.js <checkout of totaljs/components> <checkout of jComponent>');
	process.exit(1);
}

function revision(directory) {
	return Child.execFileSync('git', ['-C', directory, 'rev-parse', '--short=8', 'HEAD'], { encoding: 'utf8' }).trim();
}

// The fields of the header of a readme: name, description...
function header(text) {
	var match = text.match(/^---\n([\s\S]*?)\n---/);
	var obj = {};
	if (match) {
		match[1].split('\n').forEach(function(line) {
			var index = line.indexOf(':');
			if (index !== -1)
				obj[line.substring(0, index).trim()] = line.substring(index + 1).trim();
		});
	}
	return obj;
}

exports.header = header;

var source = Path.join(components, 'components');
var target = Path.join(ROOT, 'reference/components');
var names = Fs.readdirSync(source).filter(function(name) {
	return Fs.existsSync(Path.join(source, name, 'readme.md'));
}).sort(function(a, b) {
	return a.toLowerCase().localeCompare(b.toLowerCase());
});

Fs.rmSync(target, { recursive: true, force: true });
Fs.mkdirSync(target, { recursive: true });

var rows = [];

names.forEach(function(name) {
	var text = Fs.readFileSync(Path.join(source, name, 'readme.md'), 'utf8');
	var meta = header(text);
	Fs.writeFileSync(Path.join(target, name + '.md'), text);
	rows.push('| [`' + name + '`](' + name + '.md) | ' + (meta.name || name) + ' | ' + (meta.description || '').replace(/\|/g, '\\|') + ' |');
});

Fs.copyFileSync(Path.join(components, 'LICENSE'), Path.join(target, 'LICENSE'));

var lines = [
	'# jComponent 20: the published components',
	'',
	'The ' + names.length + ' components of the catalogue of Total.js, each with what it does. Look here before you write a piece of interface by hand: when a component does what the screen needs, use it and do not write another one.',
	'',
	'- Source: <https://github.com/totaljs/components> (`components/<name>/readme.md`), revision `' + revision(components) + '`. The page of each component is its readme, copied without changes.',
	'- License: MIT, Copyright (c) Peter Širka. The notice is in [LICENSE](LICENSE).',
	'- Update them with `node scripts/components.js`; do not edit them here.',
	'- A live preview of each one is in <https://componentator.com>.',
	'',
	'## How to use one',
	'',
	'The first column is the name for `COMPONENTATOR()` and for `<ui-component>`:',
	'',
	'```js',
	'// definitions/init.js',
	'ON(\'ready\', function() {',
	'	COMPONENTATOR(\'ui\', \'exec,input,validate,datagrid\', true);',
	'});',
	'```',
	'',
	'```html',
	'<ui-component name="input" path="?.name" config="required:1">@(Name)</ui-component>',
	'```',
	'',
	'The page of the component has its configuration, its methods and an example.',
	'',
	'## The components',
	'',
	'| Name | Title | What it does |',
	'|---|---|---|'
].concat(rows);

Fs.writeFileSync(Path.join(target, 'readme.md'), lines.join('\n') + '\n');

// Total Icons: the names come from the style sheet of the library, which is what draws them
var found = {};

(Fs.readFileSync(Path.join(library, 'spa.min@20.css'), 'utf8').match(/\.ti-[a-z0-9-]+:before/g) || []).forEach(function(rule) {
	found[rule.substring(4, rule.length - 7)] = 1;
});

// A few second names of an icon in the style sheet are not names to teach: they are left out
var LEFTOUT = ['kokot', 'pica', 'shit', 'test', 'vacation1'];

var icons = Object.keys(found).filter(function(name) {
	return LEFTOUT.indexOf(name) === -1;
}).sort();

var groups = {};

icons.forEach(function(name) {
	var letter = name[0];
	if (!groups[letter])
		groups[letter] = [];
	groups[letter].push(name);
});

var page = [
	'# Total Icons: the names',
	'',
	'The ' + icons.length + ' names of Total Icons, the icon font that the jComponent library loads. Use one of these names; a name that is not here draws nothing.',
	'',
	'- Source: <https://github.com/totaljs/jComponent> (`spa.min@20.css`), revision `' + revision(library) + '`. License: MIT, Copyright (c) Peter Širka.',
	'- Update the list with `node scripts/components.js`; do not edit it here.',
	'',
	'## How to use an icon',
	'',
	'The classes `ti` and `ti-` with the name:',
	'',
	'```html',
	'<i class="ti ti-check-circle"></i>',
	'<button class="exec" data-exec="?/create"><i class="ti ti-plus-circle"></i>@(Create)</button>',
	'```',
	'',
	'In the metadata of a plugin the icon is written with both classes. In the configuration of a component the name alone is enough (`icon:home`): the component adds `ti ti-` to a value without a space.',
	'',
	'```js',
	'exports.icon = \'ti ti-check-circle\';',
	'```',
	'',
	'## The names',
	''
];

Object.keys(groups).sort().forEach(function(letter) {
	page.push('- **' + letter + '**: ' + groups[letter].join(', '));
});

Fs.writeFileSync(Path.join(ROOT, 'reference/icons.md'), page.join('\n') + '\n');
console.log(names.length + ' components and ' + icons.length + ' icons written');
