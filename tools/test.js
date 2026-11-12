// Runs the tests of every application of this repository, one after another: node tools/test.js
// A tooling script with plain Node.js: it starts each test.js in its own process.

var Child = require('child_process');
var Fs = require('fs');
var Path = require('path');

var root = Path.join(__dirname, '..', 'apps');
var apps = Fs.readdirSync(root).filter(function(name) {
	return Fs.existsSync(Path.join(root, name, 'test.js'));
});

var failed = [];

for (var i = 0; i < apps.length; i++) {
	console.log('\n=== apps/' + apps[i]);
	var result = Child.spawnSync(process.execPath, ['test.js'], { cwd: Path.join(root, apps[i]), stdio: 'inherit' });
	result.status && failed.push(apps[i]);
}

console.log('\nApplications: ' + apps.length + ', failed: ' + (failed.length ? failed.join(', ') : 'none'));
process.exit(failed.length ? 1 : 0);
