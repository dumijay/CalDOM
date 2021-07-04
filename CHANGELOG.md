# CalDOM Change Log

## 1.0.6

### Added
* Implemented unit-level tests & benchmarks covering 100% of functionality.
* Added state_changed_keys and state_change_count arguments to React()'s Update(). This is helpful to decide the suitability of updating DOM directly. Refer .React() documentation for details.
* addClass()/removeClass() accepting arrays now. (in addition to classes separated by spaces).
* on()/off() accepting arrays now. (in addition to event names separated by spaces).

### Changed
* React and Diffing performance improvements.
* Single element instance performance improvements.
* Removed the ability to inject HTML at append() to avoid XSS vulnerabilities. Now the only way to inject HTML is to explicitly use .html() or init _("<h1></h1>")
* Removed append(callback_generator) due to low pratical usage and .each() is pretty much the same thing.
* Changed the name of "key" attribute to "caldom-v" at react()/replace() because it's more suitable, to avoid confusions with other libraries and the possibility of using similar keyed elements in the future.

### Fixed
* Using Array.isArray instead of instanceof Array because it doesn't work between iframes. (Minimum Firefox compatibility changed to 4+ from 3.6+).
* Fixed diffing algorithm not syncing .data() for content-unchanged elements.
* Fixed not reacting to state changes of existing (already mounted) elements. Now using Node.isConnected/compareDocumentPosition to detect mounted Nodes.
