exports.install = function() {

	// Files
	ROUTE('+API    ?           -files                 --> Files|list');
	ROUTE('+API    ?           -files_remove/{id}     --> Files|remove');
	ROUTE('+POST   /upload/    @upload <5MB           --> Files|upload');

	// A file by its id and its extension, for everybody who has its address
	ROUTE('FILE /download/*.*', download);

};

function download($) {

	var name = $.split[1];
	var opt = {};

	opt.id = name.substring(0, name.lastIndexOf('.'));
	opt.download = $.query.download === '1';

	FILESTORAGE('files').http($, opt);
}
