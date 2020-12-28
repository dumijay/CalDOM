# CalDom
CalDom is a chainable DOM traverser and a manipulator. A super lightweight, 1.4KB minimalistic JavaScript library inspired by key jQuery features.

It's simply a chainable and iterable wrapper around document.createElement(), document.querySelectorAll() and document.evaluate(). Just the right amount of short-hand trics while keeping a smaller foot-print.

## Basic Syntax
Using the alias _ (underscore) for easy reference. (This can be set to $ or any variable-name).
```js
//Creating a new <div>
var new_div = _("+div"); 

//Using CSS Selector find an element by ID
var container = _("#main-container");

//Find <a> elements with href containing "wikipedia.org" using an XPath query starting with '$'
var wikipedia_links = _("$//a[contains(＠href, 'wikipedia.org')]");

//Append a <button> to <body> and add an click event
_("body").append(
    _("+button")
        .text("Click Me")
        .on("click", () => { console.log("Clicked"); } )
);
```

## Get Started

### CDN

```html
<script src="https://cdn.jsdelivr.net/gh/dumijay/CalDom/dist/caldom-1.0.0.min.js"></script>
```
Thanks to jsDelivr.com

### Download

* Minified version in the ./dist/
* Source code in the ./src/

### Use it as a Module
When using it as a module, CalDom is not attaching anything to the global environment.

```js
import _ from 'caldom';
```

```js
//Node, CommonJS
const _ = require('caldom');
```

```js
//RequireJS
requirejs( ["caldom"], function(_){

    _("body").text("Hello World!");

} );
```

## Example: A Simple TODO App

```html
<style>
    .error{
        box-shadow: 0 0 5px red;
    }

    .todo-item{
        cursor: pointer;
        font-size: 1.5em;
    }
</style>

<script src="js/caldom_1.0.0.js"></script>
<script>

    var _input, _button;
    
    _(document.body)
        .append(
            _input = _("+input") //Create <input>
                .attr({
                    type: "text",
                    placeholder: "Type item here",
                })
                .on("keypress", (e) => {
                    //Calling function
                    if( e.keyCode == 13 ) _("button").eq(0).call("click");
                }),
            
            _button = _("+button")
                .text("Add")
                .css({
                    cursor: "pointer",
                    marginLeft: "0.5em",
                })
                .on("click", () => {
                    var value = _input.val()[0];

                    if( !value.length ) return _input.addClass("error");
                    else _input.removeClass("error");

                    _("#todo-list")
                        .append(
                            _("+li")
                                .attr("class", "todo-item")
                                .text( value )
                                .on("click", function(){
                                    _(this)
                                        .css("text-decoration", "line-through")
                                        .attr("custom_status", "finished");
                                })
                        );
                }),
            
            _("+ol").attr("id", "todo-list"),

            _("+button")
                .text("Clear Finished")
                .on("click", () => {
                    //Using XPath to match sub string "fini" of "finished"
                    _('$//li[ contains(@custom_status, "fini") ]').remove(); //Usin
                }),
            
            _("+button")
                .text("Clear All")
                .css("marginLeft", "5px")
                .on("click", () => {
                    _(".todo-item").remove();
                })
        );
</script>
```

## Quick Reference
Syntax is mostly compatible with jQuery. Key difference is CalDom's output functions like val() returns an array of all values instead of jQuery's first-element-only return. They also accepts arrays as inputs, refer full documentation.

```js
//Constructor. +tag to createElement. Use a CSS Selector or XPath to find elements.
_("<q>");

//Access CalDom's query function directly. +tag to createElement. Use a CSS Selector or XPath to find elements. Returns an array of created or found elements.
_.q("<q>");

//Find descendants using a CSS Selector or XPath query starting with '$'.
_("<q>").find("<q>");

//Call n-th level function for all elements and get return results as an array.
_("<q>").call("path.to.function");

//Get n-th level property values for all elements as an array.
_("<q>").prop("path.to.property");

//Set properties using a {k:v,} object or as key, value[s] parameters.
_("<q>").prop( {key: value} || key, values[s] );

//Append/Move element(s). Elements can be a single Element, array of Elements, a CalDom instance or a generator function.
_("<q>").append(element[s][, node]);

//Prepend/Move element(s) as first child or before. Elements can be a single Element, array of Elements, a CalDom instance or a generator function.
_("<q>").prepend(element[s][, before_elem]);

//Get an array of attribute value of each element.
_("<q>").attr("<attr_key>");

//Set attribute(s) using a {k:v,} object or as key, value[s] parameters.
_("<q>").attr( {key: value} || key, values[s] );

//Set CSS styles using a {property:value,} object or as property, value parameters.
_("<q>").css( {key: value} || key, values );

//Add CSS classes. Multiple classes separated by space are supported.
_("<q>").addClass( class_names );

//Remove CSS classes. Multiple classes separated by space are supported.
_("<q>").removeClass( class_names );

//Add an event handler. Multiple event names separated by space are supported.
_("<q>").on( event_names, handler, [options] );

//Remove an event handler. Multiple event names separated by space are supported.
_("<q>").off( event_names, handler, [options] );

//Get a new CalDom instance for n-th element.
_("<q>").eq(n);

//Get n-th parent or the first parent to match the CSS Selector.
_("<q>").parent(["<n_or_selector>"]);

//Get all children or children matching the CSS Selector.
_("<q>").children(["<css_selector">]);

//Iterate over elements with a callback(elem, i).
_("<q>").each(callback);

//Get an array of innerHTML from the elements. | Set a single or an array of innerHTML.
_("<q>").html([html]);

//Get an array of textContent from the elements. | Set a single or an array of textContent.
_("<q>").text([text]);

//Get an array of value from the elements. | Set a single or an array of values.
_("<q>").val([values]);

//This is an alias for prop(); (for compatibility reasons).
_("<q>").data();

//Remove elements.
_("<q>").remove();

//Access created or found Nodes array directly.
_("<q>").elems;
```

## Good God! Another jQuery-like framework?
I know :)

About a few years ago, I was creating animated web stuff (banners, games, etc.). The kind of animations more into programming than just moving parts.

* I needed a lightweight jQuery replacement. Specially to fit Google Display Network(GDN)'s 150kb file size limit. jQuery was about 70kb-ish back then.
* I needed a more cleaner way(vs jQuery) to create new elements on-the-go.
* Plus, I needed to stay up to date with DOM/javascript vanilla syntax. (Because jQuery moves you away from native javascript/DOM).

Hence, CalDOM was born. 8KB uncompressed, with most of the functionality I need without an overkill.
I created this years ago and kept improving it as my primary DOM handler. Just decided to put it out thinking someone else might find it useful.

If you have a similar requirement, this could be useful. Otherwise, I think you're better off with jQuery-alike.  

(Come to think of it, my very unpopular decision to stay closer to vanilla javascript against tempting new frameworks paid back big time later. Drastically reduced the learning-curve when adapting to new dev environments.)

Best alternative to jQuery is native/vanilla JS
minamalist
Tiny
micro
framework
vanila JS
mobile
loading time
JavaScript library
modern browsers
power users/developer
Internet Explorer
Performance
Close to native/vanilla JS as possible
powerful