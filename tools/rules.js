// Prints the rules that apply to every change: the section of AGENTS.md, so that they cannot differ from it.
// A tooling script with plain Node.js.
//
//   node tools/rules.js           prints the rules
//   node tools/rules.js --hook    for the hook of a new session: prints them only when the folder of the session is a Total.js 5 project

var Fs = require('fs');
var Path = require('path');

var ROOT = Path.join(__dirname, '..');

function rules() {
	var text = Fs.readFileSync(Path.join(ROOT, 'AGENTS.md'), 'utf8').replace(/\r\n/g, '\n');
	var start = text.indexOf('## Rules that apply to every change');
	var end = text.indexOf('\n## ', start + 5);
	return text.substring(start, end === -1 ? text.length : end).trim();
}

// A project of Total.js 5 has total5 in the dependencies of its package.json; the folder of the session can be inside it
function istotaljs(directory) {
	for (var i = 0; i < 4 && directory; i++) {
		try {
			var pkg = JSON.parse(Fs.readFileSync(Path.join(directory, 'package.json'), 'utf8'));
			if ((pkg.dependencies && pkg.dependencies.total5) || (pkg.devDependencies && pkg.devDependencies.total5))
				return true;
		} catch (e) {}
		var parent = Path.dirname(directory);
		if (parent === directory)
			break;
		directory = parent;
	}
	return false;
}

exports.rules = rules;
exports.istotaljs = istotaljs;

if (require.main === module) {

	if (process.argv.indexOf('--hook') === -1) {
		console.log(rules());
		return;
	}

	// The hook receives the session as JSON in the standard input; its folder is `cwd`
	var input = '';
	process.stdin.on('data', function(chunk) {
		input += chunk;
	});
	process.stdin.on('end', function() {
		var cwd = process.cwd();
		try {
			cwd = JSON.parse(input).cwd || cwd;
		} catch (e) {}
		if (istotaljs(cwd))
			console.log('This is a Total.js 5 project. ' + rules() + '\n\nThe pages and the example applications are in the plugin: use the skill totaljs-write before writing code and totaljs-review to review it.');
	});
}
