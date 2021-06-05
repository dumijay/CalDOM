# CalDOM

![CalDOM JS Logo](https://www.caldom.org/images/caldom_logo.png)

A minimalist (2.7kb) JavaScript UI library inspired by jQuery & Reactive Components.

Since the library is just wrapping the official DOM API, the performance drop is about 1.2X compared to vanilla/pure JavaScript based on unit level benchmarks: [View Benchmark Results](https://caldom.org/benchmark/)

Official site: [caldom.org](www.caldom.org)


Documentation: [caldom.org/docs/](caldom.org/docs/)

# Basic Syntax

## Hello World!
```js
_("body")
    .append(
        _("+h1").text("Hello World!")
    );

```

## Hello World - Reactive
```js
var app = _().react(
    { name: "World!" },
    {
        render: function(state){
            return _("+h1").text( `Hello ${state.name}` );
        }
    }
)

_("body").append( app );

//Edit below line to update state
app.state.name = "CalDOM!";
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
                    _( "+p", ["Time is: ", state.time] )
                )
    }

    tick(){
        this.state.time = new Date().toTimeString();
    }

    didMount(){
        setInterval( () => this.tick(), 1000);
    }
 
}

let app = new HelloWorld( { name: "World!", time: "" } );

_("body").append( app );
```

## CalDOM also runs on Node JS
You can use a library like [JS-DOM](<https://github.com/jsdom/jsdom>) to implement a browser context on the server.

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


Visit [caldom.org](www.caldom.org) to experiment with many live code examples.

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
import _ from "./dist/caldom-1.0.5.min.mjs.js";
```

# Contributing

Your contributions are very welcome and thank you in advance.

## Key Principles

* Performance and minimalism is #1 priority.
* The richness in short-hand methods and features is secondary.
* Supporting legacy browsers is not a priority.

## To-Do
* Implement tests
* Implement helpful debug outputs for the development version
* Thorough browser version tests
* Further optimize virtual DOM diffing algorithm