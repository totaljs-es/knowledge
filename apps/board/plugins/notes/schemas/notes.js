NEWACTION('Notes|list', {
	name: 'List of notes',
	action: async function($) {
		var items = await DATA.find('nosql/tbl_note').sort('dtcreated_desc').promise($);
		$.callback(items);
	}
});

NEWACTION('Notes|create', {
	name: 'Create a note',
	input: '*body:String',
	action: async function($, model) {
		model.id = UID();
		model.dtcreated = NOW;
		await DATA.insert('nosql/tbl_note', model).promise($);
		$.success(model.id);
	}
});

NEWACTION('Notes|remove', {
	name: 'Remove a note',
	params: '*id:UID',
	action: async function($) {
		await DATA.remove('nosql/tbl_note').id($.params.id).error(404).promise($);
		$.success($.params.id);
	}
});
