NEWACTION('Notes|list', {
	name: 'List of notes',
	action: async function($) {
		var items = await NOSQL('notes').find().sort('dtcreated_desc').promise($);
		$.callback(items);
	}
});

NEWACTION('Notes|create', {
	name: 'Create a note',
	input: '*body:String',
	action: async function($, model) {
		model.id = UID();
		model.dtcreated = NOW;
		await NOSQL('notes').insert(model).promise($);
		$.success(model.id);
	}
});

NEWACTION('Notes|remove', {
	name: 'Remove a note',
	params: '*id:UID',
	action: async function($) {
		await NOSQL('notes').remove().where('id', $.params.id).error(404).promise($);
		$.success($.params.id);
	}
});
