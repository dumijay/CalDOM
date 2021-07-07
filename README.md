![CalDOM JS Logo](https://www.caldom.org/images/caldom_logo.png)

A minimalist (3kb) and performant JavaScript UI library inspired by jQuery & Reactive Components.

Instead of micromanaging everything, CalDOM let you **fully access the DOM** directly while keeping the **reactivity** 💥.
So you could take full advantage of native APIs & even mix it with other libraries to gain superior performance & flexibility in the development process.

In essence, CalDOM is just a wrapper around the native Node/Element. The overall performance drop is about 0.05x compared to vanilla/pure JavaScript. This is based on averaged unit level benchmarks in handling single & multiple-element instances: [View Benchmark Results](https://caldom.org/benchmark/) against Vanilla JS, jQuery, React JS, Vue &amp; more.

Official site: [caldom.org](https://www.caldom.org)

Documentation: [caldom.org/docs/](https://caldom.org/docs/)

# Basic Syntax

## Hello World!
```js
_("#output-1")
    .append(
        _("+h1").text("Hello World!")
    );


//Short form
_( "#output-1", [ _("+h2", ["This is CalDOM."]) ]); 
```

## Hello World - Reactive
```js
var app = _().react(
    {},
    {
        render: function(state){
            return _("+h1")
                .text( `Hello ${state.name}` );
        }
    }
)

_("#output-2").append( app );

//Edit below line to update state
app.state.name = "World Reactively 💥";
```

## Hello World - Reactive (ES6)
```js
class HelloWorld extends _.Component{
 
    constructor(state){
        super();
   
        this.react(state);
    }
 
    render(state){
        return _("+div")
                .append(
                    _("+h1").text( "Hello " + state.name ),
                    
                    //Can pass children as an array too
                    _( "+p", ["The time is: ", state.time] )
                )
    }

    tick(){
        this.state.time = new Date().toTimeString().substr(0, 8);
    }

    didMount(){
        setInterval( () => this.tick(), 1000);
    }
 
}

let app = new HelloWorld( { name: "World!", time: "" } );

_("#output-3").append( app );
```


## Make existing HTML reactive
Not a fan of rendering & virtual-DOM thingies? Use CalDOM to update pre-defined HTML content reactively.
```js
var person_one = _("#person-1").react(
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

```js
class Person extends _.Component{
    constructor(){
        super();

        this.react({ name: "John", likes: ["SpongeBob"] });
    }

    render(state){
        return _("+div")
            .append(
                _("+h1", [ "I'm " + state.name ]),
                _("+p", [ "I like " + state.likes.join(" & ") ])
            );
    }

    update(state, person, changed_keys, changes_count){
        
        if( changes_count != 1 || !("name" in changed_keys) ){
            
            // Too complex to update,
            return true; //to proceed to render.
        }
        else{ //Update changed name directly
            this.find("h1")
                .text( `I'm ${state.name} Directly. 🦄` );
        }
    }
}

var user = new Person();
_("#output-4").append( user );

user.state.likes.push( "Hulk" ); //This is handled by render()

setTimeout( () => 
    user.state.name = "Jane" //This is handled by update()
, 1000);
```

## You can even make jQuery reactive
Basic building box of CalDOM is just native Node/Element. Thus, making it compatible with almost any library on the web.

```js
class HelloJquery extends _.Component{

    constructor(){
        super();

        this.react({ prompt: "Click Me!" });
    }

    render(state){

        //Creating element & attaching click event using jQuery
        return $("<h1></h1>")
            .text( state.prompt )
            .click( () => state.prompt = "Hello from jQuery!")[0];
    }
}

let app = new HelloJquery();

_("#output-6").append( app );
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
        return _("+p")
            .css("color", "#199646")
            .text( state.msg );
    }
}

let app = new ServerApp();
_("body").append( app );

app.react( { msg: "Hello from NodeJS " + process.version  } );

//Saving generated HTML by the component to a file
require("fs").writeFileSync(
    "static_content.html", 
    window.document.body.innerHTML 
);
```

Visit [caldom.org](https://www.caldom.org) to experiment with many live code examples.


# Get Started

## CDN

```html
<script src="https://unpkg.com/caldom"></script>
```

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
var _ = require('caldom');
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

## Key Principles

* Performance and minimalism is #1 priority.
* The richness in short-hand methods and features is secondary.
* Supporting legacy browsers is not a priority.

## To-Do
* ~~Implement tests~~
* Implement helpful debug outputs for the development version
* Thorough browser version tests
* Further optimize virtual DOM diffing algorithm

## Building
Currently the entire source code is in one file, so there isn't a huge build process other than using uglify-js to minify it.

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