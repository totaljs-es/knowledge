NEWACTION('Tasks|list', {
	name: 'List of tasks',
	action: async function($) {
		var items = await NOSQL('tasks').find().sort('dtcreated_desc').promise($);
		$.callback(items);
	}
});

NEWACTION('Tasks|read', {
	name: 'Read a task',
	params: '*id:UID',
	action: async function($) {
		var item = await NOSQL('tasks').read().where('id', $.params.id).error(404).promise($);
		$.callback(item);
	}
});

NEWACTION('Tasks|save', {
	name: 'Create or update a task',
	input: 'id:UID, *name:String, note:String',
	action: async function($, model) {

		if (model.id) {
			model.dtupdated = NOW;
			await NOSQL('tasks').modify(model).where('id', model.id).error(404).promise($);
		} else {
			model.id = UID();
			model.done = false;
			model.dtcreated = NOW;
			await NOSQL('tasks').insert(model).promise($);
		}

		$.success(model.id);
	}
});

NEWACTION('Tasks|done', {
	name: 'Mark a task as done, or as not done when it was',
	params: '*id:UID',
	action: async function($) {
		var item = await NOSQL('tasks').read().where('id', $.params.id).error(404).promise($);
		await NOSQL('tasks').modify({ done: !item.done, dtupdated: NOW }).where('id', item.id).promise($);
		$.success(item.id);
	}
});

NEWACTION('Tasks|remove', {
	name: 'Remove a task',
	params: '*id:UID',
	action: async function($) {
		await NOSQL('tasks').remove().where('id', $.params.id).error(404).promise($);
		$.success($.params.id);
	}
});
