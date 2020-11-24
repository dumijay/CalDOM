//CodeArtLove (Pvt) Limited - All Rights Reserved.

//0.5.0		Major release with support for 
//			undefined DOM functions and properties through Proxy & Reflection (Unfinished).

//Added text() to avoid XSS vulnerabilities, to be added to previous versions as well

//0.4.12 BREAKING CHANGE: val(), data(), attr() and html() returning an array of all elements instead of first element.
//0.4.12 addClass() and removeClass() now supports multiple classes separated by space.
//0.4.12 changed CalDom to CalDom
//0.4.12 added version()

(function(){

var CalDom = function(query, parentWindow){
	return this.init(query, parentWindow);
};

CalDom.prototype = {

	parentWindow : null,
	elems : [],

	init: function(query, parentWindow){

		this.parentWindow = parentWindow || window;

		if(typeof query != 'undefined'){
			if(typeof query.elems !== 'undefined') this.elems = query.elems;
			else if(Object.prototype.toString.call(query) === '[object NodeList]') this.elems = query;
			else if(typeof query !== 'string') this.elems = [query];
			else this.elems = this._getElem(query);
		}

		return this;
	},

	_getElem: function (query){
		return query.substr(0, 1) == "+" ? [this.parentWindow.document.createElement(query.substr(1))] : this.parentWindow.document.querySelectorAll(query);
	},

	find: function(query){ //only elems[0] is used
		return new CalDom(this.elems[0].querySelectorAll(query));
	},

	eq: function(i){
		return new CalDom(this.elems[i]);
	},

	parent: function(n){ //only elems[0] is used, getting n'th parent
		var cur_node = this.elems[0];

		for(var i = 0; i < n; i++){
			cur_node = cur_node.parentNode;
		}

		return new CalDom(cur_node);
	},

	siblings: function(selector){ //Note that this will return the calling element itself if matched by selector
		var cur_node = this.elems[0];
		var _siblings;

		while(cur_node !== this.parentWindow.document){

			cur_node = cur_node.parentNode;

			_siblings = _(cur_node).find(selector || "*");
			
			if( _siblings.elems.length > 1 ){
				break;
			}
		}

		return _siblings;
	},

	each: function(callback){
		for(var i = 0; i < this.elems.length; i++){
			callback.call(this.elems[i]);
		}

		return this;
	},

	html: function(text){
		if(typeof text !== 'undefined'){
			return this.each(function(){
				this.innerHTML = text;
			});
		}
		else{
			var output = [];
			
			this.each(function(){
				output.push(this.innerHTML);
			});

			return output;
		}
	},

	text: function(text){
		if(typeof text !== 'undefined'){
			return this.each(function(){
				this.textContent = text;
			});
		}
		else{
			var output = [];
			
			this.each(function(){
				output.push(this.textContent);
			});

			return output;
		}
	},

	data: function(key, val){
	    try{
    		if(arguments.length == 2) {
    			return this.each(function(){
    				this[key] = val;
    			});
    		}
    		else {
				if(typeof key == "object") {
					for(i in key){
						this.each(function(){
							this[i] = key[i];
						})
					}
				}
    			else {
					var output = [];
			
					this.each(function(){
						output.push( this[key] );
					});

					return output;
				}
    		}
		}
		catch(e){
			console.trace(e);
		}

		return this;
	},

	attr: function(key, val){
		try{
    		if(arguments.length == 2) {
    			return this.each(function(){
    				this.setAttribute(key, val);
    			});
    		}
    		else {
				if(typeof key == "object") {
					for(i in key){
						this.each(function(){
		    				this.setAttribute(i, key[i]);
						})
					}
				}
    			else {
					var output = [];
			
					this.each(function(){
						var value = this.attributes[key] ? this.attributes[key].value : undefined;

						output.push( value );
					});

					return output;
				}
    		}
		}
		catch(e){
			console.trace(e);
		}

		return this;
	},

	css: function(key, val){
		if(typeof val !== 'undefined'){
			this.each(function(){
				this.style[key] = val;
			});
		}
		else{
			var style_set = key; //Key to be a css rules array

			for(i in style_set){
				this.each(function(){
					this.style[i] = style_set[i];
				});
			}
		}

		return this;
	},

	on: function(event_names, handler, options){
		this.each(function(){
			var events = event_names.split(" ");

			for( var i = 0; i < events.length; i++ ){
				this.addEventListener(events[i], handler, options);
			}
		});

		return this;
	},

	addClass: function(classNames){
		var classes = classNames.split(" ");

		this.each(function(){
			for( var i = 0; i < classes.length; i++ ){
				this.classList.add(classes[i]);
			}
		});

		return this;
	},

	removeClass: function(classNames){
		var classes = classNames.split(" ");

		this.each(function(){
			for( var i = 0; i < classes.length; i++ ){
				this.classList.remove(classes[i]);
			}
		});

		return this;
	},

	show: function(display_value){
		return this.each(function(){
			this.style.display = display_value || "block";
		});
	},

	hide: function(){
		return this.each(function(){
			this.style.display = "none";
		});
	},

	val: function(val){
	    if(typeof val == 'undefined'){
			var output = [];
			
			this.each(function(){
				output.push( this.value );
			});

			return output;
		}
	    else{
			return this.each(function(){
				this.value = val;
			});
		}
	},

	append: function(){

		if(Object.prototype.toString.call(arguments[0]) === '[object Array]'){
			for(obj_i in arguments[0]){
				if(arguments[0][obj_i] != null){
					var child = (!arguments[0][obj_i].elems ? arguments[0][obj_i] : arguments[0][obj_i].elems[0]);
					if(typeof child != 'function') this.each(function(){ //isFunction check due to a strage IE error;
						try{ //to ignore non html elements
							this.appendChild( child );
						}catch(e){}
					});
				}
			}
		}
		else{
			for(arg in arguments){
				if(arguments[arg] != null){
					var child = (!arguments[arg].elems ? arguments[arg] : arguments[arg].elems[0]);
					if(typeof child != 'function') this.each(function(){ //isFunction check due to a strage IE error;
						try{ //to ignore non html elements
							this.appendChild( child );
						}catch(e){}
					});
				}
			}
		}

		return this;
	},

	prepend: function(){ //elems[0] is used for both parent & child
		var first_child = !arguments[1] ? this.elems[0].firstChild : (typeof arguments[1].elems != 'undefined' ? arguments[1].elems[0] : arguments[1]);

		if(Object.prototype.toString.call(arguments[0]) === '[object Array]'){

			for(obj_i in arguments[0]){
				var child = (!arguments[0][obj_i].elems[0] ? arguments[0][obj_i] : arguments[0][obj_i].elems[0]);
				this.elems[0].insertBefore( child, first_child );
			}
		}
		else{
			var child = (!arguments[0].elems ? arguments[0] : arguments[0].elems[0]);
			this.elems[0].insertBefore( child, first_child );
		}

		return this;
	},

	remove: function(){
		return this.each(function(){
			this.parentNode.removeChild(this);
		});
	},

 	post: function(url, data_obj, onSuccess, onFail){
		var form_data = new FormData();

	    for(key_i in data_obj){
	        form_data.append(key_i, JSON.stringify(data_obj[key_i]));
	    }

	    var xmlHttp = new XMLHttpRequest();

	    xmlHttp.onreadystatechange = function(e){
	        if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
	            onSuccess(e);
	        }
	        else{
	            if(onFail) onFail(e);
	        }
	    }

	    xmlHttp.open("post", url);
	    xmlHttp.send(form_data);

		return xmlHttp;
	},

	version: function(){
		return "0.5.0";
	}

};

window["_"] = function(query, parentWindow){
	return new CalDom( query, parentWindow );
};


})();
