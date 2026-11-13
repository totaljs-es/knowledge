---
question: How do I upload and download files?
question_es: ¿Cómo subo y descargo archivos?
---

# How do I upload and download files?

The upload is a `POST` route with `@upload` and a size limit; the files go to `FILESTORAGE`; the download is a `FILE` route.

```js
// controllers/api.js
ROUTE('+POST   /upload/    @upload <5MB    --> Files|upload');
ROUTE('FILE /download/*.*', download);

function download($) {
	var name = $.split[1];
	var opt = {};
	opt.id = name.substring(0, name.lastIndexOf('.'));
	opt.download = $.query.download === '1';
	FILESTORAGE('files').http($, opt);
}
```

```js
// actions/files.js
NEWACTION('Files|upload', {
	name: 'Upload files',
	action: async function($) {
		var response = [];
		for (var i = 0; i < $.files.length; i++) {
			var meta = await $.files[i].fs('files', UID());
			meta.url = '/download/{0}.{1}'.format(meta.id, meta.ext);
			response.push(meta);
		}
		$.callback(response);
	}
});
```

`meta` has `id`, `name`, `size`, `ext`, `type` and `date`. A request over the limit is answered with 431. `FILESTORAGE('files').browse()` lists the files and `.remove(id, callback)` removes one.

The complete application: [`apps/files`](../apps/files).
