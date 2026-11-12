# jComponent 20: the published components

The 348 components of the catalogue of Total.js, each with what it does. Look here before you write a piece of interface by hand: when a component does what the screen needs, use it and do not write another one.

- Source: <https://github.com/totaljs/components> (`components/<name>/readme.md`), revision `f3ac05f7`. The page of each component is its readme, copied without changes.
- License: MIT, Copyright (c) Peter Širka. The notice is in [LICENSE](LICENSE).
- Update them with `node scripts/components.js`; do not edit them here.
- A live preview of each one is in <https://componentator.com>.

## How to use one

The first column is the name for `COMPONENTATOR()` and for `<ui-component>`:

```js
// definitions/init.js
ON('ready', function() {
	COMPONENTATOR('ui', 'exec,input,validate,datagrid', true);
});
```

```html
<ui-component name="input" path="?.name" config="required:1">@(Name)</ui-component>
```

The page of the component has its configuration, its methods and an example.

## The components

| Name | Title | What it does |
|---|---|---|
| [`ajaxloading`](ajaxloading.md) | AjaxLoading | This component can show a loading text for async AJAX operations. |
| [`animation`](animation.md) | Animation | This component can animate elements with .animation class. |
| [`approve`](approve.md) | Approve | Singleton modal confirmation dialog with approve and cancel buttons that runs a callback when the user approves |
| [`aselected`](aselected.md) | ASelected | Adds a selected class to links whose href matches the current browser address, intended for public websites |
| [`attachments`](attachments.md) | Attachments | The component displays attachments in the simple list. |
| [`audio`](audio.md) | Audio | Singleton audio player that plays and stops MP3 sounds from a URL, with a volume control |
| [`autocomplete`](autocomplete.md) | AutoComplete | Shows search suggestions under an input or contenteditable field from a search function and passes the chosen value to a callback |
| [`autodarkmode`](autodarkmode.md) | AutoDarkMode | The component automatically applies dark mode according to the operation system. |
| [`autoexec`](autoexec.md) | AutoExec | This component automatically executes a method defined in exec option. |
| [`autofill`](autofill.md) | AutoFill | Wraps all nested elements in a form element with form events disabled |
| [`autoselect`](autoselect.md) | AutoSelect | The component automatically adds .selected class according to the selector class="autoselect" within the entire HTML document. |
| [`avatar`](avatar.md) | Avatar | Avatar component needs to register your own theme. |
| [`backtotop`](backtotop.md) | BackToTop | Singleton button that appears when the page is scrolled down and scrolls the page back to the top |
| [`backup`](backup.md) | Backup | The component for data saving data to and loading from the local storage of the browser. |
| [`banners`](banners.md) | Banners | Responsive banner rotator that cycles through slides at a set interval, with navigation icons |
| [`barchart`](barchart.md) | BarChart | Please review an example and keep a data-source. |
| [`box`](box.md) | Box | Modal form with a title, icon and submit and cancel handlers, shown when its path value matches the if condition |
| [`breadcrumb`](breadcrumb.md) | Breadcrumb | Breadcrumb navigation trail built from a data source, with a root link, configurable icons and an optional document title |
| [`button`](button.md) | Button | A simple button component with great features. |
| [`calendar`](calendar.md) | Calendar | The component must be called manually or works with textbox or j-Input component automatically. |
| [`carousel`](carousel.md) | Carousel | Content carousel with swipe gestures, automatic animation at a set interval and left and right controls |
| [`carousel2`](carousel2.md) | Carousel2 | If the component's path is changed then the component summarizes all cells again. |
| [`centered`](centered.md) | Centered | Centered modal form moved under the body tag that appears when its path value matches the if condition, with close options |
| [`changer`](changer.md) | Changer | This component captures inline changes and can affect the validate component. |
| [`checkbox`](checkbox.md) | Checkbox | Checkbox bound to a data path, with an optional label, required and disabled states, and a reverse mode |
| [`checkboxlist`](checkboxlist.md) | Checkboxlist | Group of checkboxes built from static items or a data source, bound to a path as a list of selected values |
| [`checkboxlistexpert`](checkboxlistexpert.md) | CheckboxListExpert | Perfect component for checboxlist with custom styles. |
| [`checkpath`](checkpath.md) | CheckPath | Development tool that shows a popup with the plugin, component and binder of the clicked element, with copy buttons |
| [`children`](children.md) | Children | Try to understand the functionality from the example. |
| [`choose`](choose.md) | Choose | The component is alternative to CheckboxListExpert and RadioButtonListExpert. |
| [`chunkyscroll`](chunkyscroll.md) | ChunkyScroll | Virtual scrolling list that renders only the visible rows of thousands of items, with configurable row height and margins |
| [`cl`](cl.md) | Cl | The component parses inline data defined in the component's element. |
| [`clbind`](clbind.md) | ClBind | Reads one item from a data source by its id and renders it inside the element, with an optional Tangular template |
| [`click`](click.md) | Click | The component calls a method or can set a value according to the path. |
| [`clickbox`](clickbox.md) | ClickBox | This component is optimized for SEO. |
| [`clipboard`](clipboard.md) | Clipboard | Singleton that copies text to the clipboard using the Clipboard API, with a document.execCommand fallback |
| [`clipboardimage`](clipboardimage.md) | ClipboardImage | This component automaticaly captures images in Clipboard. |
| [`clock`](clock.md) | Clock | Singleton clock popup toggled from an element that passes the selected date to a callback, with optional 12-hour time |
| [`cloudeditor`](cloudeditor.md) | CloudEditor | Code editor embedded in an iframe with multiple cursors, find, diff tracking and optional real-time collaboration |
| [`cloudeditorsimple`](cloudeditorsimple.md) | CloudEditorSimple | Simpler embedded code editor whose settings are in the config and whose bound value is a plain string |
| [`code`](code.md) | Code | Embedded code editor, the same as CloudEditorSimple, with its settings in the config and a plain string value |
| [`codemirror`](codemirror.md) | CodeMirror | Code field based on CodeMirror with syntax highlighting, line numbers, tab indentation and a configurable height |
| [`colorpicker`](colorpicker.md) | ColorPicker | Singleton color picker popup placed next to an element, with offsets, alignment and opacity for hex colors |
| [`colorpickerbutton`](colorpickerbutton.md) | ColorPickerButton | Button that opens a color picker and shows the selected color, with a default color and position options |
| [`colorselector`](colorselector.md) | ColorSelector | Row of preset color swatches for choosing one color, with an optional empty value and disabled or required states |
| [`columns`](columns.md) | Columns | The component Columns is a very simple alternative to j-Layout and j-Layout2. |
| [`configuration`](configuration.md) | Configuration | Settings form generated from a declaration of typed properties such as text, number, date, dropdown and color |
| [`confirm`](confirm.md) | Confirm | Singleton confirmation dialog with custom buttons that passes the clicked button index or runs a callback on yes |
| [`console`](console.md) | Console | Singleton log console that shows messages from a data source in tabs per app, with a clear action and dark mode |
| [`console2`](console2.md) | Console2 | Log console panel that shows messages from a data source, with a clear button and automatic opening and closing |
| [`contenteditable`](contenteditable.md) | ContentEditable | Rich text area with bold, italic, underline and link shortcuts, required validation and methods to insert content |
| [`contentslider`](contentslider.md) | ContentSlider | Content slider that cycles through links at a set interval and can remember its state in localStorage |
| [`contextmenu`](contextmenu.md) | ContextMenu | If the value isn't defined then the component uses name as value. |
| [`controls`](controls.md) | Controls | Singleton popup menu positioned at an element or coordinates, with items, submenus, captions and dividers |
| [`cookie`](cookie.md) | Cookie | Singleton cookie consent notice that stores agreement in localStorage, with a cancel option that clears data and redirects |
| [`cookie2`](cookie2.md) | Cookie2 | Cookie consent notice like Cookie with different default button labels, storing agreement in localStorage |
| [`countdown`](countdown.md) | CountDown | The component can show an action when time is expired. |
| [`crop`](crop.md) | Crop | Image cropper with zoom and drag and drop for local files or URLs that outputs an image of a fixed width and height |
| [`csv-export`](csv-export.md) | CSVExport | Function that downloads an array of objects as a CSV file from the browser, with optional columns. |
| [`dashboard`](dashboard.md) | Dashboard | The component expects Array of objects. |
| [`datagrid`](datagrid.md) | DataGrid | This grid was created for single page applications and enterprise applications. |
| [`datasource`](datasource.md) | DataSource | Loads data from a URL with AJAX, optionally after a delay, and binds the result to a path in the model |
| [`datatable`](datatable.md) | DataTable | Paginated, sortable data table (beta) for SPA and server-side listing, with scrolling, responsive layout and dark mode |
| [`datepicker`](datepicker.md) | DatePicker | The component must be called manually or works with j-Input component automatically. |
| [`detach`](detach.md) | Detach | The component can detach/attach all children (HTML elements). |
| [`detail`](detail.md) | Detail | This component can render values from model. |
| [`developer`](developer.md) | Developer | Developer overlay that monitors a jComponent single page app and shows timings, call counts and memory in Chromium |
| [`diagram`](diagram.md) | Diagram | Renders a Tangular template inside a scrollable diagram that resizes to its parent, with an optional reversed layout |
| [`directory`](directory.md) | Directory | It's similar component like j-Suggestion, but has improved design and supports more handy features. |
| [`disable`](disable.md) | Disable | The component disables nested controls like input, select and textarea. |
| [`display`](display.md) | Display | The component calculates the interval between displays automatically. |
| [`dockable`](dockable.md) | Dockable | The dockable component expects Array of objects. |
| [`donutchart`](donutchart.md) | DonutChart | Donut chart with optional tooltips, piece highlighting, and select and redraw callbacks |
| [`dragdropelement`](dragdropelement.md) | DragDropElement | On drag event displays modal inside given element with text Drop & drop files here. |
| [`dragdropfiles`](dragdropfiles.md) | DragDropFiles | Drop zone that runs a method with the dropped files, toggles a class on drag over and opens a file dialog on click |
| [`draggable`](draggable.md) | Draggable | A simple component which can capture drag & drop operation. |
| [`drawer`](drawer.md) | Drawer | Side drawer that slides in from the left or right and shows when its path value matches the if condition, with responsive widths |
| [`drawzone`](drawzone.md) | DrawZone | Map component for drawing a polygon zone on OpenLayers with an OpenStreetMap base, with zoom, color and readonly options |
| [`dropdown`](dropdown.md) | Dropdown | Select box filled from static items or a data-source array, with optional filter condition, number conversion and an empty option |
| [`dropdowncheckbox`](dropdowncheckbox.md) | DropdownCheckbox | Dropdown with multiple selection through checkboxes, filled from static items or a data-source, with a summary text for selected values |
| [`dropdownlist`](dropdownlist.md) | DropdownList | Multi-value picker that shows selected items as removable tags, choosing from a data-source with an optional selection limit |
| [`dropfiles`](dropfiles.md) | DropFiles | Singleton that captures files dropped anywhere on the window and passes them to a handler, with an optional check before accepting the drop |
| [`duplicator`](duplicator.md) | Duplicator | Beta component that repeats its template once per item of a data-source array, each copy bound to its own item in an independent scope |
| [`dynamicvalue`](dynamicvalue.md) | DynamicValue | This component is very special component. |
| [`dynamicvaluelist`](dynamicvaluelist.md) | DynamicValueList | This component is very special component. |
| [`EAN13`](EAN13.md) | EAN13 | The component will draw EAN-13 barcode according to the path value. |
| [`edit`](edit.md) | Edit | The component enables contenteditable attribute for elements with edit or edit2 classes. |
| [`editable`](editable.md) | Editable | This component can edit all elements with editable class. |
| [`elementid`](elementid.md) | ElementID | This component fills the data-id attribute with the value read from the path. |
| [`emoji`](emoji.md) | Emoji | Searchable emoji picker with categories, a history of frequently used emoticons and selectable skin tones |
| [`emojibutton`](emojibutton.md) | EmojiButton | Button that shows the chosen value as a preview and opens a popup picker on click, with alignment and position options |
| [`empty`](empty.md) | Empty | Placeholder with an icon and a message that is shown when the watched data-source is empty and hidden otherwise |
| [`emptyinline`](emptyinline.md) | EmptyInline | The component will display text inside the element if the value is empty or the array doesn't contain an item. |
| [`enter`](enter.md) | Enter | Runs a method when the user presses Enter inside the form, after validating the inputs, or clicks a submit button if one is set |
| [`enterbox`](enterbox.md) | Enterbox | A simple EnterBox. Each value needs to be confirmed via enter key or clicking on the button. |
| [`error`](error.md) | Error | Displays the error messages from an array of objects with an error property, hidden when the array is empty |
| [`errorhandler`](errorhandler.md) | ErrorHandler | The component tries using j-Message, j-Snackbar, j-NotifyBar or j-Notify for displaying of errors if you don't have defined exec configuration. |
| [`exec`](exec.md) | Exec | The component executes a method when the user clicks on the same element with the exec, exec2, or exec3 class. |
| [`expander`](expander.md) | Expander | Clips content to a maximum height with a fade and a button that expands or collapses it, with configurable icons |
| [`expansionpanel`](expansionpanel.md) | ExpansionPanel | Accordion that turns child sections into labeled panels which open and close on click, optionally several at once |
| [`extend`](extend.md) | Extend | This component is a specific component with powerful functionality. |
| [`faicons`](faicons.md) | FaIcons | Searchable singleton picker of Font Awesome icons with a scrollable list, including pro icons when they are available |
| [`faiconsbutton`](faiconsbutton.md) | FaIconsButton | Button that shows the selected Font Awesome icon and opens the icon picker popup on click |
| [`faviconunread`](faviconunread.md) | FaviconUnread | Shows an unread count on the page favicon as a colored badge, also using the app badge API where the browser supports it |
| [`features`](features.md) | Features | Desktop-only singleton popup with a searchable list of features, opened by a method that receives the items and a placeholder |
| [`feedbackbutton`](feedbackbutton.md) | FeedbackButton | Singleton floating feedback button on the left or right edge that can link to a URL, be dismissed, and stay hidden for a set expiration time |
| [`filebrowser`](filebrowser.md) | FileBrowser | The component will open a file browser and returns selected files. |
| [`filereader`](filereader.md) | FileReader | Singleton that opens the file browser and reads the selected text files, passing their contents to a callback |
| [`filesaver`](filesaver.md) | FileSaver | Singleton wrapper of FileSaver.js that saves a generated string or blob as a local file with the given name and content type |
| [`fileupload`](fileupload.md) | FileUpload | Is very helpful component for uploading e.g. |
| [`fileuploader`](fileuploader.md) | FileUploader | A simple component for uploading files. |
| [`fileuploadlist`](fileuploadlist.md) | FileUploadList | This component can upload files and the result adds into the model. |
| [`filter`](filter.md) | Filter | Singleton filter popup with Apply, Reset and Cancel buttons, whose options can include date, time and directory pickers |
| [`fixedmodal`](fixedmodal.md) | FixedModal | The content of the j-FixedModal is divided to 3 parts: header, body and footer. |
| [`floatingbox`](floatingbox.md) | FloatingBox | Singleton floating box shown next to a target element by its id, hidden on backdrop click, with a configurable z-index and dark mode |
| [`floatinginput`](floatinginput.md) | FloatingInput | Singleton floating input popup shown next to an element with x and y offsets and a minimum width, supporting dark mode |
| [`floatingpanel`](floatingpanel.md) | FloatingPanel | You can combine methods with j-Shortcuts component. |
| [`floatingsearch`](floatingsearch.md) | FloatingSearch | A simple floating search input. |
| [`flow`](flow.md) | Flow | Canvas-based visual flow designer with draggable nodes and connecting lines, a background grid, zoom and optional curved lines |
| [`floweditor`](floweditor.md) | FlowEditor | The component opens Flow editor in the iframe. |
| [`folder`](folder.md) | Folder | The component can render a content like file browser. |
| [`fontawesome`](fontawesome.md) | FontAwesome | A simple FontAwesome viewer with fulltext searching. |
| [`fontawesomebox`](fontawesomebox.md) | FontAwesomeBox | A simple FontAwesome viewer with fulltext searching. |
| [`form`](form.md) | Form | Side form that is displayed when the value of its path matches the if condition, with title, icon, reload and submit hooks |
| [`formdata`](formdata.md) | FormData | With this component you can send data via the POST/PUT/DELETE method to the current window or another. |
| [`formtab`](formtab.md) | FormTab | Tabbed side forms that open under the body and fit the window, with a configurable width for each screen size |
| [`fullform`](fullform.md) | FullForm | Full-screen form displayed when the value of its path matches the if condition, with title, icon, submit and cancel hooks |
| [`gallery`](gallery.md) | Gallery | Full-screen image preview gallery with previous and next navigation and keyboard support, designed for Bootstrap grid layouts |
| [`gauge`](gauge.md) | Gauge | Donut gauge drawn in SVG from colored percentage segments, with an optional formatted value shown in the center |
| [`gps`](gps.md) | GPS | The component tries to read GPS coordinates. |
| [`grid`](grid.md) | Grid | Data table with a fixed header, scrollable body, filtering and pagination, driven by a data-source with items and page information |
| [`hashchange`](hashchange.md) | HashChange | The component captures all changes for #hashtag in the URL address. |
| [`highlightsyntax`](highlightsyntax.md) | HighlightSyntax | Simple syntax highlighter with help of Highlight.js. |
| [`html-5-template`](html-5-template.md) | HTML5Template | Starter HTML 5 page that loads the Total.js UI library. |
| [`icons`](icons.md) | Icons | Singleton browser of Total.js icons with search, loaded from a CDN icon list or from a custom list |
| [`idletime`](idletime.md) | IdleTime | Emits idle when the page has no mouse, keyboard, touch or focus activity for a set time, and reload when a hidden page is shown again |
| [`iframe`](iframe.md) | iFrame | The component renders another URL address (stored in the path attribute) directly in the iframe. |
| [`iframeeditable`](iframeeditable.md) | iFrameEditable | Edits HTML safely inside an iframe whose height follows its body, for content marked as contenteditable |
| [`iframepreview`](iframepreview.md) | iFramePreview | Renders HTML safely inside an iframe whose height fits its body, for previews such as invoices or emails |
| [`iframeviewer`](iframeviewer.md) | iFrameViewer | This component show a layer (over the content) with a iframe. |
| [`imageuploader`](imageuploader.md) | ImageUploader | A simple singleton component for uploading of resized images. |
| [`imageviewer`](imageviewer.md) | ImageViewer | Singleton image viewer with previous and next navigation over a group of images, keyboard support and a default title for unnamed ones |
| [`importcsv`](importcsv.md) | ImportCSV | Output of this component is mapped array. |
| [`importer`](importer.md) | Importer | If the part component isn't within scope then the value from the config.if will replace ? |
| [`infinitescroll`](infinitescroll.md) | InfiniteScroll | Scrollable container that runs a method when the user reaches the end, so more content can be loaded and appended while reading |
| [`info`](info.md) | Info | Singleton info popup with HTML content displayed next to an element, aligned left, center, right or half, shown and hidden by setter calls |
| [`infowindows`](infowindows.md) | InfoWindows | The InfoWindows component expects Array of objects. |
| [`inlinedatepicker`](inlinedatepicker.md) | InlineDatePicker | Date picker rendered inline in the page with configurable first day of the week, day and month names, and optional badges per date |
| [`inlineform`](inlineform.md) | InlineForm | Inline form panel moved under the body and shown for a path value, with title, icon and reload hook, optionally hidden on outside click |
| [`inlineproperties`](inlineproperties.md) | InlineProperties | Singleton panel of editable properties shown next to an element, with a close button, a default width and date and directory settings |
| [`input`](input.md) | Input | Multi-purpose input for text, email, multiline and checkbox values, with validation, formatting, masks and a directory lookup |
| [`inputtags`](inputtags.md) | InputTags | Input that turns each entered value into a removable tag, with optional left and right icons and a lookup from a data-source |
| [`intranet-css`](intranet-css.md) | IntranetCSS | CSS for intranet applications built with the Total.js UI library. |
| [`intro`](intro.md) | Intro | Step-by-step guided tour shown in a popup with next and done buttons, displayed when the value of its path matches the if condition |
| [`isopen`](isopen.md) | IsOpen | Shows opening hours from a template and whether the place is open at the current time, refreshed automatically |
| [`jsontree`](jsontree.md) | JSONTree | Shows JSON text as an expandable tree view, calls a click handler with the path of the selected node and has a clear button |
| [`kanban`](kanban.md) | Kanban | Kanban board with draggable items in groups, with callbacks for moving, removing and double-clicking an item |
| [`keyselection`](keyselection.md) | KeySelection | This component allows user to select some items by up/down keys and confirm selection by the enter key. |
| [`keyvalue`](keyvalue.md) | KeyValue | A simple component for create key/value pairs values. |
| [`largeform`](largeform.md) | LargeForm | Large form window shown when the value of its path matches the if condition, with submit and cancel callbacks |
| [`layer`](layer.md) | Layer | Bootstrap layer panel shown when the value of its path matches the if condition, with a title, back button and optional scrollbar |
| [`layout`](layout.md) | Layout | Making of layout is very easy and with a lot of possibilities. |
| [`layout2`](layout2.md) | Layout2 | Making of layout is very easy. |
| [`lazycontent`](lazycontent.md) | LazyContent | This component shows own content when it's visible. |
| [`lazyimages`](lazyimages.md) | LazyImages | Loads images from data-src into src only when they scroll into view, with support for custom scrollbars |
| [`lazyload`](lazyload.md) | LazyLoad | Runs a callback for lazy elements matching a selector when they become visible in the scrolling container |
| [`leaflet`](leaflet.md) | Leaflet | OpenStreetMap map using the Leaflet library, with an optional marker that can be dragged and a move callback |
| [`linechart`](linechart.md) | LineChart | Please review an example and keep a data-source. |
| [`listbox`](listbox.md) | Listbox | Select list box with static items or a data-source, with an optional search box, empty option and required validation |
| [`listdetail`](listdetail.md) | ListDetail | Splits content into a list and a resizable detail panel, side by side or stacked, with the detail shown when the path has a value |
| [`listform`](listform.md) | ListForm | The component watches a click event on all buttons with name attribute: |
| [`listing`](listing.md) | Listing | Paginated client-side list that renders a template for each item of an array, with page buttons and item counts |
| [`listmenu`](listmenu.md) | ListMenu | A ListMenu component for custom list items. |
| [`listmenueditable`](listmenueditable.md) | ListMenuEditable | Component for editable list menu |
| [`livestats`](livestats.md) | LiveStats | Live SVG line chart with one colored line per key, updated from incoming values, with dark mode support |
| [`loadcontent`](loadcontent.md) | LoadContent | Loads an HTML template from a script type text/html element into the page, with text replacement and a callback after loading |
| [`loading`](loading.md) | Loading | Singleton loading indicator with a spinner or a top line, shown and hidden through SETTER calls with an optional text |
| [`locale`](locale.md) | Locale | This component sets current browser locale (number format, date format and time format) according to the navigatior.language. |
| [`mailify`](mailify.md) | Mailify | This method finds all emails and creates links with mailto:. |
| [`mainprogress`](mainprogress.md) | MainProgress | This component is singleton. |
| [`map`](map.md) | Map | Google Maps map bound to a path that accepts GPS coordinates or an address, with an optional draggable marker |
| [`mapmarker`](mapmarker.md) | MapMarker | Google Maps marker bound to a path with GPS coordinates or an address, with an optional draggable marker and autocomplete |
| [`mapzones`](mapzones.md) | MapZones | OpenLayers map for drawing and editing polygon zones from data-source points, with a callback when the value changes |
| [`markdown`](markdown.md) | Markdown | This component contains only Markdown parser. |
| [`markdowneditor`](markdowneditor.md) | MarkdownEditor | Markdown editor based on SimpleMDE, bound to a path and updating the value as the text changes |
| [`markdownpreview`](markdownpreview.md) | MarkdownPreview | This component depends on j-Markdown component. |
| [`masonry`](masonry.md) | Masonry | A simple Masonry component. |
| [`menu`](menu.md) | Menu | Singleton popup menu with submenus, touch support, dark mode and a large mode, closed by clicking outside it |
| [`message`](message.md) | Message | Singleton message box that shows warning, success and other messages through SETTER calls, with a configurable button |
| [`minheight`](minheight.md) | MinHeight | This component sets a minimal height for the parent (defined) element. |
| [`miniform`](miniform.md) | MiniForm | Small modal form shown when the value of its path matches the if condition, with submit and cancel callbacks |
| [`mobilecarousel`](mobilecarousel.md) | MobileCarousel | Works only with Bootstrap grid system and in mobile devices xs. |
| [`modal`](modal.md) | Modal | Is a simple alternative to j-Form. |
| [`modificator`](modificator.md) | Modificator | This component can modify behaviour of element according to the preddefined schema. |
| [`monacoeditor`](monacoeditor.md) | MonacoEditor | Monaco code editor bound to a path, with a configurable language and theme and a fixed or parent-based height |
| [`monthlycalendar`](monthlycalendar.md) | MonthlyCalendar | Month and day names are taken from MONTHS and DAYS properties defined in jComponent library. |
| [`movable`](movable.md) | Movable | The component handles similar draggable element and supports movement between each other. |
| [`movement`](movement.md) | Movement | This component captures basic keyboard keys like arrows, enter and esc. |
| [`multioptions`](multioptions.md) | MultiOptions | Form that builds typed option fields from a mapping of key and value pairs and binds the result as an object to the path |
| [`nativenotifications`](nativenotifications.md) | NativeNotifications | Singleton wrapper for browser system notifications with a title, message, optional icon and callback, closed after a timeout |
| [`navigation`](navigation.md) | Navigation | Simple tree-style navigation menu built from a data-source, remembering open items by primary key and supporting dark mode |
| [`navlayout`](navlayout.md) | NavLayout | A simple and fully responsive navigation layout. |
| [`noscrollbar`](noscrollbar.md) | NoScrollbar | Container that fills the height of its parent without a visible scrollbar, resizing on window resize and scrolling to top or bottom |
| [`nosqlcounter`](nosqlcounter.md) | NoSQLcounter | Bar chart of monthly counts from year, month and value records, with optional month names and a maximum value limit |
| [`notifications`](notifications.md) | Notifications | Singleton toast notifications with icon, date, message, color and callback, auto-closing and optional native alerts when unfocused |
| [`notificationspanel`](notificationspanel.md) | NotificationsPanel | Singleton side panel listing notifications, with a click callback, a clear button and optional removal of items after a click |
| [`notify`](notify.md) | Notify | Singleton toast notifications for warning, success and info messages, shown in a screen corner and closed automatically |
| [`notifybar`](notifybar.md) | NotifyBar | Singleton top bar showing success, warning or info messages with a message history and an automatic timeout |
| [`objecteditor`](objecteditor.md) | ObjectEditor | Editor for JavaScript objects that shows nested properties and arrays as editable controls bound to the path, with a change callback |
| [`objecttree`](objecttree.md) | ObjectTree | Expandable/Collabsible object tree. |
| [`offline`](offline.md) | Offline | This component displays a message box when there is no internet connection. |
| [`onetime`](onetime.md) | OneTime | This component executes a method only once and it waits for expiration. |
| [`packeta`](packeta.md) | Packeta | Opens the Packeta widget so the user can pick a pickup point, then passes the selected point object to a callback |
| [`page`](page.md) | Page | This component can handle different contents asynchronously. |
| [`pages`](pages.md) | Pages | The component is a better alternative to the j-Section component. |
| [`pagination`](pagination.md) | Pagination | Page navigation with numbered page buttons and pluralized page and item labels, calling a callback when a page is selected |
| [`panel`](panel.md) | Panel | Window panel shown when the value of its path matches the if condition, with a title, close button and dark mode support |
| [`paper`](paper.md) | Paper | Block-based rich content editor that stores its widgets as an object array, loads them from widget repositories and can autosave |
| [`parameters`](parameters.md) | Parameters | This component can changed internal parameters. |
| [`part`](part.md) | Part | This component can handle different contents asynchronously. |
| [`parts`](parts.md) | Parts | This content can handle multiple parts stored in the Array and focus on one specific part. |
| [`passwordmeter`](passwordmeter.md) | PasswordMeter | Password strength meter with a progress bar and rating label, checking length, digits, letter case and special characters |
| [`paste`](paste.md) | Paste | The component captures paste event. |
| [`period`](period.md) | Period | The component for picking a time period. |
| [`permissions`](permissions.md) | Permissions | Editor for permission lists that assigns types such as read and write to directory entries, with a search box and a data-source |
| [`permissionsop`](permissionsop.md) | PermissionsOP | The component is similar like j-Permissions, but this component is more developer friendly (more automated) and it's targeted for OpenPlatform applications. |
| [`pictures`](pictures.md) | Pictures | The component displays images in a simple list. |
| [`pictureupload`](pictureupload.md) | PictureUpload | Picture drop zone that uploads a raw image file at a fixed width and height, with an optional icon, URL and background color |
| [`pictureuploadexpert`](pictureuploadexpert.md) | PictureUploadExpert | Advanced picture uploader with drag and drop, multiple files, EXIF orientation and resized one-by-one upload to a URL |
| [`pin`](pin.md) | Pin | A simple PIN maker. |
| [`planner`](planner.md) | Planner | Gantt-style planner that draws items as bars over the days of a year, with progress, colors and tooltips from a data-source |
| [`preview`](preview.md) | Preview | This component resizes the picture automatically according to the settings and uploads it to the server in base64 format. |
| [`pricerange`](pricerange.md) | PriceRange | The component stores value as string 200-500, explanation: from-to. |
| [`print-custom-html`](print-custom-html.md) | PrintCustomHTML | Function that opens a window, writes custom HTML into it and prints it. |
| [`printer`](printer.md) | Printer | The component can print a HTML content. |
| [`progress`](progress.md) | Progress | Progress bar that shows a percentage between 0 and 100 bound to the path, with optional animation |
| [`prompt`](prompt.md) | Prompt | The component (singleton) displays a prompt window with single-line or multiline input. |
| [`properties`](properties.md) | Properties | The component uses j-DatePicker, j-TimePicker, j-Directory, j-Emoji, j-ColorPicker and j-FaIcons components. |
| [`properties2`](properties2.md) | Properties2 | The component uses j-DatePicker, j-TimePicker, j-Directory, j-Emoji, j-ColorPicker and j-Icons components. |
| [`qrcode`](qrcode.md) | QRCode | Generates QR code images from a text with the bundled QRCode library, with configurable colors, size and delay. |
| [`radiobutton`](radiobutton.md) | RadioButton | Group of radio buttons built from an items string or a data-source, with required, disabled and inline options |
| [`radiobuttonexpert`](radiobuttonexpert.md) | RadioButtonExpert | Perfect component for radiobutton with custom styles. |
| [`range`](range.md) | Range | Slider for choosing a number between a minimum and maximum, with a set step and optional conversion to a number type |
| [`rating`](rating.md) | Rating | Five-star rating control that stores the clicked score, from 1 to 5, as the bound value |
| [`raweditable`](raweditable.md) | RawEditable | Minimal editable text field with type rules, validation, length limits and autocomplete, designed for custom extensions |
| [`rawinput`](rawinput.md) | RawInput | Minimal text input with type rules, validation, length limits and autocomplete, designed for custom extensions |
| [`ready`](ready.md) | Ready | This component executes some operations when the component is ready. |
| [`recaptcha`](recaptcha.md) | reCAPTCHA | Google reCAPTCHA widget bound to a form value, configured with a site API key and a light or dark theme |
| [`releaser`](releaser.md) | Releaser | The component can release after some time own content (DOM) + memory. |
| [`remember`](remember.md) | Remember | The component calls a function within the repeat interval. |
| [`repeater`](repeater.md) | Repeater | Renders a template for each item of an array, with index and path placeholders and an optional filter |
| [`repeatergroup`](repeatergroup.md) | RepeaterGroup | Groups an array of items automatically by a chosen property and renders the template for each group |
| [`resource`](resource.md) | Resource | Resources are very great solution for e.g. |
| [`restart`](restart.md) | Restart | The component is very primitive and it will only display the content if the value is positive. |
| [`rows`](rows.md) | Rows | The component Rows is a very simple alternative to j-Layout and j-Layout2. |
| [`rules`](rules.md) | Rules | The component can create a simple rules which you can transform to some engines like Total.js Flow. |
| [`scanner`](scanner.md) | Scanner | The component for scanning documents. |
| [`scrollbar`](scrollbar.md) | Scrollbar | Custom scrollbars. IMPORTANT: It wraps current content by adding two nested div elements with relative position. |
| [`scrollpercentage`](scrollpercentage.md) | ScrollPercentage | Component must be attached on the element which will be as a scroll container. |
| [`search`](search.md) | Search | Simple fulltext search component. |
| [`searchbox`](searchbox.md) | SearchBox | The component contains a search box (input). |
| [`searchdata`](searchdata.md) | SearchData | This component tries to filter data according to the search phrase. |
| [`searchinput`](searchinput.md) | SearchInput | Customizable search input. |
| [`section`](section.md) | Section | Container with a fixed percentage height of its parent or window, with optional scrolling and sections that switch by path |
| [`selectbox`](selectbox.md) | SelectBox | Dropdown select with static items or a data-source, with an optional search box, empty option and disabled state |
| [`selected`](selected.md) | Selected | The component can set a specific class to a specific element according to the simple condition. |
| [`selection`](selection.md) | Selection | The component supports something like checkbox list. |
| [`servergrid`](servergrid.md) | ServerGrid | Beta paged data grid for single page apps, where columns, rows, sorting, filtering and pages come from the data-source |
| [`serverlist`](serverlist.md) | ServerList | The ServerList component attempts to locate a Tangular template. |
| [`serverlisting`](serverlisting.md) | ServerListing | The model must be in the format below: |
| [`serviceworker`](serviceworker.md) | ServiceWorker | Service worker helper that caches app assets and serves an offline fallback page when the network is unavailable |
| [`shoppingcart`](shoppingcart.md) | ShoppingCart | Singleton shopping cart stored in localStorage, with add, update, remove, discount and server sync methods |
| [`shortcuts`](shortcuts.md) | Shortcuts | This component can help with creating keyboard shortcuts. |
| [`singleupload`](singleupload.md) | SingleUpload | Upload control for one file that posts to a URL, with optional accepted file types and a title template |
| [`slider`](slider.md) | Slider | This slider works only with 100% X axis. |
| [`smilefy`](smilefy.md) | Smilefy | Function that converts text emoticons such as :) into UTF smileys. |
| [`snackbar`](snackbar.md) | Snackbar | Singleton notification bar for info, success, warning or waiting messages, with a dismiss button and timeout |
| [`sounds`](sounds.md) | Sounds | This component contains some predefined sounds like beep, fail, success, etc... |
| [`splashscreen`](splashscreen.md) | SplashScreen | Full-screen splash screen for single page apps that is removed after a timeout and can be remembered for a period |
| [`spotlight`](spotlight.md) | Spotlight | Singleton search overlay that queries a URL or function, shows results and recent items, and calls back with the selection |
| [`stash`](stash.md) | Stash | The component can postpone elements without destructing and detaching from the DOM. |
| [`stats12`](stats12.md) | Stats12 | Bar chart of 12 monthly values, scaled to the largest value or a set maximum, with the current month optionally highlighted |
| [`stats24`](stats24.md) | Stats24 | Bar chart of 24 hourly values with tooltips on hover and the current hour optionally highlighted |
| [`stats7`](stats7.md) | Stats7 | Bar chart of seven daily values starting from a chosen first day of the week, with the current day optionally highlighted |
| [`statsbarsimple`](statsbarsimple.md) | StatsBarSimple | The component needs to have a defined template for rendering content and a tooltip. |
| [`statusinput`](statusinput.md) | StatusInput | Singleton input bar with placeholder, icon, validation and a callback that receives the entered value |
| [`sticker`](sticker.md) | Sticker | Keeps an element stuck at the top while scrolling by toggling CSS classes at scroll positions, per screen size |
| [`submit`](submit.md) | Submit | This component is very similar to j-Validation but it adds additional features which can simplify the creation of SPA. |
| [`suggestion`](suggestion.md) | Suggestion | If the value isn't defined then the component uses name as value. |
| [`svgicons`](svgicons.md) | SVGIcons | Registers the ui-svgicon element that displays icons from an SVG sprite file, with name, size and selected state |
| [`swiper`](swiper.md) | Swiper | Wrapper for the Swiper.js carousel with slides per view, spacing, navigation, pagination, autoplay and loop options |
| [`switchbutton`](switchbutton.md) | SwitchButton | Toggle switch for a boolean value, with left or right alignment, an optional description and bottom border |
| [`table`](table.md) | Table | Simple UI table for arrays or paged data, with row highlighting, detail rows, sorting, pagination and remembered selection |
| [`tablegrid`](tablegrid.md) | TableGrid | The component makes a simple table grid (composed of div elements) divided by a simple border that you can modify. |
| [`tabmenu`](tabmenu.md) | TabMenu | Tab navigation that marks the selected element with a CSS class and runs a function when the tab changes |
| [`tabs`](tabs.md) | Tabs | Tabbed panels defined by section elements with a data-id and title, each with an optional icon |
| [`tagger`](tagger.md) | Tagger | Tagger can render items in the array and each item can be removed. |
| [`tags`](tags.md) | Tags | CSS-only styles for tag labels. |
| [`tangular-autoformat`](tangular-autoformat.md) | TangularAutoFormat | This TAngular helper automatically formats email, phone number, boolean, numbers, dates or HEX color. |
| [`tangular-badge`](tangular-badge.md) | TangularBadge | Tangular helper that renders colored badge elements for a label or a list of labels. |
| [`tangular-color`](tangular-color.md) | TangularColor | A simple Tangular template engine helper for rendering colors from the string. |
| [`tangular-counter`](tangular-counter.md) | TangularCounter | This helper can create a short value from big numbers. |
| [`tangular-filesize`](tangular-filesize.md) | TangularFileSize | Tangular helper and Number prototype that render a file size in a human readable form. |
| [`tangular-initials`](tangular-initials.md) | TangularInitials | A simple Tangular template engine helper for rendering initials from the name (firstname + lastname). |
| [`tangular-jsonformat`](tangular-jsonformat.md) | TangularJsonFormat | A simple Tangular helper for formatting of objects to more readable JSON. |
| [`tangular-rgba`](tangular-rgba.md) | TangularRGBA | A simple Tangular template engine helper for transforming hex colors to RGBA colors. |
| [`tangular-time`](tangular-time.md) | TangularTime | A simple Tangular template engine helper for rendering humanable date and time. |
| [`template`](template.md) | Template | Renders a Tangular template with the bound model and hides itself when the model is null or undefined |
| [`templates`](templates.md) | Templates | Renders a list from named templates, with drag and drop, custom scrollbars, context menu and an empty template |
| [`textarea`](textarea.md) | Textarea | Multi-line text field with label, icon, placeholder, length limit, error text and optional monospace font |
| [`textbox`](textbox.md) | Textbox | Text input with label, icons, placeholder, length limits, type rules and validation for email, phone, date and number |
| [`textboxlist`](textboxlist.md) | TextboxList | Input that adds entries to a list, with a maximum limit, type rules, error text and optional reordering of items |
| [`textboxtags`](textboxtags.md) | TextboxTags | Tag input that stores entered words as an array or string, with optional lowercase or uppercase conversion |
| [`time`](time.md) | Time | This component renders a current time. |
| [`timepicker`](timepicker.md) | TimePicker | The component must be called manually or works with j-Input component automatically. |
| [`title`](title.md) | Title | Sets the browser document title from a bound value, combined with a site name and a separator |
| [`togglebox`](togglebox.md) | ToggleBox | ToggleBox can re-order or hide items in Array. |
| [`togglebutton`](togglebutton.md) | ToggleButton | Icons can be in the form: circle or ti ti-circle. |
| [`togglemore`](togglemore.md) | ToggleMore | Is a simple component to toggle content. |
| [`tooltip`](tooltip.md) | Tooltip | Singleton tooltip shown next to an element with HTML content, offset, alignment and optional auto-hide timeout |
| [`tooltip-css`](tooltip-css.md) | TooltipCSS | CSS-only tooltips based on the tooltip attribute, positioned with tooltip-position. |
| [`totaltemplates`](totaltemplates.md) | TotalTemplates | This component can render Total.js Templates. |
| [`touchmove`](touchmove.md) | TouchMove | Simple touchmove component for easy touch navigation next/prev/up/down. |
| [`tour`](tour.md) | Tour | Step-by-step guided tour that highlights target elements from a data-source, with keyboard navigation and custom button texts |
| [`tree`](tree.md) | Tree | Setter automatically extends each object by adding .$pointer property with a tree index. |
| [`treeview`](treeview.md) | TreeView | This component is only a beta preview. |
| [`typed`](typed.md) | Typed | Typing animation that types out an array of texts with the typed.js library, with speed, loop and cursor options |
| [`uibuilder`](uibuilder.md) | UIBuilder | This component renders the application designed via UI Builder. |
| [`uieditor`](uieditor.md) | UIEditor | The component opens UI Builder in the iframe. |
| [`uistudio`](uistudio.md) | UIStudio | This component renders the app according to the Total.js Flow UI Studio schema. |
| [`unsaved`](unsaved.md) | Unsaved | Warns the user before leaving the page when the bound value or a check function reports unsaved changes |
| [`upload`](upload.md) | Upload | The component can perform uploading of files. |
| [`urlify`](urlify.md) | URLify | This method finds all URL addresses and creates links. |
| [`validate`](validate.md) | Validate | The component contains the same source-code as the j-Validation component. |
| [`validation`](validation.md) | Validation | The component contains the same source-code as the j-Validate component. |
| [`view`](view.md) | View | This component can be helpful for reusable views in intranet apps. |
| [`viewbox`](viewbox.md) | ViewBox | Container with a fixed percentage height of its parent or window, with optional scrolling, centering and disabled overlay |
| [`virtualwire`](virtualwire.md) | VirtualWire | This is a very special UI component that can move elements from element to another element according to the selector and the value of the path. |
| [`watch`](watch.md) | Watch | The component can evaluate the method in the form function(value, element, type, path) when the value (according to the path) is changed. |
| [`watcher`](watcher.md) | Watcher | Runs the code in a script tag of type text/js whenever the bound value changes, with access to value and path |
| [`webmcp`](webmcp.md) | WebMCP | Exposes the Total.js 5 MCP tools to WebMCP-capable browsers |
| [`websocket`](websocket.md) | WebSocket | With this component, you can receive data via WebSocket. |
| [`wiki`](wiki.md) | Wiki | Great component for inline Wiki/Documentation. |
| [`window`](window.md) | Window | Modal window shown when a condition on the bound value matches, with optional closing on Escape and submit on Enter |
| [`windows`](windows.md) | Windows | The windows component expects an Array of objects. |
| [`wizardexpert`](wizardexpert.md) | WizardExpert | A simple solution for making of advanced wizards. |
| [`wysiwyg`](wysiwyg.md) | Wysiwyg | Rich text editor with formatting, code highlighting, links and unordered lists, supporting dark mode and optional raw paste |
| [`xterm`](xterm.md) | Xterm | The component renders a terminal output/input directly in the web browser. |
