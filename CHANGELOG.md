# CalDOM Change Log

## 1.0.7

### Added
* this.$ Reference holder. This can be used to keep direct DOM Node references in sync even when the render() drastically alter the DOM structure. (Native Proxy support or a polyfill is required).
* Init _(query, children): Now children can be a single CalDOM/Node/String in addition to previous array-only approach. Eg: _("+h1", ["Heading"] ) can be written as _("+h1", "Heading" ) also.
* Added this.elem : this.elem == this.elems[0]. This is useful to deal with single-element instances.
* React, Diffing and other performance improvements.

### Fixed
* addClass()/removeClass() throwing an error when an empty string is provided. Now silently ignored.

___

## 1.0.6

### Added
* Implemented unit-level tests & benchmarks covering 100% of functionality.
* Added state_changed_keys and state_change_count arguments to React()'s Update(). This is helpful to decide the suitability of updating DOM directly. Refer .React() documentation for details.
* addClass()/removeClass() accepting arrays now. (in addition to classes separated by spaces).
* on()/off() accepting arrays now. (in addition to event names separated by spaces).
* React and Diffing performance improvements.
* Single element instance performance improvements.

### Changed
* Removed the ability to inject HTML at append() to avoid XSS vulnerabilities. Now the only way to inject HTML is to explicitly use .html() or init _("html")
* Removed append(callback_generator) due to low pratical usage and .each() is pretty much the same thing.
* Changed the name of "key" attribute to "caldom-v" at react()/replace() because it's more suitable, to avoid confusions with other libraries and the possibility of using similar keyed elements in the future.

### Fixed
* Using Array.isArray instead of instanceof Array because it doesn't work between iframes. (Minimum Firefox compatibility changed to 4+ from 3.6+).
* Fixed diffing algorithm not syncing .data() for content-unchanged elements.
* Fixed not reacting to state changes of existing (already mounted) elements. Now using Node.isConnected/compareDocumentPosition to detect mounted Nodes.
