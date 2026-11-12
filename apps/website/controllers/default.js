exports.install = function() {
	ROUTE('GET /', home);
	ROUTE('GET /products/', products);
	ROUTE('GET /products/{id}/', product);
};

function home($) {
	$.view('index');
}

function products($) {
	$.view('products', MAIN.products);
}

function product($) {

	var item = MAIN.products.findItem('id', $.params.id);

	// The page 404 of the framework, as for an address without a route
	if (!item) {
		$.fallback(404);
		return;
	}

	$.view('product', item);
}
