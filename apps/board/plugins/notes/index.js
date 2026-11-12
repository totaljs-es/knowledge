exports.icon = 'ti ti-file-alt';
exports.name = '@(Notes)';
exports.position = 2;
exports.visible = function() {
	return true;
};

exports.install = function() {
	ROUTE('+API    ?    -notes                   --> Notes|list');
	ROUTE('+API    ?    +notes_create            --> Notes|create');
	ROUTE('+API    ?    -notes_remove/{id}       --> Notes|remove');
};
