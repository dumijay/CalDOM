![CalDOM JS Logo](https://www.caldom.org/images/caldom_logo.png)

An agnostic, reactive & minimalist (3kb) JavaScript UI library with direct access to native DOM.

Instead of pulling you into a library-specific magical world, CalDOM let you **fully access the DOM** directly while keeping the **reactivity** 💥.
So you could take full advantage of native APIs & mix it with other libraries to gain superior performance & flexibility in the development process.

A 2-in-1 virtual-DOM & no-virtual-DOM approach if you will.

0️⃣ Zero tooling,  0️⃣ zero dependencies,  0️⃣ zero new syntax, just pure JS.

In essence, CalDOM is just a wrapper around the native Node/Element. The overall performance drop is about 0.04x compared to vanilla/pure JavaScript. This is based on averaged unit level benchmarks in handling single & multiple-element instances: [View Benchmark Results](https://caldom.org/benchmark/) against Vanilla JS, jQuery, React JS, Vue &amp; more.

Official site: [caldom.org](https://www.caldom.org)

Documentation: [caldom.org/docs/](https://caldom.org/docs/)

## Hello World!
Use it as a chainable DOM traverser and a manipulator, a lightweight jQuery alternative.

```js
_("#output-1")
    .append(
        _("+h1").text("Hello World!")
    );

//Short append
_( "#output-1", _("+p", "This is CalDOM.") );
```

## Hello World - Reactive
Build reactive components. Use it as a lightweight React JS/Vue JS alternative.
Not using classes, similar to React Hooks, but simpler.

```js
let app = _().react(
    {},
    {
        render: state =>
            _( "+h1", `Hello ${state.name}` ) //This is XSS safe by design
    }
)

_("#output-2", app );

//Edit below line to update state
app.state.name = "World Reactively 💥";
```

## Hello World - Reactive (ES6)
Also works as an extended ES6 class.

```js
class HelloWorld extends _.Component{
 
    constructor(state){
        super();
   
        this.react(state);
    }
 
    render(state){
        return _("+div", [ //Can pass children as an array too
            _( "+h1", "Hello " + state.name ),
            
            _( "+p", ["The time is: ", state.time] )
        ]);
    }

    tick(){
        this.state.time = new Date().toTimeString().substr(0, 8);
    }

    didMount(){
        setInterval( () => this.tick(), 1000);
    }
 
}

let app = new HelloWorld( { name: "World!", time: "" } );

_("#output-3", app);
```

## Reactive Native DOM Elements
Native DOM Node is a first-class citizen. Also, a CalDOM instance is just a wrapper around them.
This agnostic interoperability allows for an infinite amount of powerful integrations.

```js
let app = _().react(
    {},
    {
        render: state =>{
            let div = document.createElement("div");

            let heading = document.createElement("h1");
            heading.textContent = `I'm a reactive ${state.name}`;

            div.appendChild(heading);

            //.elem gives you the direct Element
            div.appendChild( _("+h2", "💥💥💥").elem ) 

            return div;
        }
    }
)

_("#output-3-1", app );

app.state.name = "native DOM Element. 🙀";
```

## Make existing HTML reactive
Not a fan of rendering & virtual-DOM thingies? Use CalDOM to update() pre-defined HTML content reactively.
CalDOM's API is inspired by jQuery.

```js
let person_one = _("#person-1").react(
    {},

    {
        update: function(state, person){
            person.find(".name").text( state.name );
            person.find(".age").text( state.age );
        }
    }
)

//CalDOM batches these 2 state updates to only render once.
person_one.state.name = "Jane Doe";
person_one.state.age = 22;                 
```

## Summon the power of both worlds!
Efficiently update() the DOM directly and/or proceed to virtual-DOM render if it's more suitable.
Use this.$ to hold direct DOM Node references. CalDOM keeps them in sync even when render() drastically alter the DOM structure.

```js
class Person extends _.Component{
    constructor(){
        super();

        this.react({ name: "John", likes: ["SpongeBob"] });
    }

    render(state){
        return _("+div", [
            //Saving a reference to the direct DOM Element
            this.$.title = _( "+h1", `I'm ${state.name}` ).elem,
            
            _( "+p", "I like " + state.likes.join(" & ") )       
        ]);
    }

    update(state, person, changed_keys, changes_count){
        
        if( changes_count != 1 || !("name" in changed_keys) )
            // Too complex to update, proceed to render.
            return true;
            
        else //Update name directly using the DOM reference
            this.$.title
                .textContent = `I'm ${state.name} Directly. 🦄`;
    }
}

let user = new Person();
_("#output-4", user );

user.state.likes.push( "Hulk" ); //This is handled by render()

setTimeout( () => 
    user.state.name = "Jane" //This is handled by update()
, 1000);
```

## Supercharge Native Web Components
CalDOM integrates seamlessly with [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components).
Use CalDOM to create stateful & reactive Web Components. It also accepts web components as inputs.

```js
class CustomElement extends HTMLElement{
    connectedCallback(){
        
        let title = _().react(
            { msg: "Hello World!" },
            {
                render: state => 
                    _( "+h2", state.msg )
            }
        );

        // Appending H2 as a child, keeping root intact
        // this = <custom-element>
        _( this, title );

        //Just a shortcut to access state easily
        this.state = title.state;
    }
    
    doSomething(){
        alert("Cool Eh!");
    }
}

//Registering custom element.
customElements.define("custom-element", CustomElement);

let hello = document.createElement("custom-element");
document.getElementById("output-5-1").appendChild( hello );

hello.state.msg = "I'm a Reactive, Stateful & Native Web Component. 🔥";

//Creating a new web component using CalDOM
_("#output-5-1").prepend( _("+custom-element") )
```

You can use these custom elements in HTML code natively as usual.
Note that browser support for [Web Components](https://caniuse.com/custom-elementsv1) is relatively new (95%). The future looks bright! 🔮

```html
<custom-element onclick="doSomething()">
</custom-element>

<custom-element onclick="state.msg = 'Native Web Components are awesome! ✌️'">
</custom-element>
```

## You can even make jQuery reactive
Basic building box of CalDOM is just native Node/Element. Thus, making it compatible with almost any DOM library on the web.

```js
class HelloJquery extends _.Component{

    constructor(){
        super();

        this.react({ prompt: "" });
    }

    render(state){
        //Creating element & attaching click event using jQuery
        return $("<h1></h1>")
            .text( state.prompt )
            .click( () => state.prompt = "Hello from jQuery!")[0];
    }
}

let app = new HelloJquery();
_("#output-6", app);

app.state.prompt = "Click Me!" 
```

## CalDOM also runs on Node JS
You can use a library like [JS-DOM](https://github.com/jsdom/jsdom) to implement a browser context on the server.

```js
const { JSDOM } = require("jsdom"); 

//Set window in the global scope
window = new JSDOM().window;

const _ = require("caldom");

class ServerApp extends _.Component{

    constructor(){
        super();

        this.react( { msg: "" } );
    }

    render(state){
        return _("+p", state.msg)
            .css("color", "#199646")
    }
}

let app = new ServerApp();
_("body", app);

app.react( { msg: "Hello from NodeJS " + process.version  } );

//Saving generated HTML by the component to a file
require("fs").writeFileSync(
    "static_content.html", 
    window.document.body.innerHTML 
);
```

Visit [caldom.org](https://www.caldom.org) to experiment with many live code examples.

___

# Get Started

## CDN

```html
<script src="https://unpkg.com/caldom"></script>
```
CalDOM is using '_' variable as a global short-hand by default. To use a different alias, set window['_cal_dom_alias'] = 'different_alias' before loading it.

## Download

* Minified versions are at [dist](./dist/)
* Source code is at [src](./src/)

## Use it as a Module
CalDOM is not attaching anything to the global environment when used as a module.

```sh
npm install caldom
```

```js
//CalDOM also runs on Node JS with js-dom
const _ = require('caldom');
```

```js
//RequireJS
requirejs( ["caldom"], function(_){} );
```

```js
//ES6 Module
import _ from "./dist/caldom.min.mjs.js";
```

# Contributing

Your contributions are very welcome and thank you in advance.
Please make sure to unit-test after changes.

## Key Principles

* Performance, being agnostic(interoperability with native DOM) & minimalism is prioritized above all.
* The richness in short-hand methods and features is secondary.
* Supporting legacy browsers is not a priority.

## To-Do
* ~~Implement tests~~
    * Need to expand the variety of tests to different use cases. (Currently, it's biased towards my personal coding style).
* A beginner-friendly documentation/guide. Current one is too technical.
* Implement helpful debug outputs for the development version.
* Thorough browser version tests.
* Further optimize virtual DOM diffing algorithm. [See benchmark here](https://caldom.org/benchmark/)
    * The diffing algorithm is just 140+ lines of code.
    * I believe there is so much room for improvement if some bright minds look at it from a fresh angle.

* Need to benchmark bigger implementations (Like in a spreadsheet where each cell is a sub-component?)

## Building
Currently, the entire source code is in one file. So there isn't a huge build process other than using uglify-js to minify it.

This simply build the .min.js & .min.mjs.js & related .map files in the ./dist/ folder.

```sh
# Install dev dependencies
npm install

# Build
npm run build
```

## Unit Testing & Benchmarking
Tests and benchmarks sources are at the ./tests_and_benchmarks.
CalDOM is using a brand new unit-testing & benchmarking framework called [pFreak](https://github.com/dumijay/pfreak). Which was created as a side project of CalDOM.

Unit test results for the latest build is available at [caldom.org/tests/](https://caldom.org/tests/)

Initiate pFreak after installation to set sym links properly
```shell
pfreak init ./tests_and_benchmarks/internal/
pfreak init ./tests_and_benchmarks/external/
```

Unit Tests
```shell
npm test
```

or 

```shell
pfreak test ./tests_and_benchmarks/internal/
```

Run benchmarks against other libraries (This takes a lot of time, you can run tasks selectively using flags.)

```shell
cd ./tests_and_benchmarks/external/
pfreak benchmark
```

refer pFreak's help for details
```shell
pfreak --help
```
