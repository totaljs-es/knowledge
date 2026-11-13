// The notes of a user. Every query has the id of the user of the session: a note of another user does not exist for this one.
NEWACTION('Notes|list', {
	name: 'The notes of the user',
	action: async function($) {
		var items = await DATA.find('nosql/tbl_note').where('userid', $.user.id).sort('dtcreated_desc').promise($);
		$.callback(items);
	}
});

NEWACTION('Notes|save', {
	name: 'Create or update a note of the user',
	input: 'id:UID, *body:String',
	action: async function($, model) {

		if (model.id) {
			model.dtupdated = NOW;
			await DATA.modify('nosql/tbl_note', model).id(model.id).where('userid', $.user.id).error(404).promise($);
		} else {
			model.id = UID();
			model.userid = $.user.id;
			model.dtcreated = NOW;
			await DATA.insert('nosql/tbl_note', model).promise($);
		}

		$.success(model.id);
	}
});

NEWACTION('Notes|remove', {
	name: 'Remove a note of the user',
	params: '*id:UID',
	action: async function($) {
		await DATA.remove('nosql/tbl_note').id($.params.id).where('userid', $.user.id).error(404).promise($);
		$.success($.params.id);
	}
});
