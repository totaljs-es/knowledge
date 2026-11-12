require('total5');

var options = {};
options.release = process.argv.indexOf('--release') !== -1;
options.servicemode = process.argv.indexOf('--service') !== -1 || process.argv.indexOf('--servicemode') !== -1;

F.run(options);
