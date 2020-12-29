// CalDom 1.0.3 - Initial public release
// Copyright (c) 2020 Dumi Jay
// Released under the MIT license - https://github.com/dumijay/CalDom/

//Uncomment below line to support ES6 module import/export.
//export default 
(function(){
/**
 * @private
 * Used internally to get final destination of a variable path or function path. This is used for call() and root()
 * @param {*} callee Root object
 * @param {*} paths Single variable/function name or . separated path to variable/function. Eg: "classList.contains" or "getBoundingClientRect" or "style.marginLeft" or "scrollTop"
 * @returns {Array} 2 elements array [final_destinationl, final_destination's parent/context]
 * (Shorten for getFinalDestination())
 */
function getFinalDestination(start, paths){
	for( var i = 0, len = paths.length, last_i = len -1; i < len; i++ ){
		if( i == last_i ) return [paths[i], start];

		start = start[paths[i]];
	}
}

/**
 * Get an array of created new element or found elements by a CSS Selector or an XPath Query. This can be directly accessed using _.q() without initiating a new CalDom instance.
 * @param {String} query "+html_tag" creates a new element. Otherwise it can be a CSS Selector or an XPath query starting with "$"
 * @param {Node} [parent_node] Treated as the parent node for CSS selector or XPath query. Otherwise, default to window.document
 * @returns {Array} Array with new created element or NodeList returned by the CSS selector or the XPath query
 * (Shorten for query())
 * @example
 * 
 * //Get element with id "container-id" using its CSS selector
 * var container = _.q("#container-id")[0];
 * 
 * //Create a new <div> element
 * var div = _.q("+div")[0];
 * 
 * //Get all <p> elements inside <article> using an XPath query
 * var paragraph_array = _.q("$//article/p");
 */
function q(query, parent_node){
	parent_node = parent_node || window.document;

	if( query[0] == "+" ) return [parent_node.createElement( query.substr(1) )];

	if( query[0] == "$" ){
		var results = (parent_node.ownerDocument || parent_node).evaluate(query.substr(1), parent_node, null, XPathResult.ANY_TYPE, null);
		var elems = [];

		var result = results.iterateNext();
		while(result){
			elems.push(result);
			result = results.iterateNext();
		}

		return elems;
	}
	
	return parent_node.querySelectorAll(query);
}

/**
 * @private
 * Core function of append/prepend.
 * @see append() and prepend() for reference
 * @param {*} element_or_elements_or_caldom_or_generator 
 * @param {*} before_elem_or_caldom 
 */
function insertBefore(element_or_elements_or_caldom_or_generator, before_elem_or_caldom){
	if( before_elem_or_caldom && before_elem_or_caldom.elems ) before_elem_or_caldom = before_elem_or_caldom.elems[0];

	if( typeof element_or_elements_or_caldom_or_generator[0] == 'function' ){ //Generator function
		this.each(function(elem, i){
			var generated = element_or_elements_or_caldom_or_generator[0](elem, i);
			elem.insertBefore( generated.elems ? generated.elems[0] : generated, before_elem_or_caldom === undefined ? elem.firstChild : before_elem_or_caldom || null );
		});
	}
	else if(element_or_elements_or_caldom_or_generator.length != undefined){

		for(var i = 0, len = element_or_elements_or_caldom_or_generator.length; i < len; i++){
			var this_item = element_or_elements_or_caldom_or_generator[i];
			if( !this_item ) continue;

			var new_elems = this_item instanceof CalDom ? this_item.elems : (this_item.length != undefined ? this_item : [this_item]);
			
			for( var elem_i = 0, new_elems_length = new_elems.length; elem_i < new_elems_length; elem_i++ ){
				if( !new_elems[elem_i] ) continue;

				this.elems[0].insertBefore( new_elems[elem_i], before_elem_or_caldom === undefined ? this.elems[0].firstChild : before_elem_or_caldom || null );
			}
		}
	}

	return this;
}

/**
 * @constructor Initiates a CalDom instance
 * @param {(String|CalDom|Node|Node[]|NodeList|HTMLCollection)} [selector_caldom_elems] "+html_tag" creates a new element.
 * Otherwise, it can be a CSS Selector, an XPath query starting with "$", a CalDom instance, a single Node/Element, an array of Nodes or a NodeList/HTMLCollection
 * @param {Window} [parent_window=window] (Optional) parent_window default to current window. Use this to work with iframes or external windows
 * @returns {CalDom} Returns a chainable CalDom instance
 * @example
 * 
 * //Creates a new password input element with a placeholder
 * var passwordInput = _("+input")
 * 		.attr({
 * 			type: "password",
 * 			placeholder: "Enter your password"
 * 		});
 * 
 * //Get element by ID using CSS Selector
 * var container = _("#container-id");
 * 
 * //Find anchor elements inside <article> with href containing "wikipedia.org" using an XPath query
 * var wikipedia_links = _("$//article/a[contains(＠href, 'wikipedia.org')]");
 * 
 * //Creates a CalDom instance with a single Node
 * var container = _(container_node);
 * 
 * //Creates a CalDom instance with NodeList or array of Nodes
 * var bodyChildren = _(document.body.childNodes);
 */
var CalDom = function(selector_xpath_caldom_elems, parentWindow){
	return this._i(selector_xpath_caldom_elems, parentWindow);
};

CalDom.prototype = {

	/**
	 * @private
	 * Context window. Set during init. Refer constructor for details.
	 */
	_w: null,
	
	/**
	 * Nodes/Elements of this CalDom instance
	 */
	elems: [],

	/**
	 * @private
	 * Internal init(). Refer CalDom()'s constructor
	 */
	_i: function(selector_xpath_caldom_elems, parentWindow){

		this._w = parentWindow || window;

		if( !!selector_xpath_caldom_elems ){
			if(selector_xpath_caldom_elems instanceof CalDom) this.elems = selector_xpath_caldom_elems.elems;
			else if(typeof selector_xpath_caldom_elems != "string" && selector_xpath_caldom_elems.length != undefined) this.elems = selector_xpath_caldom_elems;
			else if(typeof selector_xpath_caldom_elems == 'object' ) this.elems = [selector_xpath_caldom_elems];
			else this.elems = q(selector_xpath_caldom_elems, this._w.document);
		}

		return this;
	},

	/**
	 * Find matching child elements for all elements in this CalDom instance
	 * @param {String} selector_or_xpath CSS Selector to find or XPath query starting with "$"
	 * @returns {CalDom} A new chainable CalDom instance with found elements.
	 * Note: This could return duplicates when there are inter-connected elements in this CalDom instance.
	 * @example
	 * //Find child elements by the CSS selector
	 * var slide_photos = calDomInstance.find(".slide-photo");
	 * 
	 * //Find child anchor elements with href containing "wikipedia.org" using an XPath query
	 * var wikipedia_links = calDomInstance.find("$./a[contains(＠href, 'wikipedia.org')]");
	 * 
	 * //Find following siblings of a <li> using an XPath query. (Note relative XPath queries starts with './' instead of root '/')
	 * var li_next_siblings = _("#li-id").find("$./following-sibling::li");
	 */
	find: function(selector_or_xpath){
		var _this = this;
		// TODO: Check whether this brings any meaningful performance improvement
		// if( this.elems.length == 1 ) return new CalDom( this._q(selector_or_xpath, this.elems[0]) );

		var output = [];

		this.each(function(elem){
			output.push( Array.prototype.slice.call( q(selector_or_xpath, elem) ) );
		});

		return new CalDom( Array.prototype.concat.apply([], output) );
	},
	
	/**
	 * Get a new CalDom instance with i-th element in this CalDom instance.
	 * @param {number} i Can be a zero-based index or a minus(-i) index from end (Eg: -1 returns last element)
	 * @returns {CalDom} Returns a new CalDom instance with the i-th element
	 * @example
	 * //Get a new CalDom instance for 5th paragraph
	 * var fifth_para = _("p").eq(4);
	 * 
	 * //Get a new Caldom instance for 2nd last paragraph
	 * var second_last_para = _("p").eq(-2); 
	 */
	eq: function(i){
		return new CalDom(this.elems[ i < 0 ? this.elems.length + i : i ]);
	},

	/**
	 * Get a new CalDom instance with nth parent(s) or parent(s) matching the CSS selector.
	 * @param {Number|String} [n_or_match_selector] Default is immediate parent. If a number is given, n-th parent is returned (zero-based). If a string is given, first parent(s) to match the CSS selector is returned.
	 * @returns {CalDom} Returns a new CalDom instance with matched parents. Multiple parents will be returned if there are 2 or more elements in the current CalDom instance.
	 * @throws {TypeError} Throws if Element.matches() is not supported in the browser. Use the pollyfill at {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/matches}
	 * (If this CalDom instance has more than 1 element. Parents of all of them are included.)
	 * @example
	 * //Get a new CalDom instance for immediate parent
	 * var para_parent = _("#para").parent();
	 * 
	 * //Get a new CalDom instance for 2nd-level parent(grand-parent)
	 * var grand_parent = _("#para").parent(1);
	 * 
	 * //Get parents with the class "container" for all img elements
	 * var img_parents = _("img").parent(".container");
	 */
	parent: function(n_or_match_selector){
		var _this = this;
		
		var output = [];

		if( !n_or_match_selector || typeof n_or_match_selector == 'number' ){
			this.each(function(elem){
				var cur_node = elem.parentNode;

				for(var parent_i = 0; parent_i < n_or_match_selector; parent_i++){
					cur_node = cur_node.parentNode;
				}

				output.push( cur_node );
			});
		}
		else{
			this.each(function(elem){
				var cur_node = elem.parentNode;

				var is_document = cur_node == _this._w.document;

				while( !is_document && !cur_node.matches(n_or_match_selector) ){
					cur_node = cur_node.parentNode;
					is_document = cur_node == _this._w.document;
				}

				if( !is_document ) output.push( cur_node );
			});
		}

		return new CalDom( output );
	},

	/**
	 * Get a new CalDom instance with children of all elements in this CalDom instance.
	 * @param {String} [match_selector] (Optional) CSS selector to match
	 * @returns {CalDom} Returns a chainable new CalDom instance with children
	 * @example
	 * 
	 * //Get all children of element with id "container-id"
	 * var container_children = _("#container-id").children();
	 * 
	 * //Get checked elements
	 * var checked_elements = _("#form-id").children(":checked");
	 * 
	 */
	children: function(match_selector){
		var output = [];

		this.each(function(elem){
			for( var i = 0, len = elem.childNodes.length; i < len; i++ ){
				var child = elem.childNodes[i];

				if( !match_selector || (child.matches && child.matches(match_selector)) ) output.push(child);
			}
		});

		return new CalDom( output );
	},

	/**
	 * Iterate each element in this CalDom instance with a callback.
	 * @param {Function} callback Function to callback. Callback is called with 2 arguments: callback(elem: Element, index: Number).
	 * @returns {CalDom} Returns current chainable CalDom instance
	 * @example
	 * //Iterate through all img elements with the class "slide" and log its src
	 * _("img.slide").each( function(elem, i){
	 * 		console.log( i, elem.src );
	 * });
	 */
	each: function(callback){
		for(var i = 0, len = this.elems.length; i < len; i++){
			callback(this.elems[i], i);
		}

		return this;
	},
	/**
	 * Get or set innerHTML of all elements in this CalDom instance. (WARNING: Might lead to XSS vulnerabilities. Use text() if you're only changing text)
	 * @param {String|array} [html_or_html_array] (Optional) A HTML string or an array of HTML strings to set at corresponding n-th element. If empty, an array of innerHTML for all elements in this CalDom instance is returned.
	 * @returns {CalDom|Array} If HTML param is given, current chainable CalDom instance is returned. Otherwise, an array of innerHTML for all elements is returned.
	 * @see text:
	 * @example
	 * //Set HTML code to a DIV element
	 * _("#div-id").html( '<p>Bla Bla</p>' );
	 * 
	 * //Set an array of HTML code to corresponding n-th element with class "container"
	 * _(".container").html( ['<p id="para-1"></p>', '<p id="para-2"></p>'] );
	 * 
	 * //Get HTML code of all h3 elements as an array
	 * var h3_html_array = _("h3").html();
	 */
	html: function(html_or_html_array){
		
		return this.prop("innerHTML", html_or_html_array);

	},

	/**
	 * Get or set textContent of all elements in this CalDom instance.
	 * @param {String|Array} [text] (Optional) Text or an array of text to set at corresponding n-th element. If empty, an array of textContent is returned.
	 * @returns {CalDom|Array} If text param is empty, current chainable CalDom instance is returned. Otherwise, an array of textContent for all elements in this CalDom instance is returned.
	 * @example
	 * //Set text of all anchor elements to "Click Here"
	 * _("a").text("Click Here");
	 * 
	 * //Set an array of text to n-th paragraph with the class "article-content"
	 * _("p.article-content").text( ["Para One", "Para Two"] )
	 * 
	 * //Get an array of text from span elements with the class "caption"
	 * var captions_array = _("span.caption").html();
	 */
	text: function(text_or_text_array){

		return this.prop("textContent", text_or_text_array);

	},

	/**
	 * Get or set value property of elements in this CalDom instance.
	 * @param {*|Array} [val_or_val_array] (Optional) Value or array of values to to be set at corresponding n-th element. If not given, array of values will be returned.
	 * @returns {CalDom|Array} If the value is not given, array of elements' values is returned. Otherwise, this chainable CalDom instance is returned.
	 * @example
	 * 
	 * //Get an value array from all input[type=text] elements
	 * var input_text_array = _('input[type="text"]').val();
	 * 
	 * //Make all password fields empty
	 * _('input[type="password"]').val("");
	 * 
	 * //Set an array of values to n-th input element
	 * _('input[type="text"]').val( ["One", "Two", "Three"] );
	 */
	val: function(val_or_val_array){
		
		return this.prop("value", val_or_val_array);

	},

	/**
	 * Get or set variable(s) at elements' root. Other than assigning custom data of any type at elements' root, this can be used to access all properties/attributes of elements as well.
	 * @param {String|Object} key_path_or_path_array_or_key_values Variable name as a String or { key: value, ...} Object to set multiple variables. To access n-th level variables, use "." Eg: "attributes.type.value"
	 * @param {any|Array} [val_or_val_array] (Optional) Value or an array of values to be to be assigned at the corresponding n-th element. If empty, an array of requested variable's values is returned.
	 * @returns {CalDom|Array} If it's a set request, this chainable CalDom instance is returned. Otherwise, a value array from all elements in this CalDom instance is returned.
	 * 
	 * @example 
	 * //Get custom data
	 * var custom_data_array = _(".class-name").prop("customData");
	 * 
	 * //Set custom data using data() alias (same as usong prop())
	 * _(".class-name").data("customData", someDataObject);
	 * 
	 * //Set click event handler
	 * _("#elem-id").prop("onclick", (e) => { console.log("clicked") }); 
	 * 
	 * //Get an array of textContent.length for all <p> elements
	 * var para_length_array = _("p").prop("textContent.length");
	 * 
	 * //Set an array of custom_data to n-th <p> separately
	 * _("p").prop( "custom_data", [custom_data_one, custom_data_two, null] );
	 * 
	 * //Set multiple variables
	 * _("input").prop({
	 * 		type: "text",
	 * 		value: "Hello World!",
	 * 		custom_data: 44,
	 * 		myDocument: window.document
	 * })
	 * 
	 * Alias data() == prop() To be compatible with previous versions and for drop-in jQuery compatibility
	 * Warning: Look out for untracked circular references that might leads to memory leaks.
	 */
	prop: function(key_path_or_path_array_or_key_values, val_or_val_array){
		
		if( typeof key_path_or_path_array_or_key_values != 'string' ) {

			for(var key in key_path_or_path_array_or_key_values){
				this.each(function(elem){
					elem[key] = key_path_or_path_array_or_key_values[key];
				});
			}

			return this;
		}

		key_path_or_path_array_or_key_values = key_path_or_path_array_or_key_values.split(".");
		var multi_level_key = key_path_or_path_array_or_key_values.length > 1;

		if( !multi_level_key ) key_path_or_path_array_or_key_values = key_path_or_path_array_or_key_values[0];
		
		if( val_or_val_array != undefined ) {
			
			var is_value_array = val_or_val_array instanceof Array;

			if( multi_level_key ){
				if( is_value_array ){
					this.each(function(elem){
						getFinalDestination(elem, key_path_or_path_array_or_key_values)[0] = val_or_val_array[i];
					});
				}
				else{
					this.each(function(){
						var prop_config = getFinalDestination(elem, key_path_or_path_array_or_key_values);
						prop_config[1][ prop_config[0] ] = val_or_val_array;
					});
				}
			}
			else{
				if( is_value_array ){
					this.each(function(elem){
						elem[key_path_or_path_array_or_key_values] = val_or_val_array[i];
					});
				}
				else{
					// this.each(function(){
					// 	this[key_path_or_path_array_or_key_values] = val_or_val_array;
					// }

					this.each(function(elem){
						elem[key_path_or_path_array_or_key_values] = val_or_val_array;
					});
				}
			}
		}
		else {
			var output = [];
			
			if( multi_level_key ){
				this.each(function(elem){
					var prop_config = getFinalDestination(elem, key_path_or_path_array_or_key_values);
					output.push( prop_config[1][prop_config[0]] );
				});
			}
			else{
				this.each(function(elem){
					output.push( elem[key_path_or_path_array_or_key_values] );
				});
			}

			return output;
		}

		return this;
	},

	/**
	 * Alias for prop() to keep compatibility with old versions and for drop-in jQuery compatibility
	 * @see prop()
	 * @deprecated
	 */
	data: function(){
		return this.prop.apply(this, arguments);
	},

	/**
	 * Call a function of each element in this CalDom instance
	 * @param {String} function_path_name Function name or path.to.functionName to call. Eg: "getBoundingClientRect" or "classList.contains"
	 * @param {Array} [args_array] (Optional) An array of arguments to pass to the function
	 * @description Call methods directly if performance is a critical concern. CalDom's unique query/createElement function can be accessed directly using _.q(). Eg: _.q("#container-id") or _.q("+div") or _.q("$//article/p")
	 * @returns {Array} An array of outputs from the called function on each element in this CalDom instance.
	 * @example
	 * 
	 * //Get an array of getBoundingClientRect() for all <div> tags
	 * var bounding_rects = _("div").call("getBoundingClientRect");
	 * 
	 * //Check whether text input tags contain the "error" class
	 * var contain_error_array = _("input[type=text]").call( "classList.contains", ["error"] )
	 */
	call: function(function_name_or_path_array, args_array){
		function_name_or_path_array = function_name_or_path_array.split(".");

		var output = [];

		if( function_name_or_path_array.length > 1 ){
			this.each(function(elem){
				var caller_config = getFinalDestination(elem, function_name_or_path_array);
				output.push( caller_config[1][caller_config[0]].apply( caller_config[1], args_array ) )
			});
		}
		else{
			this.each(function(elem){
				output.push( elem[function_name_or_path_array[0]].apply( elem, args_array ) )
			});
		}

		return output;
	},

	/**
	 * Get or set attribute(s) of elements in this CalDom instance.
	 * @param {String|Object} key_or_key_values Attribute name as a String or { key: value, ...} object to set multiple attributes
	 * @param {any|Array} [val_or_val_array] (Optional) Value or array of values to to be assigned at corresponding n-th element. If empty, array of attribute values will be returned.
	 * @returns {CalDom|Array} If it's a set request, this CalDom instance is returned for chaining. Otherwise, a attribute value array from all elements in this CalDom instance is returned.
	 * @example 
	 * //Set scrolling attribute of all iframes
	 * _("iframe").attr("scrolling", "no");
	 *
	 * //Get an array of href attribute from all <a> tags
	 * var links_array = _("a").attr("href");
	 *  
	 * //Set width and height of <img> with id "img-id"
	 * _("#img-id").attr({
	 * 	width: 400,
	 * 	height: 300
	 * });
	 * 
	 * //Set an array of type attribute to n-th input elements
	 * _("input").attr( "type", ["text", "password", "date"] );
	 */
	attr: function(key_or_key_values, val_or_val_array){

		if( typeof key_or_key_values != 'string' ) {
			for(var key in key_or_key_values){
				this.each(function(elem){
					elem.setAttribute( key, key_or_key_values[key] );
				});
			}

			return this;
		}

		if(arguments.length == 2) {
			
			if( val_or_val_array instanceof Array ){
				this.each(function(elem){
					elem.setAttribute(key_or_key_values, val_or_val_array[i]);
				});
			}
			else{
				this.each(function(elem){
					elem.setAttribute(key_or_key_values, val_or_val_array);
				});
			}
		}
		else {
			var output = [];
	
			this.each(function(elem){
				output.push( elem.getAttribute(key_or_key_values) );
			});

			return output;
		}

		return this;
	},

	/**
	 * Set CSS style rule(s) to elements in this CalDom instance
	 * @param {String|Object} key_or_key_values CSS property name or { Property: Value, ... } object to set multiple rules
	 * @param {*} val Value
	 * @returns {CalDom} Returns this chainable CalDom instance
	 * @example
	 * 
	 * //Set one rule
	 * _(".class-name").css("background-color", "blue");
	 * 
	 * //Set multiple rules
	 * _("#div-id").css({
	 * 	backgroundColor: "red",
	 * 	"font-size": "2em"
	 * });
	 */
	css: function(key_or_key_values, val){

		if(typeof val != 'undefined'){
			this.each(function(elem){
				elem.style[key_or_key_values] = val;
			});
		}
		else{
			var style_set = key_or_key_values; //Key to be a css rules array

			for(var key in style_set){
				this.each(function(elem){
					elem.style[key] = style_set[key];
				});
			}
		}

		return this;
	},

	/**
	 * Add event listeners to elements in this CalDom instance.
	 * @param {String} event_name(s) A single event name or multiple event names separated by spaces. 
	 * @param {Function} handler Callback
	 * @param {*} [options] (Optional) options to pass into addEventListener's 3rd param
	 * @returns {CalDom} Returns this chainable CalDom instance
	 * @example
	 * //Add a click event listener
	 * _("div-id").on("click", (e) => { console.log("clicked") });
	 * 
	 * //Add mousemove and touchmove event listeners
	 * _("div-id").on("mousemove touchmove", moveHandler);
	 */
	on: function(event_names, handler, options){
		var events = event_names.split(" ");

		for( var event_i = 0, events_len = events.length; event_i < events_len; event_i++ ){
			this.each(function(elem){
				elem.addEventListener(events[event_i], handler, options);
			});
		}

		return this;
	},

	/**
	 * Remove event listeners to elements in this CalDom instance.
	 * @param {String} event_name(s) A single event name or multiple event names separated by spaces. 
	 * @param {Function} handler Callback. The same callback provided at on() or Node.addEventListener should be provided.
	 * @param {*} [options] (Optional) options to pass into removeEventListener's 3rd param
	 * @returns {CalDom} Returns this chainable CalDom instance
	 * @example
	 * //Remove click event listener
	 * _("div-id").off("click", clickEventHandler);
	 * 
	 * //Add mousemove and touchmove event listeners
	 * _("div-id").off("mousemove touchmove", moveHandler);
	 */
	off: function(event_names, handler, options){
		var events = event_names.split(" ");

		for( var event_i = 0, events_len = events.length; event_i < events_len; event_i++ ){
			this.each(function(elem){
				elem.removeEventListener(events[event_i], handler, options);
			});
		}

		return this;
	},

	/**
	 * Add class name(s) to elements in this CalDom instance
	 * @param {String} class_names A single class name or multiple class names separated by spaces.
	 * @returns {CalDom} Returns this chainable CalDom instance
	 * @example
	 * 
	 * //Add a single class
	 * _("#container").addClass("wide-view");
	 * 
	 * //Add multiple classes
	 * _("#container").addClass("visible dark-theme narrow");
	 */
	addClass: function(class_names){
		var classes = class_names.split(" ");

		this.each(function(elem){
			for( var class_i = 0, class_len = classes.length; class_i < class_len; class_i++ ){
				elem.classList.add(classes[class_i]);
			}
		});

		return this;
	},

	/**
	 * Remove class name(s) from elements in this CalDom instance
	 * @param {String} class_names A single class name or multiple class names separated by spaces.
	 * @returns {CalDom} Returns this chainable CalDom instance
	 * @example
	 * 
	 * //Remove a single class
	 * _("#container").removeClass("visible");
	 * 
	 * //Remove multiple classes
	 * _("#container").removeClass("dark-theme narrow");
	 */
	removeClass: function(class_names){
		var classes = class_names.split(" ");

		for( var class_i = 0, class_len = classes.length; class_i < class_len; class_i++ ){
			this.each(function(elem){
				elem.classList.remove(classes[class_i]);
			});
		}

		return this;
	},

	/**
	 * Append/Move elements to first element of this CalDom instance or append to all the elements by passing a generator function. This is a wrapper around elem.appendChild()
	 * @param {Node|CalDom|Array|NodeList|HTMLCollection|Function} element_or_elements_or_caldom_or_generator First argument can be a CalDom instance, a Node or an array of Nodes or a generator function that returns a new Element. 
	 * Items are added to the first element of this CalDom instance. Generated item is added to all elements in this CalDom instance. 
	 * Generator receives corresponding parent_node and parent_index as arguments.
	 * @param {Node|CalDom|Array|NodeList|HTMLCollection} [...args] If the first argument is not an array-type, all ...arguments are added to the first element of this CalDom instance. 
	 * @description Null and undefined inputs are silently ignored. Note that if you append an existing element, it is moved to the new destination (not cloning).
	 * @returns {CalDom} Returns this chainable CalDom instance
	 * @example
	 * 
	 * //Append a new <div> and created by CalDom <body>
	 * _("body").append( _("+div") );
	 * 
	 * //Append multiple elements, a nested set of elements created by CalDom, a single Node and an array of Nodes to element with id "container-id"
	 * _("#container-id").append(
	 * 		_("+div")
	 * 			.append( "+p").text("Paragraph inside the div.")),
	 * 
	 * 		_("p").text("Paragraph outside the div"),
	 * 		
	 * 		document.createElement("img"),
	 * 
	 * 		null, undefined,
	 * 		
	 * 		document.createElement("canvas")
	 * );
	 * 
	 * //Append Node to <body>
	 * _("body").append( document.createElement("div") );
	 * 
	 * //Append an array of Nodes and CalDom instances to <body>
	 * _("body").append( [document.createElement("div"), _("+h1"), document.createElement("p")] );
	 * 
	 * //Move <p> elements from "container-id-a" to "container-id-b"
	 * _("#container-id-b").append( _("#container-id-a p") );
	 * 
	 * //Append new elements using a generator function to all elements in this CalDom instance
	 * _("#container-one").append( function(parent_node, parent_index){
	 * 		return _("+div").text("I'm inside parent: " + parent_index);
	 * });
	 * 
	 */
	append: function(element_or_elements_or_caldom_or_generator){
		return insertBefore.call(this, element_or_elements_or_caldom_or_generator instanceof Array ? element_or_elements_or_caldom_or_generator : arguments, null);
	},

	/**
	 * Prepend/Move elements to the first element of this CalDom instance or prepend to all the elements by passing a generator function. This is a wrapper around elem.insertBefore()
	 * @param {Node|CalDom|Array|NodeList|HTMLCollection|Function} element_or_elements_or_caldom_or_generator First argument can be a CalDom instance, a Node or an array of Nodes or a generator function that returns a new Element. 
	 * Items are prepend to the first element of this CalDom instance. Generated item is prepends to all elements in this CalDom instance. 
	 * Generator receives corresponding parent_node and parent_index as arguments.
	 * @param {Node|CalDom} [before_elem_or_caldom] (Optional) If provided, items are inserted before this element instead before the firstChild.
	 * @description Null and undefined inputs are silently ignored. Note that if you prepend an existing element, it is moved to the new destination (not cloning).
	 * @returns {CalDom} Returns this chainable CalDom instance
	 * @example
	 * 
	 * //Prepend a new <p> element as the first child
	 * _("#container-id").prepend( _("+p").text("I'm first child now.") );
	 * 
	 * //Prepend a new <p> element before the 3rd paragraph in the container
	 * _("#container-id").prepend( _("+p").text("I'm 3rd paragraph"), _("#container-id p").eq(2) );
	 * 
	 * //Prepend an array of Nodes and CalDom instances to <body>
	 * _("body").prepend( [document.createElement("div"), _("+h1"), document.createElement("p")] );
	 * 
	 * //Move and prepend <p> elements from "container-id-a" to "container-id-b" before its 2nd <img>
	 * _("#container-id-b").append( _("#container-id-a p"), _("#container-id-b img").eq(1) );
	 * 
	 * //Prepend new elements using a generator function to all elements in this CalDom instance
	 * _("#container-one").append( function(parent_index, parent_node){
	 * 		return _("+div").text("I'm inside parent: " + parent_index);
	 * });
	 */
	prepend: function(element_or_elements_or_caldom_or_generator, before_elem_or_caldom){
		return insertBefore.call(this, element_or_elements_or_caldom_or_generator instanceof Array ? element_or_elements_or_caldom_or_generator : [element_or_elements_or_caldom_or_generator], before_elem_or_caldom);
	},

	/**
	 * Remove all elements of this CalDom instance from the DOM.
	 * @returns {CalDom} Returns this empty chainable CalDom instance
	 */
	remove: function(){
		this.each(function(elem){
			elem.parentNode.removeChild(elem);
		});

		this.elems = []

		return this;
	}

};

//Disabled because for-loop seems to be faster;

// if( Array.prototype.forEach ){
// 	CalDom.prototype.each = function(callback){
// 		this.elems.forEach(callback);

// 		return this;
// 	}
// }

var calDom = function(query, w){
	return new CalDom( query, w );
};

//Attachging q() directly, so it can be accessed without initiating a new CalDom instance. Eg: _.q("#container-id") or _.q("+div") or _.q("$//article/p")
calDom.q = q;

var _global = this || window;

if( _global.module && module.exports ){
	module.exports = calDom;
}
else if( _global.define ){
	define(function(){
		return calDom;
	});
}
else{

	//Attaching CalDom to window/global using declared separator

	var alias = _global["_caldom_alias"] || "_";

	// if( _global[alias] ){
	// 	throw("_ is taken."); // CalDom is using '_' variable as a global short-hand by default. To use a different alias, define window['_cal_dom_alias'] = 'different_alias' before loading CalDom.
	// }

	_global[alias] = calDom;
}

return calDom;

})();