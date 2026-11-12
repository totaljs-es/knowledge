exports.install = function() {

	// Sites
	ROUTE('+API    ?    -sites                  --> Sites|list');
	ROUTE('+API    ?    +sites_create           --> Sites|create');
	ROUTE('+API    ?    -sites_remove/{id}      --> Sites|remove');
	ROUTE('+API    ?    -sites_check            --> Sites|check');

};
