NEWACTION('Tasks|list', {
	name: 'List of tasks',
	action: async function($) {
		var items = await DATA.find('tbl_task').sort('dtcreated_desc').promise($);
		$.callback(items);
	}
});

NEWACTION('Tasks|read', {
	name: 'Read a task',
	params: '*id:UID',
	action: async function($) {
		var item = await DATA.read('tbl_task').id($.params.id).error(404).promise($);
		$.callback(item);
	}
});

NEWACTION('Tasks|save', {
	name: 'Create or update a task',
	input: 'id:UID, *name:String, note:String',
	action: async function($, model) {

		if (model.id) {
			model.dtupdated = NOW;
			await DATA.modify('tbl_task', model).id(model.id).error(404).promise($);
		} else {
			model.id = UID();
			model.isdone = false;
			model.dtcreated = NOW;
			await DATA.insert('tbl_task', model).promise($);
		}

		$.success(model.id);
	}
});

NEWACTION('Tasks|done', {
	name: 'Mark a task as done, or as not done when it was',
	params: '*id:UID',
	action: async function($) {
		var item = await DATA.read('tbl_task').id($.params.id).error(404).promise($);
		await DATA.modify('tbl_task', { isdone: !item.isdone, dtupdated: NOW }).id(item.id).promise($);
		$.success(item.id);
	}
});

NEWACTION('Tasks|remove', {
	name: 'Remove a task',
	params: '*id:UID',
	action: async function($) {
		await DATA.remove('tbl_task').id($.params.id).error(404).promise($);
		$.success($.params.id);
	}
});
