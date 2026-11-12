exports.install = function() {

	// Contacts
	ROUTE('+API    ?    -contacts                  --> Contacts|list');
	ROUTE('+API    ?    -contacts_read/{id}        --> Contacts|read');
	ROUTE('+API    ?    +contacts_create           --> Contacts|create');
	ROUTE('+API    ?    +contacts_update/{id}      --> Contacts|update');
	ROUTE('+API    ?    -contacts_remove/{id}      --> Contacts|remove');

};
