const Main = imports.ui.main;
const AppDisplay = imports.ui.appDisplay;
const Search = imports.ui.search;

const SearchResults = Main.overview._controls.viewSelector._searchResults;

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
_PinyinSearch.pinyin_search = false // true for using pinyin, false for not

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
_PinyinSearch.getInitialResultSet = function(terms, callback, cancellable) {
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
	_PinyinSearch.app_keys = {};
}

function disable() {
	print("pinyinsearch disabled");

	// Restore GNOME Shell's search
	AppSearchProvider.getInitialResultSet = _PinyinSearch._shell_getInitialResultSet;

	// Free
	delete _PinyinSearch.app_keys;
}
