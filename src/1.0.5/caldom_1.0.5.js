/*
 * CalDom 1.0.5 - Reactive
 * Copyright (c) 2020 Dumi Jay
 * Released under the MIT license - https://github.com/dumijay/CalDom/
 */

// Uncomment below line to support ES6 module import/export.
// export default

(function(){

var _window = window;
var _array_prototype = Array.prototype;
var _slice = _array_prototype.slice;

var _node_prototype = _window.Node.prototype;
var _insertFunc_appendChild = _node_prototype.appendChild;
var _insertFunc_insertBefore = _node_prototype.insertBefore;

//RequstAnimationFrame polyfill
var requestAnimationFramePolyfill = _window.requestAnimationFrame
	|| _window.webkitRequestAnimationFrame
	|| _window.mozRequestAnimationFrame
	|| function(callback){
		return setTimeout( callback, 1000 / 60);
	}
//_window.Element.prototype.matches polyfill
_window.Element.prototype.matches = _window.Element.prototype.matches
	|| _window.Element.prototype.webkitMatchesSelector
	|| _window.Element.prototype.mozkitMatchesSelector
	|| _window.Element.prototype.msMatchesSelector
	|| _window.Element.prototype.oMatchesSelector;

/**
 * @category Initiate
 * @constructor
 * @title _( query_or_elems )
 * @description Initiates a CalDom instance.
 * @param {String | CalDom | Node | Array<Node> | NodeList | HTMLCollection} [query_or_elems] (Optional) "+tag" creates a new Element.
 * '<tag></tag>' creates specified HTML structure. "~svg_tag" creates a SVG element.
 * Otherwise, it can be a CSS Selector, an XPath query starting with "$", a CalDom instance, a single Node/Element, an array of Nodes or a NodeList/HTMLCollection.
 * @param {Array<CalDom | Node | String>} [children_array] (Optional) Array of child elements to be passed into append(). Can be CalDom/Node/String/HTML. See append() for all possibilities.
 * This might be useful for code-clarity at render() function for reactive components. See examples at react().
 * @param {Window} [parentWindow=window] (Optional) parent_window default to current window. Use this to work with iframes or external windows.
 * @returns {CalDom} A new CalDom instance with created/found elements.
 * @example
 * //Create a new password input element with a placeholder
 * var passwordInput = _("+input")
 * 		.attr({
 * 			type: "password",
 * 			placeholder: "Enter your password"
 * 		});
 *
 * //Create a password input element using full HTML syntax
 * var passwordInput = _( '<input type="password" placeholder="Type your password here" />' );
 *
 * //Create a new SVG element
 * var svgRectangle = _("~rect")
 * 		.attr({
 * 			width: 100,
 * 			height: 100
 * 		});
 *
 * //Get element by ID using CSS Selector
 * var container = _("#container-id");
 *
 * //Find anchor elements inside <article> with href containing "wikipedia.org" using an XPath query
 * var wikipedia_links = _("$//article/a[contains(＠href, 'wikipedia.org')]");
 *
 * //Create a CalDom instance with a single Node
 * var container = _( document.body.children[3] );
 *
 * //Create a CalDom instance with a NodeList or array of Nodes
 * var bodyChildren = _(document.body.childNodes);
 *
 * //Create a new DIV element and provide an array of children as the 2nd argument.
 * //CalDom accepts a wide variety of input types as children. See append() for all possibilities.
 * var something = _(
 * 		"+div",
 * 		[
 * 			document.createElement("h1"), //Node
 *
 * 			_("+p").text("I'm a paragraph inside DIV."), //CalDom
 *
 * 			'<img width="120" height="120" src="something.png" />', //HTML syntax
 *
 * 			"Text Node inside DIV"
 * 		]
 * );
 */
var CalDom = function(query_or_elems, children_array, parentWindow){
	this._i(query_or_elems, children_array, parentWindow);
};

CalDom.prototype = {

	/**
	 * @private
	 * @description Context window. Set during init. Refer CalDom's constructor for details.
	 */
	"_w": null,

	/**
	 * @title elems: Array<Node>
	 * @description Nodes/Elements of this CalDom instance
	 * @example
	 *
	 * //Get 3rd img element (zero-based index)
	 * var third_img_elem = _("img").elems[2];
	 */
	"elems": [],

	/**
	 * @title watched: Boolean
	 * @description Whether state changes are monitored in the reactive mode. See react() for details.
	 */
	"watched": undefined,

	/**
	 * @private
	 * @description Internal init(). Refer CalDom's constructor
	 */
	_i: function(selector_xpath_caldom_elems, children_array, parentWindow){

		this._w = parentWindow || window;

		if( !!selector_xpath_caldom_elems ){
			if(selector_xpath_caldom_elems instanceof CalDom){
				this.elems = selector_xpath_caldom_elems.elems;
			}
			else if(typeof selector_xpath_caldom_elems != "string"
				&& selector_xpath_caldom_elems.length != undefined
				&& !(selector_xpath_caldom_elems instanceof Node) //Because <select> has a length property 🤷‍♂️
				){
					this.elems = selector_xpath_caldom_elems;
			}
			else if(typeof selector_xpath_caldom_elems == 'object' ){
				this.elems = [selector_xpath_caldom_elems];
			}
			else{
				this.elems = q(selector_xpath_caldom_elems, this._w.document);
			}
		}

		if( children_array instanceof Array ) insertBefore.call( this, children_array, null, _insertFunc_appendChild );

		return this;
	},

	/**
	 * @category Traverse
	 * @description Get a new CalDom instance with matching descendent elements for all elements in this CalDom instance.
	 * Note: This could return duplicates when there are inter-connected elements in this CalDom instance.
	 * @param {String} selector_or_xpath CSS Selector to find or XPath query starting with "$"
	 * @returns {CalDom} A new CalDom instance with found elements.
	 * @example
	 * //Find child elements by the CSS selector
	 * var slide_photos = calDomInstance.find(".slide-photo");
	 *
	 * //Find child anchor elements with href containing "wikipedia.org" using an XPath query.
	 * //(Note relative XPath queries starts with './' instead of root '/')
	 * var wikipedia_links = calDomInstance.find("$./a[contains(＠href, 'wikipedia.org')]");
	 *
	 * //Find following siblings of a <li> using an XPath query.
	 * var li_next_siblings = _("#li-id").find("$./following-sibling::li");
	 */
	"find": function(selector_or_xpath){
		var _this = this;
		// TODO: Check whether this brings any meaningful performance improvement
		// if( this.elems.length == 1 ) return new CalDom( this._q(selector_or_xpath, this.elems[0]) );

		var output = this.map(function(elem){
			return _slice.call( q(selector_or_xpath, elem) );
		});

		return new CalDom( _array_prototype.concat.apply([], output), null, this._w );
	},

	/**
	 * @category Traverse
	 * @description Get a new CalDom instance with i-th element in this CalDom instance.
	 * @param {Number} index Can be a zero-based index or a minus(-i) index from end (Eg: -1 returns last element)
	 * @returns {CalDom} A new CalDom instance with the i-th element
	 * @example
	 * //Get a new CalDom instance for 5th paragraph
	 * var fifth_para = _("p").eq(4);
	 *
	 * //Get a new Caldom instance for 2nd last paragraph
	 * var second_last_para = _("p").eq(-2);
	 */
	"eq": function(index){
		return new CalDom( this.elems[ index < 0 ? this.elems.length + index : index ], null, this._w );
	},

	/**
	 * @category Traverse
	 * @description Get a new CalDom instance with immediate parent(s) or n-th parent(s) or parent(s) matching the CSS selector. (If this CalDom instance has more than 1 element, parents of all of them are included.)
	 * @param {Number | String} [n_or_selector] (Optional) Default is immediate parent. If a number is given, n-th parent is returned (zero-based). If a string is given, first parent(s) to match the CSS selector is returned.
	 * @returns {CalDom} A new CalDom instance with matched parents. Multiple parents will be returned if there are 2 or more elements in this CalDom instance.
	 * @throws {TypeError} Throws if Element.matches() is not supported in the browser. Use the polyfill at https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
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
	"parent": function(n_or_selector){
		var _this = this;

		var output = [];

		if( !n_or_selector || typeof n_or_selector == 'number' ){
			this.each(function(elem){
				var cur_node = elem.parentNode;

				for(var parent_i = 0; parent_i < n_or_selector; parent_i++){
					cur_node = cur_node.parentNode;
				}

				output.push( cur_node );
			});
		}
		else{
			this.each(function(elem){
				var cur_node = elem.parentNode;

				var is_document = cur_node == _this._w.document;

				while( !is_document && !cur_node.matches(n_or_selector) ){
					cur_node = cur_node.parentNode;
					is_document = cur_node == _this._w.document;
				}

				if( !is_document ) output.push( cur_node );
			});
		}

		return new CalDom( output, null, this._w );
	},

	/**
	 * @category Traverse
	 * @description Get a new CalDom instance with children of all elements in this CalDom instance. (If this CalDom instance has more than 1 element, children of all of them are included.)
	 * @param {String} [match_selector] (Optional) CSS selector to match
	 * @throws {TypeError} Throws if Element.matches() is not supported in the browser. Use the polyfill at https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
	 * @returns {CalDom} A new CalDom instance with children.
	 * @example
	 *
	 * //Get all children of element with id "container-id"
	 * var container_children = _("#container-id").children();
	 *
	 * //Get checked elements
	 * var checked_elements = _("#form-id").children(":checked");
	 */
	"children": function(match_selector){
		var output = [];

		this.each(function(elem){
			var children = _slice.call( elem.childNodes ); //Because NodeList enumeration is damn slow \_/ https://jsben.ch/1HYYe

			for( var i = 0, len = children.length; i < len; i++ ){
				var child = children[i];

				if( !match_selector || (child.matches && child.matches(match_selector)) ) output.push(child);
			}
		});

		return new CalDom( output, null, this._w );
	},

	/**
	 * @category Iterate
	 * @description Iterate each element in this CalDom instance with a callback.
	 * @param {Function} callback Function to callback. Callback is called with 2 arguments: callback(elem: Node, index: Number). The enumeration stops if the callback returns false.
	 * @returns {CalDom} Returns current CalDom instance
	 * @example
	 * //Iterate through all img elements with the class "slide" and log its index and src
	 * _("img.slide").each( function(elem, i){
	 * 		console.log( i, elem.src );
	 * });
	 */
	"each": function(callback){

		for(var i = 0, len = this.elems.length; i < len; i++){
			if( callback.call(this.elems[i], this.elems[i], i) === false ) break;
		}

		return this;
	},

	/**
	 * @category Iterate
	 * @description Iterate each element in this CalDom instance with a callback and get an array of callback's returned values.
	 * @param {Function} callback Function to callback. Callback is called with 2 arguments: callback(elem: Node, index: Number).
	 * @returns {Array} An array of values returned by the callback.
	 * @example
	 * //Get value length of text input elements
	 * var lengths = _("input[type=text]")
	 * 		.map( function(elem, i) {
	 * 			return elem.value.length;
	 * 		})
	 */
	 "map": function(callback){
		var output = [];

		for(var i = 0, len = this.elems.length; i < len; i++){
			output.push( callback(this.elems[i], i) );
		}

		return output;
	},

	/**
	 * @category Manipulate/Retrieve Content
	 * @description Get or set innerHTML of all elements in this CalDom instance.
	 * (WARNING: This might lead to XSS vulnerabilities. Use text() if you're only updating text)
	 * @param {String | Array<String>} [html_or_html_array] (Optional) A HTML string or an array of HTML strings to set at corresponding n-th element.
	 * If not given, an array of innerHTML for all elements in this CalDom instance is returned.
	 * @returns { CalDom | Array<String> } If html_or_html_array param is given, current CalDom instance is returned.
	 * Otherwise, an array of innerHTML from all elements in this CalDom instance is returned.
	 * @example
	 * //Set HTML code to a DIV element
	 * _("#div-id").html( '<p>Bla Bla</p>' );
	 *
	 * //Set an array of HTML code to corresponding n-th element
	 * _(".container").html( ['<p id="para-1"></p>', '<p id="para-2"></p>'] );
	 *
	 * //Get HTML code of all h3 elements as an array
	 * var h3_html_array = _("h3").html();
	 */
	"html": function(html_or_html_array){

		// TODO: Make this direct for performance
		return this.prop("innerHTML", html_or_html_array, true);

	},

	/**
	 * @category Manipulate/Retrieve Content
	 * @description Get or set textContent of all elements in this CalDom instance.
	 * @param {String | Array<String>} [text_or_text_array] (Optional) Text or an array of text to set at corresponding n-th element.
	 * If not given, an array of textContent is returned.
	 * @returns { CalDom | Array<String> } If text_or_text_array is given, current CalDom instance is returned.
	 * Otherwise, an array of textContent from all elements in this CalDom instance is returned.
	 * @example
	 * //Set text of all anchor elements to "Click Here"
	 * _("a").text("Click Here");
	 *
	 * //Set an array of text to n-th paragraph
	 * _("p").text( ["Para One", "Para Two"] )
	 *
	 * //Get an array of text from span elements with the class "caption"
	 * var captions_array = _("span.caption").text();
	 */
	"text": function(text_or_text_array){

		// TODO: Make this direct for performance
		return this.prop("textContent", text_or_text_array, true);

	},

	/**
	 * @category Manipulate/Retrieve Content
	 * @description Get or set value property of elements in this CalDom instance.
	 * @param {String | Number | Array<String | Number>} [val_or_val_array] (Optional) Value or array of values to to be set at corresponding n-th element.
	 * If not given, array of values will be returned.
	 * @returns { CalDom | Array<String> } If val_or_val_array is given, current CalDom instance is returned.
	 * Otherwise, array of value from all elements in this CalDom instance is returned.
	 * @example
	 *
	 * //Get an value array from all text input elements
	 * var input_text_array = _('input[type="text"]').val();
	 *
	 * //Make all password fields empty
	 * _('input[type="password"]').val("");
	 *
	 * //Set an array of values to n-th input element
	 * _('input[type="text"]').val( ["One", "Two", "Three"] );
	 */
	"val": function(val_or_val_array){

		// TODO: Make this direct for performance
		return this.prop("value", val_or_val_array, true);

	},

	/**
	 * @category Manipulate/Retrieve Content
	 * @description Get or set attribute(s) of elements in this CalDom instance.
	 * @param {String | Object} key_or_key_values Attribute name as a String or { key: value, ... } object to set multiple attributes
	 * @param {any | Array<String | Number>} [val_or_val_array] (Optional) Value or array of values to be assigned at corresponding n-th element.
	 * If not given, an array of attribute values for the given key is returned.
	 * @returns { CalDom | Array<String | Number> } If it's a set request, current CalDom instance is returned.
	 * Otherwise, an attribute value array from all elements in this CalDom instance is returned.
	 * @example
	 * //Set scrolling attribute of all iframes
	 * _("iframe").attr("scrolling", "no");
	 *
	 * //Get an array of href attribute from all <a> tags
	 * var links_array = _("a").attr("href");
	 *
	 * //Set width and height of img elements
	 * _("img").attr({
	 * 	width: 400,
	 * 	height: 300
	 * });
	 *
	 * //Set an array of type attribute to n-th input elements
	 * _("input").attr( "type", ["text", "password", "date"] );
	 */
	 "attr": function(key_or_key_values, val_or_val_array){

		if( typeof key_or_key_values != 'string' ) {
			this.each(function(elem){
				for(var key in key_or_key_values){
					elem.setAttribute( key, key_or_key_values[key] );
				}
			});
		}
		else if(arguments.length == 2) {

			if( val_or_val_array instanceof Array ){
				this.each(function(elem, i){
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

			return this.map(function(elem){
				return elem.getAttribute(key_or_key_values);
			});

		}

		return this;
	},

	/**
	 * @category Manipulate/Retrieve Content
	 * @description Get or set variable(s) at elements' root. Other than assigning custom data of any type at elements' root, this can be used to access all properties/attributes of elements as well.
	 * Warning: Look out for untracked circular references that might lead to memory leaks.
	 * @param {String | Object} key_or_key_values Variable name as a String or { key: value, ... } object to set multiple variables.
	 * @param {any | Array} [val_or_val_array] (Optional) Value or an array of values to be to be assigned at the corresponding n-th element. If empty, an array of given key's values is returned.
	 * @returns {CalDom | Array} If it's a set request, this chainable CalDom instance is returned.
	 * Otherwise, a value array from all elements in this CalDom instance is returned.
	 * @example
	 * //Get custom data
	 * var custom_data_array = _(".class-name").prop("customData");
	 *
	 * //Set click event handler
	 * _("#elem-id").prop("onclick", (e) => { console.log("clicked") });
	 *
	 * //Set an array of custom_data to n-th <p> separately
	 * _("p").prop( "custom_data", [custom_data_one, custom_data_two, null] );
	 *
	 * //Set multiple variables
	 * _("input").prop({
	 * 		type: "text",
	 * 		value: "Hello World!",
	 * 		custom_data: 44,
	 * 		other_data: { name: "Jane" }
	 * });
	 */

	"prop": function(key_or_key_values, val_or_val_array, _is_internal_call){

		if( !_is_internal_call && typeof key_or_key_values != 'string' ) {

			this.each(function(elem){
				for(var key in key_or_key_values){
					elem[key] = key_or_key_values[key];
				}
			});
		}
		else if( val_or_val_array != undefined ) {

			if( val_or_val_array instanceof Array ){
				this.each(function(elem, i){
					elem[key_or_key_values] = val_or_val_array[i];
				});
			}
			else{
				this.each(function(elem){
					elem[key_or_key_values] = val_or_val_array;
				});
			}
		}
		else {

			return this.map(function(elem){
				return elem[key_or_key_values];
			});
		}

		return this;
	},

	/**
	 * @category Manipulate/Retrieve Content
	 * @description Store & retrieve { key: value, ... } data from elements in this CalDom instance.
	 * (Data is stored at element._data. However, _data location might change over time, avoid accessing it directly as possible.)
	 * Warning: Look out for untracked circular references that might lead to memory leaks.
	 * @param {Object} key Can be any javascript Object, usually a string.
	 * @param {any | Array} [value] (Optional) Can be any javascript Object or an array of Objects to be to be assigned at the corresponding n-th element.
	 * @returns If it's a set request, this CalDom instance is returned.
	 * Otherwise, an array of values for the provided key from all elements is returned.
	 */
	"data": function(key, value){

		if( value == undefined ){
			var output = [];

			this.each(function(elem){
				if( elem["_data"] ) output.push( elem["_data"][key] );
			});

			return output;
		}
		else{

			if( value instanceof Array ){
				this.each(function(elem, i){
					if( !elem["_data"] ) elem["_data"] = {};
					elem["_data"][key] = value[i];
				});
			}
			else{
				this.each(function(elem){
					if( !elem["_data"] ) elem["_data"] = {};
					elem["_data"][key] = value;
				});
			}

			return this;
		}
	},

	/**
	 * @category CSS Styling
	 * @description Get & set CSS style rule(s) of elements in this CalDom instance.
	 * @param {String | Object} key_or_key_values CSS property name or { property: value, ... } object to set multiple rules
	 * @param {String | Number | Array<String | Number>} val_or_val_array CSS value or an array of values to be set at n-th element for the given CSS property name.
	 * @returns {CalDom | Array<String | Number>} If it's a set request, this CalDom instance is returned.
	 * Otherwise, a CSS value array for the given property from all elements in this CalDom instance is returned.
	 * @example
	 *
	 * //Set one rule
	 * _(".class-name").css("background-color", "blue");
	 *
	 * //Set multiple rules
	 * _("#div-id").css({
	 * 		backgroundColor: "red",
	 * 		"font-size": "2em"
	 * });
	 *
	 * //Set CSS value using an array for n-th element
	 * _(".box")
	 * 	.css( "background-color", [ "red", "yello", "#555"] );
	 *
	 * //Get CSS value
	 * var rule_value = _("#something").css("display")[0];
	 */
	 "css": function(key_or_key_values, val_or_val_array){

		if( typeof key_or_key_values != 'string' ) {

			this.each(function(elem){
				for(var key in key_or_key_values){
					elem.style[key] = key_or_key_values[key];
				}
			});
		}
		else if( val_or_val_array != undefined ) {

			if( val_or_val_array instanceof Array ){
				this.each(function(elem, i){
					elem.style[key_or_key_values] = val_or_val_array[i];
				});
			}
			else{
				this.each(function(elem){
					elem.style[key_or_key_values] = val_or_val_array;
				});
			}
		}
		else {

			return this.map(function(elem){
				return elem.style[key_or_key_values];
			});
		}

		return this;
	},

	/**
	 * @category CSS Styling
	 * @description Add class name(s) to elements in this CalDom instance.
	 * @param {String} class_names An array of class names or single/multiple classnames passed as a string seperated by spaces.
	 * @returns {CalDom} Returns this CalDom instance.
	 * @example
	 *
	 * //Add a single class
	 * _("#container").addClass("wide-view");
	 * _("#container").addClass(['wide-view]);
	 *
	 * //Add multiple classes
	 * _("#container").addClass("visible dark-theme narrow");
	 * _("#container").addClass(["visible","dark-theme","narrow");
	 *
	 */

	 "addClass": function(class_names){
		if (Array.isArray(class_names)) {
			var classes = class_names;
		} else {
			var classes = class_names.split(" ");
		}

		this.each(function(elem){
			elem.classList.add(...classes);
		});

		return this;
	},

	/**
	 * @category CSS Styling
	 * @description Remove class name(s) from elements in this CalDom instance.
	 * @param {String} class_names An array of class names or single/multiple classnames passed as a string seperated by spaces.
	 * @returns {CalDom} Returns this CalDom instance.
	 * @example
	 *
	 * //Remove a single class
	 * _("#container").removeClass("visible");
	 * _("#container").removeClass(["visible"]);
	 *
	 * //Remove multiple classes
	 * _("#container").removeClass("dark-theme narrow");
	 * _("#container").removeClass(["dark-theme","narrow"]`);
	 */

	"removeClass": function(class_names){
		if (Array.isArray(class_names)) {
			var classes = class_names;
		} else {
			var classes = class_names.split(" ");
		}

		this.each(function(elem){
			elem.classList.remove(...classes);
		});

		return this;
	},

	/**
	 * @category CSS Styling
	 * @description Set display CSS property of all elements in this CalDom instance.
	 * @param {String} [display_value] (optional) Display value. Default to "block"
	 * @returns {CalDom} Returns this CalDom instance.
	 * @example
	 *
	 * //Set CSS display property of #container to "block"
	 * _("#container").show();
	 *
	 * //Set CSS display property of #gallery to "flex"
	 * _("#gallery").show("flex");
	 */
	"show": function(display_value){
		return this.each(function(elem){
			elem.style.display = display_value || "block";
		});
	},

	/**
	 * @category CSS Styling
	 * @description Set display CSS property of all elements in this CalDom instance to "None".
	 * @returns {CalDom} Returns this CalDom instance.
	 * @example
	 *
	 * //Set CSS display property of #container to "none"
	 * _("#container").hide();
	 */
	"hide": function(){
		return this.each(function(elem){
			elem.style.display = "none";
		});
	},

	/**
	 * @category Event Handling
	 * @description Add event listeners to elements in this CalDom instance.
	 * @param {String} event_names A single event name or multiple event names separated by spaces or an array of events.
	 * @param {Function} handler Callback function to handle the event. (Same as addEventListener(), this is just a wrapper it).
	 * @param {any} [options] (Optional) options to pass into addEventListener's 3rd param.
	 * @returns {CalDom} Returns this CalDom instance.
	 * @example
	 * //Add a click event listener
	 * _("div-id").on( "click", function(e){ console.log("clicked") } );
	 * _("div-id").on( ["click"], function(e){ console.log("clicked") } );
	 *
	 *
	 * //Add mousemove and touchmove event listeners
	 * _("div-id").on("mousemove touchmove", moveHandler);
	 * _("div-id").on(["mousemove", "touchmove"], moveHandler);
	 *
	 */
	"on": function(event_names, handler, options){
		if (Array.isArray(event_names)) {
			var events = event_names;
		} else {
			var events = event_names.split(" ");
		}

		events.forEach((event) => {
			this.each(function(elem){
				elem.addEventListener(event, handler, options);
			});
		});

		return this;
	},

	/**
	 * @category Event Handling
	 * @description Remove event listeners from elements in this CalDom instance.
	 * @param {String} event_names A single event name or multiple event names separated by spaces.
	 * @param {Function} handler Callback. The same callback provided at on() or Node.addEventListener() should be provided.
	 * @param {any} [options] (Optional) options to pass into removeEventListener's 3rd param.
	 * @returns {CalDom} Returns this CalDom instance.
	 * @example
	 * //Remove click event listener
	 * _("div-id").off("click", clickEven-thandler);
	 *
	 * //Remove mousemove and touchmove event listeners
	 * _("div-id").off("mousemove touchmove", moveHandler);
	 */
	"off": function(event_names, handler, options){
		if (Array.isArray(event_names)) {
			var events = event_names;
		} else {
			var events = event_names.split(" ");
		}

		events.forEach((event) => {
			this.each(function(elem){
				elem.removeEventListener(event, handler, options);
			});
		})

		return this;
	},

	/**
	 * @category Manipulate DOM Tree
	 * @title append( elems_caldom_generator, ...elems )
	 * @description Append/Move elements to first element of this CalDom instance or append to all the elements by passing a generator function.
	 * Null and undefined inputs are silently ignored. Note that if you append an existing element, it is moved to the new destination (not cloning).
	 * @param {Node | String | CalDom | Array | NodeList | HTMLCollection | Function} elems_caldom_generator First argument can be a CalDom instance, a Node/String/HTML or an array of Node/String/HTML or a generator function that returns a new element.
	 * Provided elements are added to the first element of this CalDom instance. Generated item by the callback is added to all elements in this CalDom instance.
	 * Generator receives corresponding parent_node and parent_index as arguments: callback(parent_node: Node, parent_index: Number).
	 * See the examples for wide range of possibilities.
	 * @param {Node | CalDom } [...elems] (Optional) If the first argument is not an array-type, all ...arguments are added to the first element of this CalDom instance.
	 * @returns {CalDom} Returns this CalDom instance.
	 * @example
	 *
	 * //Append a new <div> to body (Element created by CalDom)
	 * _("body").append( _("+div") );
	 *
	 * //Append a new <div> to body (Element created by document.createElement)
	 * _("body").append( document.createElement("div") );
	 *
	 * //Append multiple elements, including nested elements and Node arrays
	 * _("#container-id").append(
	 * 		_("+div")
	 * 			.append( //Nested
	 * 				_("+p").text("Paragraph inside the div.")
	 * 			),
	 *
	 * 		_("p").text("Another paragraph as a first-level child."),
	 *
	 * 		document.createElement("img"),
	 *
	 * 		null, undefined, //Silently ignored
	 *
	 * 		"Text Node",
	 *
	 * 		'<h1 id="big-title">Also support HTML syntax</h1>'
	 *
	 * );
	 *
	 * //Append an array of Nodes and CalDom instances to <body>
	 * _("body").append(
	 * 	[
	 * 		_("+h1"),
	 *
	 * 		_("+div").append(
	 * 			_("+p").text("Paragraph inside the div.")
	 * 		),
	 *
	 * 		document.createElement("p"),
	 *
	 * 		"Text Node",
	 *
	 * 		"<h2>Support HTML</h2>"
	 * 	]
	 * );
	 *
	 * //Move existing <p> elements from "container-a" to "container-b"
	 * _("#container-b").append( _("#container-a p") );
	 *
	 * //Append new elements using a generator function to all elements in this CalDom instance
	 * _("#container-one").append(
	 * 		function(parent_node, parent_index){
	 * 			return _("+div").text("I'm inside parent: " + parent_index);
	 * 		}
	 * );
	 */
	"append": function(elems_caldom_generator){
		return insertBefore.call(this, elems_caldom_generator instanceof Array ? elems_caldom_generator : arguments, null, _insertFunc_appendChild);
	},

	/**
	 * @category Manipulate DOM Tree
	 * @description Prepend/Move elements to the first element of this CalDom instance or prepend to all the elements by passing a generator function.
	 * (Same as append(), except 2nd argument is reserved to identify before element.)
	 * Null and undefined inputs are silently ignored. Note that if you prepend an existing element, it is moved to the new destination (not cloning).
	 * @param {Node | CalDom | Array | NodeList | HTMLCollection | Function} elems_caldom_generator First argument can be a CalDom instance, a Node/String/HTML or an array of Node/String/HTML or a generator function that returns a new Element.
	 * Items are prepended to the first element of this CalDom instance. Generated item is prepended to all elements in this CalDom instance.
	 * Generator receives corresponding parent_node and parent_index as arguments: callback(parent_node: Node, parent_index: Number).
	 * @param {Node | CalDom} [before_elem_or_caldom] (Optional) If provided, items are inserted before this element instead before the firstChild.
	 * @returns {CalDom} Returns this CalDom instance.
	 * @example
	 *
	 * //Prepend a new <p> element as the first child
	 * _("#container-id")
	 * 		.prepend(
	 * 			_("+p").text("I'm the first child now.")
	 * 		);
	 *
	 * //Prepend a new <p> element before the 3rd paragraph in the container
	 * _("#container-id")
	 * 		.prepend(
	 * 			_("+p").text("I'm the 3rd paragraph now."),
	 * 			_("#container-id p").eq(2) //Before element
	 * 		);
	 *
	 * //First argument of prepend() is the same as append().
	 * //Refer its examples for a wide variety of possibilities.
	 */
	"prepend": function(elems_caldom_generator, before_elem_or_caldom){
		return insertBefore.call(this, elems_caldom_generator instanceof Array ? elems_caldom_generator : [elems_caldom_generator], before_elem_or_caldom, _insertFunc_insertBefore);
	},

	/**
	 * @category Manipulate DOM Tree
	 * @description Remove all elements of this CalDom instance from the DOM.
	 * @returns {CalDom} Returns this empty CalDom instance.
	 * @example
	 *
	 * //Remove all <p> elements
	 * _("p").remove();
	 */
	"remove": function(){
		this._willUnmount(true);

		this.each(function(elem){
			elem.parentNode.removeChild(elem);
		});

		this.elems = [];

		this._didUnmount(true);

		return this;
	},

	/**
	 * @category Manipulate DOM Tree
	 * @description Replaces current elements in this CalDom instance with new elements returned by the render_callback function.
	 * The algorithm compares the elements(including their descendents) and only replace the nodes if there is a difference against the actual DOM. This is useful to minimize expensive browser layout repaints.
	 * (This is the same algorithm used by react() to compare & apply DOM changes.)
	 * @param {Function} render_callback Render function that returns the new replacement element.
	 * The callback receieves 3 parameters: render_callback( current_elem: Node, index: Number, caldom_instance: CalDom ): {Node || CalDom}
	 * @returns {CalDom} Returns this CalDom instance.
	 * @example
	 *
	 * //Imagine this HTML document:
	 * //	<div>
	 * //		<p>ABC</p>
	 * //		<p>XYZ</p>
	 * //	</div>
	 *
	 * //Replace all paragraph elements using a new _("+p")
	 * _("p")
	 * 	.replace(
	 * 		function(old_elem, index, caldom_instance){
	 * 			//In this case, only the 1st paragraph will be replaced
	 * 			//since the 2nd paragraph is the same.
	 *
	 * 			return _("+p").text( "XYZ" );
	 * 		}
	 * );
	 *
	 * //Replace using a new element created by createElement()
	 * _("p")
	 * 	.replace(
	 * 		function(old_elem, index, caldom_instance){
	 * 			//Both paragraphs will be replaced by this empty DIV
	 * 			return document.createElement("div");
	 * 		}
	 * );
	 */
	"replace": function(render_callback){

		this.each(function(elem, i){
			var new_elem = render_callback(elem, i, this);
			if( new_elem instanceof CalDom ) new_elem = new_elem.elems[0];

			_replace(
				new_elem,
				elem,
				elem
			);
		});

		return this;
	},

	/**
	 * @private
	 * @description Used to call willMount() in reactive mode
	 * This function name is not preserved in minified version.
	 */
	 _willMount: function(){
		if( this["render"] || this["update"] ){
			if( this["willMount"] && !this._mounted ) this["willMount"]();

			this.react(undefined, undefined, undefined, undefined, undefined, true);
		}
	},

	/**
	 * @private
	 * @description Used to call didMount() in reactive mode.
	 * This function name is not preserved in minified version.
	 */
	_didMount: function(){
		var already_mounted = this._mounted;

		this._mounted = true;

		if( this["didMount"] && !already_mounted ) this["didMount"]();
	},

	/**
	 * @private
	 * @description Used to call willUnmount() in reactive mode.
	 * @param {Boolean} [directly_removed] Whether executed through .remove().
	 * This is used to differentiate component removal through replace() that might get re-connected at a different position in the DOM tree.
	 */
	_willUnmount: function(directly_removed){
		if( this["willUnmount"] ) this["willUnmount"]( directly_removed );
	},

	/**
	 * @private
	 * @description Used to call didUnmount() in reactive mode.
	 * This function name is not preserved in minified version.
	 * @param {Boolean} [directly_removed] Whether executed through .remove().
	 * This is used to differentiate component removal through replace() that might get re-connected at a different position in the DOM tree.
	 */
	_didUnmount: function(directly_removed){
		this._mounted = false;

		if( this["didUnmount"] ) this["didUnmount"]( directly_removed );
	},

	/**
	 * @category Manipulate DOM Tree
	 * @description Make this CalDom instance a reactive component by providing a state, render() or an update() function. CalDom compares differences and efficiently updates relevant DOM Node changes.
	 * Alternatively, this can be also achieved by extending _.Component class. See below examples.
	 * @param {any} [state] (Optional, but requires to initiate) Any value or an { key: value, ... } object.
	 * @param {Object} [config] (Optional, but requires to initiate) Reactive configuration containing render(), update(), etc.
	 * @param {Function} [config.render] (Optional, if update() is given) Should return a CalDom or a Node/Element. Return false to terminate render process.
	 * render(state: any, component: CalDom): receieves state and component(this CalDom instance) as arguments.
	 * All CalDom methods & properties (find(), text(), css(), etc.) can be accessed via component. Eg: component.text("Hello World!").
	 * CalDom sync child nodes (including text), attributes, CSS, value, checked, indeterminate, selected & _data property set by .data() between connected DOM & virtual DOM. It doesn't sync events & other custom properties directly attached to DOM nodes.
	 * To force a complete Node replacement with all events and properties, set a unique "key" attribute to each element.
	 *
	 * The first render() gets executed synchronously. After that, render() gets executed asynchronously through requestAnimationFrame when the state changes. This is applicable in both watched = true mode or when react() is called manually.
	 * Calling react() with a brand new state execute render() synchronously. Eg: app.react( new_state );
	 *
	 * @param {Function} [config.update] (Optional, if render() is given) If an update() function is present, CalDom will execute it instead of render(). (Intial render() get executed regardless).
	 * Manually updating DOM changes is obviously more performant than a render() based virtual-DOM approach. Also, it is useful to update existing non-javascript originated(.html file based) HTML structures reactively.
	 * If the update() returns true, CalDom will also execute render() and proceed with virtual-real DOM comparison and apply subsequent changes.
	 * update(state: any, component: CalDom): receieves state & component(this CalDom instance) as arguments. All CalDom methods & properties (find(), text(), css(), etc,) can be accessed via component. Eg: component.css( "color", "green" )
	 *
	 * @param {Boolean} [config.watched=true] (Optional) True by default. If false, CalDom will not react to state changes automatically. Call react() manually after changing state.
	 * CalDom is using Javascript Proxies to detect state changes. Browser versions released before 2016 may not support it natively. Implement a pollyfil for older browsers or you can call react() manually after state changes.
	 * If Proxy is not supported caldom.watched will set to false despite initially setting config.watched = true.
	 * If you chose not to use the Proxy for some reason, you can call .react() after state changes. There is no performance hit by calling it repetedly because CalDom is using requestAnimationFrame to update the DOM efficiently.
	 * Also, calling react() manually immediately after state changes does not cause a re-render when Proxy is supported.
	 *
	 * @param {Function} [config.willMount] (Optional) Called before the Component is mounted(appended) into a parent Node.
	 * @param {Function} [config.didMount] (Optional) Called after the Component is mounted(appended) into a parent Node.
	 * @param {Function} [config.willUnmount] (Optional) Called before the Component is removed.
	 * Callback receives one argument as callback( [directly_removed: Boolean] ). This is set to true if removed directly by calling .remove().
	 * Otherwise, set to undefined if removed while applying virtual-DOM changes to the real DOM. The removed component might get re-connected at a different position in the DOM tree.
	 * @param {Function} [config.didUnmount] (Optional) Called after the Component is removed.
	 * Callback receives one argument as callback( [directly_removed: Boolean] ). This is set to true if removed directly by calling .remove().
	 * Otherwise, set to undefined if removed while applying virtual-DOM changes to the real DOM. The removed component might get re-connected at a different position in the DOM tree.
	 * @param {Function} [config.didUpdate] (Optional) Called after the Component is rendered and all virtual-DOM changes applied to the real DOM.
	 *
	 * @returns {CalDom} Returns this CalDom instance.
	 *
	 * @example
	 *
	 * //Hello World Component (non-class based approach)
	 * var helloWorldApp = _().react(
	 *			{ name: "World!" },
	 *			{
	 *				render: (state) => _("+h1").text( "Hello " + state.name )
	 *			}
	 *		);
	 *
	 * _("body").append( helloWorldApp );
	 *
	 * helloWorldApp.state.name = "CalDom!";
	 *
	 * //Hello World Component (Class based approach)
	 * class HelloWorldApp extends _.Component{
	 *
	 *		constructor(state){
	 *			super();
	 *		  	this.react(state); //this == CalDom instance
	 *		}
	 *
	 *		render(state){ //state is a shortcut to this.state
	 *			return _("+h1").text( "Hello " + state.name );
	 *		}
	 * }
	 *
	 * var app = new HelloWorldApp({ name: "World!" });
	 * _("body").append( app );
	 *
	 * app.state.name = "CalDom";
	 *
	 * //Make an existing HTML H1 reactive
	 * var helloWorld = _("#main-heading").react(
	 * 		{ name : "World!" },
	 * 		{
	 * 			update: (state, component) => component.text( "Hello " + state.name )
	 * 		}
	 * );
	 *
	 * helloWorld.state.name = "CalDom!";
	 *
	 * //Manual reactive approach (without automatic update on state change)
	 * var helloWorldApp = _().react(
	 *     { name: "World!" },
	 *     {
	 *         render: (state) => _("+h1").text( "Hello " + state.name ),
	 *         watched: false //Disabling automatic state changes watch
	 *     }
	 * );
	 *
	 * _("body").append( helloWorldApp );
	 * helloWorldApp.state.name = "CalDom!";
	 *
	 * //Calling react() manually after state change
	 * //This gets executed asynchronously through requestAnimationFrame. (Same as watched = true mode)
	 * helloWorldApp.react();
	 *
	 * //Alternatively, react() can be called with a brand new state.
	 * //This gets executed synchronously (not using requestAnimationFrame)
	 * helloWorldApp.react( { name: "JS!" } );
	 */
	"react": function( state, config, _is_watched_updated, _changed_state_obj, _state_changed_key, _mounting, _is_request_animation_frame ){
		var _this = this;

		if( _this["watched"] && arguments.length == 0 ) return _this;

		// Using requestAnimationFrame() to avoid rendering bursts for multiple variable changes (Proxy setter fires at every change in .state watch mode).

		if( _is_watched_updated || (arguments.length == 0 && !_is_request_animation_frame) ){
			if( _this._z ) return;

			_this._z = requestAnimationFramePolyfill(function(){ //Note this requestAnimationFrame is using current window instead of this._w
				_this.react(undefined, undefined, undefined, _changed_state_obj, _state_changed_key, undefined, true);
			});

			return _this;
		}

		_this._z = null;

		if( !_mounting ){ //Because no config changes when called through append() -> _willMount()
			if( config ){
				if( config["render"] != undefined ) _this["render"] = config["render"];
				if( config["update"] != undefined ) _this["update"] = config["update"];

				if( config["watched"] != undefined ) _this["watched"] = config["watched"];

				if( config["willMount"] != undefined ) _this["willMount"] = config["willMount"];
				if( config["didMount"] != undefined ) _this["didMount"] = config["didMount"];
				if( config["willUnmount"] != undefined ) _this["willUnmount"] = config["willUnmount"];
				if( config["didUnmount"] != undefined ) _this["didUnmount"] = config["didUnmount"];

				if( config["didUpdate"] != undefined ) _this["didUpdate"] = config["didUpdate"];
			}

			if( !this._w["Proxy"] ) _this["watched"] = false; //Silently failing

			if( state != undefined ){
				if( _this["watched"] != false ){
					_this.state = watch(state, function(obj, key){
						_this.react(undefined, undefined, true, obj, key);
					});
				}
				else{
					_this.state = state;
				}
			}
		}

		if( _this.update && ( !_this.render || (_this.elems[0] && _this.elems[0]["_h"])) ){ //Checking _h to detect whether the first render() is done.
			if( !_this["update"](_this.state, _this) ) return _this; //if update() returns true, continue to render
		}

		if( !_this._mounted && !_mounting) return _this; //Don't need to render() if not mounting or mounted

		var old_dom = _this.elems[0];

		// Render request via a parent component. No this.state changes.
		// TODO: Consider the cost of render() vs elems[0].cloneNode().
		// Or just pass reference object to the replace()
		if( _this._mounted && _mounting && !_changed_state_obj ){
			var cloned_root = _this.elems[0].cloneNode(true);
			cloned_root["_h"] = _this;
			cloned_root._original_root = _this.elems[0];

			_this._v = [ cloned_root ]; //To preserve old_dom children when the new virtual-dom appendChild()
		}
		else{

			var new_dom = _this["render"](_this.state, _this, _changed_state_obj, _state_changed_key);
			if( !new_dom ) return _this;

			if( new_dom instanceof CalDom ) new_dom = new_dom.elems[0];

			new_dom["_h"] = _this; //_h for DOM handler

			if( !old_dom ){
				_this.elems = [new_dom];
			}
			else {
				var new_root = _replace( new_dom, old_dom, old_dom );

				if( new_root ){
					_this.elems[0] = new_root; //Note that only elems[0] is considered. Ideally all components only must have one element as the root.
				}
			}

			if( _this["didUpdate"] ) _this["didUpdate"]( _this.state, _this );

		}

		return _this;
	}

	//TODO: Add .shadow({}) to support Shadow DOM

};

/**
 * @private
 * @description Copying props from new Node to existing Node, including for child nodes
 * @param {Node} new_dom_node Newly rendered Node
 * @param {Node} old_dom_node Existing Node
 * @param {Boolean} enumerate_children Whether to enumerate children
 */
 function copyProps(new_dom_node, old_dom_node, enumerate_children){
	//TODO: Make sure this is all common cases. Is it? Also, how about implementing Object.assign()?

	if( Object.getPrototypeOf(old_dom_node).hasOwnProperty("value") ){ //Because some of these exists in Elements other than HTMLInputElement like <Button>
		if( old_dom_node.value != new_dom_node.value ) old_dom_node.value = new_dom_node.value;
		if( old_dom_node.checked != new_dom_node.checked ) old_dom_node.checked = new_dom_node.checked;
		if( old_dom_node.indeterminate != new_dom_node.indeterminate ) old_dom_node.indeterminate = new_dom_node.indeterminate;
	}

	if( old_dom_node.selected != new_dom_node.selected ) old_dom_node.selected = new_dom_node.selected;
	if( new_dom_node["_data"] ) old_dom_node["_data"] = new_dom_node["_data"];

	if( enumerate_children ){
		var new_dom_node_child_nodes = _slice.call(new_dom_node.children); ////Because enumerating live NodeList is slow
		var old_dom_node_child_nodes = _slice.call(old_dom_node.children);

		for( var i = 0, len = new_dom_node_child_nodes.length; i < len; i++ ){
			copyProps(new_dom_node_child_nodes[i], old_dom_node_child_nodes[i]);
		}
	}
}

/**
 * @private
 * @description Compare newly rendered DOM with existing DOM and update changes.
 * @param {Node} new_dom_node
 * @param {Node} old_dom_node
 * @param {Node} old_dom_node_parent
 * @returns {Node} Returns new DOM if replaced
 */
function _replace(new_dom_node, old_dom_node, old_dom_node_parent){
	if( !new_dom_node ) return;

	if( new_dom_node._original_root ) new_dom_node = new_dom_node._original_root;

	if( !old_dom_node ){
		return old_dom_node_parent.appendChild( new_dom_node );
	}

	var soft_replacable = new_dom_node.nodeType == 1
		&& new_dom_node.tagName == old_dom_node.tagName //Assuming a drastically different tree, thus a hard replace is efficient.
		&& new_dom_node["_h"] === old_dom_node["_h"] //Assuming enequal Component instances and keys are different elements (with their own custome properties & event listeners), thus a hard replace is required.
				&& new_dom_node.getAttribute("key") === old_dom_node.getAttribute("key");

	if( soft_replacable ){

		var copy_props_recursively = true;

		//Placed at first assuming content will change more often than attributes
		if( !new_dom_node.isEqualNode(old_dom_node) ){

			copy_props_recursively = false;

			var new_dom_has_child_nodes = new_dom_node.hasChildNodes();

			if( new_dom_has_child_nodes || old_dom_node.hasChildNodes() ){
				var old_dom_node_child_nodes = (old_dom_node.childNodes);  //Keeping the live list so it adjusts automatically with Node.replaceChild()
				var i = 0;


				if( new_dom_has_child_nodes ){

					var new_dom_node_child_nodes = _slice.call(new_dom_node.childNodes);  //Because enumerating live NodeList is slow

					var len = new_dom_node_child_nodes.length;

					//If the new_dom_element or old_dom_element has children, replace() it
					//TODO: re-order based on key first, then prepend missing keys and proceed to to rest of the tree walk? (efficiency to be tested)
					for( ; i < len; i++ ){

						var replaced_elem = _replace(new_dom_node_child_nodes[i], old_dom_node_child_nodes[i], old_dom_node);

						if( replaced_elem && replaced_elem["_h"] ){
							replaced_elem["_h"].elems[0] = replaced_elem;
						}

						// old_dom_node_child_nodes.splice(i--, 1);
					}
				}

				//Finally, if the old_dom_element is containing children not present in the new_dom_element, remove them
				for( ; i < old_dom_node_child_nodes.length; i++ ){
					var old_dom_node_child = old_dom_node_child_nodes[i];

					var fire_unmount_events = old_dom_node_child["_h"] != undefined;

					if( fire_unmount_events ) old_dom_node_child["_h"]._willUnmount();

					old_dom_node.removeChild( old_dom_node_child );
					i--;

					if( fire_unmount_events ) old_dom_node_child["_h"]._didUnmount();

					// old_dom_node_child_nodes.splice(i--, 1);
				}
			}

			copyProps( new_dom_node, old_dom_node, copy_props_recursively );

			//Placed at second assuming content will change more often than attributes
			//Syncing attributes (including style);
			if( !new_dom_node.isEqualNode(old_dom_node) ){
				for(var new_attr_i = 0, new_attr_len = new_dom_node.attributes.length; new_attr_i < new_attr_len; new_attr_i++ ){
					var new_attr = new_dom_node.attributes[new_attr_i];

					if( old_dom_node.getAttribute(new_attr.name) != new_attr.value ){
						old_dom_node.setAttribute( new_attr.name, new_attr.value );
					}
				}

				//TODO: Checking above set attributes again here, will a if( indexOf(key) != -1 ) continue; more efficient?
				for(var old_attr_i = 0, old_attr_len = old_dom_node.attributes.length; old_attr_i < old_attr_len; old_attr_i++ ){
					var old_attr = old_dom_node.attributes[old_attr_i];

					if( !new_dom_node.hasAttribute(old_attr.name) ){
						old_dom_node.removeAttribute(old_attr.name);
					}
				}
			}
		}
	}
	else if( !new_dom_node.isEqualNode(old_dom_node) ){ //Hard Replace

		//TODO: Need to find a better way to find deleted only
		var fire_unmount_events = old_dom_node["_h"] != undefined;

		if( fire_unmount_events ) old_dom_node["_h"]._willUnmount();

		old_dom_node.parentNode.replaceChild( new_dom_node, old_dom_node );

		if( fire_unmount_events ) old_dom_node["_h"]._didUnmount();

		return new_dom_node;
	}
}

/**
 * @private
 * @description Used to implement a Proxy to watch state changes. Requires a Proxy polyfill for older browsers.
 * @param {Object} what
 * @param {Function} onSetCallback
 * @returns {Proxy}
 */
function watch(what, onSetCallback){

    return new Proxy(

		what,

        {
            get: function(obj, key){
				var destination = obj[key];

                if( typeof destination == 'object' && destination != null && !(destination instanceof CalDom) && key[0] != "_" ){
                    return new Proxy( destination, this );
                }
                else{
                    return destination;
                }
            },

            set: function(obj, key, value){
				obj[key] = value;
                onSetCallback(obj, key);

                return true;
			},

			deleteProperty: function(obj, key){
				delete obj[key]
				onSetCallback(obj, key);

				return true;
			}
        }
    )
}

/**
 * @private
 * @description Core function of append/prepend.
 * @see append() and prepend() for reference
 * @param {any} element_or_elements_or_caldom_or_generator
 * @param {any} before_elem_or_caldom
 * @param {Function} _insertFunc
 */
function insertBefore(element_or_elements_or_caldom_or_generator, before_elem_or_caldom, _insertFunc){
	if( before_elem_or_caldom instanceof CalDom ) before_elem_or_caldom = before_elem_or_caldom.elems[0];

	if( typeof element_or_elements_or_caldom_or_generator[0] == 'function' ){ //Generator function
		this.each(function(elem, i){
			var generated = element_or_elements_or_caldom_or_generator[0](elem, i);

			_insertFunc.call(
				elem,
				generated instanceof CalDom ? generated.elems[0] : generated,
				before_elem_or_caldom === undefined ? elem.firstChild : before_elem_or_caldom
			);
		});
	}
	else if(element_or_elements_or_caldom_or_generator.length != undefined){

		for(var i = 0, len = element_or_elements_or_caldom_or_generator.length; i < len; i++){
			var this_item = element_or_elements_or_caldom_or_generator[i];
			if( !this_item ) continue;

			var new_elems;

			var is_caldom = !!this_item.elems;

			if( is_caldom ){
				this_item._willMount()

				new_elems = this_item._v || this_item.elems;
			}
			else{
				if( this_item.length != undefined
					&& typeof this_item != 'string'
					&& !(this_item instanceof Node) //Because <select> has a length property 🤷‍♂️
				 ){
					new_elems = this_item;
				 }
				 else{
					new_elems = [this_item];
				 }
			}

			var elem = this.elems[0];
			if( before_elem_or_caldom === undefined ) before_elem_or_caldom = elem.firstChild;

			for( var elem_i = 0, new_elems_length = new_elems.length; elem_i < new_elems_length; elem_i++ ){
				var new_elem = new_elems[elem_i];
				if( !new_elem ) continue;

				if( typeof new_elem == 'string' ){
					new_elem = this._w.document
						.createRange()
						.createContextualFragment( new_elem ).firstChild;
				}

				_insertFunc.call(
					elem,
					new_elem,
					before_elem_or_caldom
				);
			}

			if( is_caldom ){
				this_item._v = null; //To prevent memory leaks
				this_item._didMount()
			}
		}
	}

	return this;
}

/**
 * @category Extensions
 * @title _.q( query, parent_node )
 * @description Call CalDom's query/create function directly using _.q(query)
 * @param {String} query "+tag" creates a new Element. '<tag></tag>' creates specified HTML structure. ~svg_tag" creates a SVG element. Otherwise it can be a CSS Selector or an XPath query starting with "$"
 * @param {Node} [parent_node] Treated as the parent node for CSS selector or XPath query. Otherwise, default to window.document
 * @returns {Array<Node>} Array with the new element or NodeList returned by the CSS selector or the XPath query
 * (Shorten for query())
 * @example
 *
 * //Get element with id "container-id" using its CSS selector
 * var container = _.q("#container-id")[0];
 *
 * //Create a new <div> element
 * var div = _.q("+div")[0];
 *
 * //Create a password input element using full HTML syntax
 * var para = _.q( '<input type="password" placeholder="Type your password here" />' );
 *
 *  * //Create a new SVG element
 * var svg_rectangle = _.q("~rect").attr({ width: 100, height: 100 })[0];
 *
 * //Get all <p> elements inside <article> using an XPath query
 * var paragraphs_array = _.q("$//article/p");
 */
 function q(query, parent_node){
	parent_node = parent_node || window.document;

	query = query.trim();

	var first_char = query[0];

	if( first_char == "+" ) return [parent_node.createElement( query.substr(1) )];

	if( first_char == "$" ){
		var results = (parent_node.ownerDocument || parent_node).evaluate(query.substr(1), parent_node, null, 0, null);
		var elems = [];

		var result = results.iterateNext();
		while(result){
			elems.push(result);
			result = results.iterateNext();
		}

		return elems;
	}

	if( first_char == "<" ) return _slice.call( parent_node.createRange().createContextualFragment(query).childNodes );

	// if( first_char == "`" ) return [parent_node.createTextNode( query.substr(1) )];

	if( first_char == "~" ) return [parent_node.createElementNS( "http://www.w3.org/2000/svg", query.substr(1) )];

	return _slice.call( parent_node.querySelectorAll(query) ); //Because (live?) NodeList enumeration is damn slow \_/ https://jsben.ch/1HYYe
}

var calDom = function(selector_xpath_caldom_elems, children, parentWindow){
	return new CalDom( selector_xpath_caldom_elems, children, parentWindow );
};

//Attaching q() directly, so it can be accessed without initiating a new CalDom instance. Eg: _.q("#container-id") or _.q("+div") or _.q("$//article/p")
calDom["q"] = q;

//Attaching CalDom constructor directly. So it can be sub-classed as a Component
/**
 * @category Extensions
 * @title _.Component.prototype
 * @description Extend and modify core functionality of CalDom by accessing its prototype.
 * @example
 *
 * //Adding a custom core function
 * _.Component.prototype.customFunction = function(){
 * 		for( var i = 0, count = this.elems.length; i < count; i++ ){
 * 			//Do something
 * 		}
 * }
 */
calDom["Component"] = CalDom;

/**
 * @category Extensions
 * @title _.version: String
 * @description Get version of CalDom.
 * @example
 *
 * var version = _.version;
 */
 calDom["version"] = "1.0.5"

if( typeof module != 'undefined' && module.exports ){
	module.exports = calDom;
}
else if( typeof define == 'function' ){
	define(function(){
		return calDom;
	});
}
else{

	//Attaching CalDom to window/global using declared separator

	// if( _window[alias] ){
	// 	throw("_ is taken."); // CalDom is using '_' variable as a global short-hand by default. To use a different alias, define window['_cal_dom_alias'] = 'different_alias' before loading CalDom.
	// }

	_window[_window["_caldom_alias"] || "_"] = calDom;
}

return calDom;

})();