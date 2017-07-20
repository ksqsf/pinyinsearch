const Gio = imports.gi.Gio;

const Main = imports.ui.main;
const AppDisplay = imports.ui.appDisplay;
const Search = imports.ui.search;

const SearchResults = Main.overview._controls.viewSelector._searchResults;

const Extension = imports.misc.extensionUtils.getCurrentExtension();

// NOTE: this is a workaround because GNOME Shell directly registered 
// 		 AppSearchProvider instead of holding an object
const AppSearchProvider = SearchResults._providers[0];

///
/// Local Namespace
///
var _PinyinSearch = {}

///
/// Configuration
///
_PinyinSearch.pinyin_search = true; // true for using pinyin, false for not
const dict = Extension.imports.ziHansFreq.dict; // ziHansFreq, ziComplete

///
/// Search
///

// match_substr checks if char vec @needle <= char vec @haystack
function match_substr(haystack, needle) {
	var i = 0;
	for (var j = 0; j < needle.length; ++j) {
		for (; i < haystack.length; ++i)
			if (haystack[i] == needle[j])
				break;

		if (i < haystack.length)
			continue;
		else
			return false;
	}
	return true;
}

// This function replaces GNOME Shell's implementation
// NB: results should be a list of applicable .desktop files, e.g. ["emacs.desktop"]
//     callback for returning results
_PinyinSearch.getInitialResultSet = function(terms, callback, cancellable) {
	let query = terms.join('').toLowerCase();
	let results = [];

	_PinyinSearch.app_keys.forEach(function(app_key) {
		for (var i in app_key.keys) {
			if (match_substr(app_key.keys[i], query)) {
				results.push(app_key.id);
				break;
			}
		}
	});
	print(results);
	callback(results);
}

///
/// Extensions
///
function init() {
	print("pinyinsearch init");

	_PinyinSearch._shell_getInitialResultSet = AppSearchProvider.getInitialResultSet;
}

function enable() {
	print("pinyinsearch enabled");

	// Replace GNOME Shell's search
	AppSearchProvider.getInitialResultSet = _PinyinSearch.getInitialResultSet;

	// Initialize app keys
	_PinyinSearch.app_keys = [];
	let apps_info = Gio.AppInfo.get_all();
	apps_info.forEach(function(app_info) {
		if (!app_info.get_is_hidden() && !app_info.get_nodisplay()) {
			let app_key = {id: "", keys: []};

			// desktop filename for returning results
			app_key.id = app_info.get_id();

			// keys
			app_key.keys.push(app_info.get_name().toLowerCase());
			app_key.keys.push(app_info.get_display_name().toLowerCase());
			app_key.keys.push(app_info.get_executable().toLowerCase());

			// pinyin keys
			if (_PinyinSearch.pinyin_search) {
				let convert = function(str) {
					let result = '';
					for (var i in str) {
						let char = str[i];
						if (char in dict) {
							result += dict[char].split(',')[0];
						} else {
							result += char;
						}
					}
					return result;
				};
				app_key.keys.push(convert(app_info.get_name()).toLowerCase());
				app_key.keys.push(convert(app_info.get_display_name()).toLowerCase());
			}

			_PinyinSearch.app_keys.push(app_key);
		}
	});
}

function disable() {
	print("pinyinsearch disabled");

	// Restore GNOME Shell's search
	AppSearchProvider.getInitialResultSet = _PinyinSearch._shell_getInitialResultSet;

	// Free
	delete _PinyinSearch.app_keys;
	delete _PinyinSearch.converter;
}
