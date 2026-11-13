NEWACTION('Files|list', {
	name: 'List of files',
	action: async function($) {
		var items = await FILESTORAGE('files').browse().promise($);
		for (var i = 0; i < items.length; i++)
			items[i].url = '/download/{0}.{1}'.format(items[i].id, items[i].ext);
		$.callback(items);
	}
});

NEWACTION('Files|upload', {
	name: 'Upload files',
	action: async function($) {

		if (!$.files.length) {
			$.invalid('@(No file was sent)');
			return;
		}

		var response = [];

		// Each file goes to the file storage of the application (the folder databases/fs-files) with a new id
		for (var i = 0; i < $.files.length; i++) {
			var meta = await $.files[i].fs('files', UID());
			meta.url = '/download/{0}.{1}'.format(meta.id, meta.ext);
			response.push(meta);
		}

		$.callback(response);
	}
});

NEWACTION('Files|remove', {
	name: 'Remove a file',
	params: '*id:UID',
	action: function($) {
		FILESTORAGE('files').remove($.params.id, function(err) {
			if (err)
				$.invalid(404);
			else
				$.success($.params.id);
		});
	}
});
