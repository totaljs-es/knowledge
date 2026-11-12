NEWACTION('Contacts|list', {
	name: 'List of contacts',
	query: 'search:String',
	action: async function($) {
		var builder = DATA.find('tbl_contact');
		$.query.search && builder.search('name', $.query.search);
		builder.sort('name');
		var items = await builder.promise($);
		$.callback(items);
	}
});

NEWACTION('Contacts|read', {
	name: 'Read a contact',
	params: '*id:UID',
	action: async function($) {
		var item = await DATA.read('tbl_contact').id($.params.id).error(404).promise($);
		$.callback(item);
	}
});

NEWACTION('Contacts|create', {
	name: 'Create a contact',
	input: '*name:String, email:Email, phone:Phone',
	action: async function($, model) {
		model.id = UID();
		model.dtcreated = NOW;
		await DATA.insert('tbl_contact', model).promise($);
		$.success(model.id);
	}
});

NEWACTION('Contacts|update', {
	name: 'Update a contact',
	params: '*id:UID',
	input: '*name:String, email:Email, phone:Phone',
	action: async function($, model) {
		model.dtupdated = NOW;
		await DATA.modify('tbl_contact', model).id($.params.id).error(404).promise($);
		$.success($.params.id);
	}
});

NEWACTION('Contacts|remove', {
	name: 'Remove a contact',
	params: '*id:UID',
	action: async function($) {
		await DATA.remove('tbl_contact').id($.params.id).error(404).promise($);
		$.success($.params.id);
	}
});
