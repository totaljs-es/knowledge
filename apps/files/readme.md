# Files

An API to upload files and download them with Total.js 5. The files are kept in the file storage of the framework, so the application needs nothing else to run.

**The request it answers:** "Create an API where I can upload files and get an address to download each one."

**The shape:** an application without plugins. The files go to `FILESTORAGE`, which is made for them: it keeps each file with its name, size and type under an id. Records go through `DATA` (see `apps/contacts`); files do not go in a database.

| File | What it has |
|---|---|
| `index.js` | Starts the framework |
| `config` | The name of the application and the token |
| `package.json` | `total5` is the only dependency |
| `controllers/api.js` | The routes: the API, the upload and the download |
| `schemas/files.js` | The actions: `Files|list`, `Files|upload`, `Files|remove` |
| `definitions/auth.js` | Who the request is: the token of the header `x-token` |
| `test.js` | The tests: they start the application, upload a real file, download it and remove it |

## The three kinds of route

```js
ROUTE('+API    ?           -files_remove/{id}     --> Files|remove');
ROUTE('+POST   /upload/    @upload <5MB           --> Files|upload');
ROUTE('FILE /download/*.*', download);
```

- The upload is a `POST` with `@upload` (a multipart form) and the biggest size it accepts, `<5MB`. A bigger request is answered with 431.
- The download is a `FILE` route: it has no `+`, so everybody who has the address of a file can read it. The id of a file cannot be guessed.

## Store, read and remove a file

```js
// The uploaded files are in $.files. Each one goes to the storage "files" with a new id
var meta = await $.files[i].fs('files', UID());
// meta: { id, name, size, ext, type, date }

// The list of the stored files
var items = await FILESTORAGE('files').browse().promise($);

// The file as the answer of a request, with its content type
FILESTORAGE('files').http($, { id: id, download: true });

// Remove it
FILESTORAGE('files').remove(id, function(err) { /* err when it does not exist */ });
```

The storage is the folder `databases/fs-files` of the application.

## Run it

```
npm install
node index.js 8000
```

```
curl -H "x-token: change-this-token" -F "file=@photo.jpg" http://127.0.0.1:8000/upload/
```

| Request | Answer |
|---|---|
| `POST /upload/` with one or more files | the stored files, each with its `url` |
| `POST /api/` with `{ "schema": "files" }` | the stored files |
| `POST /api/` with `{ "schema": "files_remove/{id}" }` | `{ success: true, value: id }`, or 404 |
| `GET /download/{id}.{ext}` | the file; with `?download=1` the browser saves it with its name |

The upload, the list and the removal need the header `x-token`. An upload without a file is answered with 400.

## Test it

```
node test.js
```
