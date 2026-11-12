// The websites and the result of their last check: a small object that the framework keeps in a file by itself.
// It is saved one second after a change.
MAIN.monitor = MEMORIZE('monitor', 1000);

if (!MAIN.monitor.sites)
	MAIN.monitor.sites = [];
