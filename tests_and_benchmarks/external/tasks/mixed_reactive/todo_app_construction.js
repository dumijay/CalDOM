_pfreak.tasks.push({

    short_name: "todo_app_construction",

    category: "mixed_reactive",
    description: 'A simple Todo App construction.',
    assert_delay: 3000,

    setTaskData: function(config){
        
    },
    
    candidateSetup: function(config){
        _pfreak.clearBody();

        return config;
    },
    
    candidates: {
        "vanilla_js": function(config){

            var container = document.createElement("div");
            document.body.appendChild( container );
            
            _input = null;
            _button = null;

            _input = document.createElement("input");
            _input.setAttribute("type", "text");
            _input.setAttribute("placeholder", "Type item here");

            container.appendChild( _input );

            _button = document.createElement("button");
            
            _button.textContent = "Add";
            _button.style.cursor = "pointer";
            _button.style.marginLeft = "0.5em";

            _button.addEventListener("click", () => {
                var  value = _input.value;

                var new_li = document.createElement("li");
                new_li.setAttribute("class", "todo-item");
                new_li.textContent = value;

                new_li.addEventListener("click", (e) => {
                    e.target.style.textDecoration = "line-through";
                    e.target.classList.add("finished");
                });

                document.getElementById("todo-list").append( new_li );
            });

            container.appendChild(_button);

            var new_ol = document.createElement("ol");
            new_ol.setAttribute("id", "todo-list");

            container.appendChild( new_ol );

            var clear_finished_button = document.createElement("button");
            clear_finished_button.textContent = "Clear Finished";

            clear_finished_button.addEventListener("click", () => {
                var finished_items = document.querySelectorAll("li.finished");

                for( var i = 0; i < finished_items.length; i++ ){
                    finished_items[i].parentNode.removeChild( finished_items[i] );
                }
            });

            container.appendChild( clear_finished_button );

            var clear_all_button = document.createElement("button");
            clear_all_button.textContent = "Clear All";
            clear_all_button.style.marginLeft = "5px";

            clear_all_button.addEventListener("click", () => {
                var all_items = document.querySelectorAll(".todo-item");

                for( var i = 0; i < all_items.length; i++ ){
                    all_items[i].parentNode.removeChild( all_items[i] );
                }
            });

            container.appendChild( clear_all_button );

        },

        "caldom": function(config){
        
            var container = document.createElement("div");
            document.body.appendChild( container );

            _input = null;
            _button = null;

            _( container, [
                _input = _("+input")
                        .attr({
                            type: "text",
                            placeholder: "Type item here",
                        }),
                    
                _button = _("+button", "Add")
                    .css({
                        cursor: "pointer",
                        marginLeft: "0.5em",
                    })
                    .on("click", () => {
                        _("#todo-list", 
                            _("+li", _input.val())
                                    .attr("class", "todo-item")
                                    .on("click", function(){
                                        _(this)
                                            .css("text-decoration", "line-through")
                                            .addClass("finished");
                                    })
                        )
                    }),
                
                _("+ol").attr("id", "todo-list"),
        
                _("+button", "Clear Finished")
                    .on("click", () => {
                        _('li.finished').remove();
                    }),
                
                _("+button", "Clear All")
                    .css("marginLeft", "5px")
                    .on("click", () => {
                        _(".todo-item").remove();
                    })
            ]);
        },

        "umbrellajs": function(config){

            var container = document.createElement("div");
            document.body.appendChild( container );

            _input = null;
            _button = null;

            u( container )
                .append([
                    _input = u("<input>")
                        .attr({
                            type: "text",
                            placeholder: "Type item here",
                        }).nodes[0],
                    
                    _button = u("<button>").text("Add")
                        .each(function(elem){
                            elem.style.cursor = "pointer";
                            elem.style.marginLeft = "0.5em";
                        })
                        .on("click", () => {
                            var value = _input.value;
            
                            u("#todo-list")
                                .append(
                                    u("<li>")
                                        .attr("class", "todo-item")
                                        .text( value )
                                        .on("click", function(){
                                            u(this)
                                                .each(function(elem){
                                                    elem.style.textDecoration = "line-through";
                                                })
                                                .addClass("finished");
                                        })
                                );
                        }).nodes[0],
                    
                    u("<ol>").attr("id", "todo-list").nodes[0],
            
                    u("<button>").text("Clear Finished")
                        .on("click", () => {
                            u('li.finished').remove();
                        }).nodes[0],
                    
                    u("<button>").text("Clear All")
                        .each(function(elem){
                            elem.style.marginLeft = "5px";
                        })
                        .on("click", () => {
                            u(".todo-item").remove();
                        }).nodes[0]
            ]);
        },

        "zepto": function(config){
                        
            var container = document.createElement("div");
            document.body.appendChild( container );

            _input = null;
            _button = null;

            $( container )
                .append(
                    _input = $("<input />")
                        .attr({
                            type: "text",
                            placeholder: "Type item here",
                        }),
                    
                    _button = $("<button></button>").text("Add")
                        .css({
                            cursor: "pointer",
                            marginLeft: "0.5em",
                        })
                        .on("click", () => {
                            var value = _input.val();
            
                            $("#todo-list")
                                .append(
                                    $("<li></li>")
                                        .attr("class", "todo-item")
                                        .text( value )
                                        .on("click", function(){
                                            $(this)
                                                .css("text-decoration", "line-through")
                                                .addClass("finished");
                                        })
                                );
                        }),
                    
                    $("<ol></ol>").attr("id", "todo-list"),
            
                    $("<button></button>").text("Clear Finished")
                        .on("click", () => {
                            $('li.finished').remove();
                        }),
                    
                    $("<button></button>").text("Clear All")
                        .css("marginLeft", "5px")
                        .on("click", () => {
                            $(".todo-item").remove();
                        })
                );
        },

        "jquery": function(config){

            var container = document.createElement("div");
            document.body.appendChild( container );

            _input = null;
            _button = null;

            jQuery( container )
                .append(
                    _input = jQuery("<input />")
                        .attr({
                            type: "text",
                            placeholder: "Type item here",
                        }),
                    
                    _button = jQuery("<button></button>").text("Add")
                        .css({
                            cursor: "pointer",
                            marginLeft: "0.5em",
                        })
                        .on("click", () => {
                            var value = _input.val();
            
                            jQuery("#todo-list")
                                .append(
                                    jQuery("<li></li>")
                                        .attr("class", "todo-item")
                                        .text( value )
                                        .on("click", function(){
                                            jQuery(this)
                                                .css("text-decoration", "line-through")
                                                .addClass("finished");
                                        })
                                );
                        }),
                    
                    jQuery("<ol></ol>").attr("id", "todo-list"),
            
                    jQuery("<button></button>").text("Clear Finished")
                        .on("click", () => {
                            jQuery('li.finished').remove();
                        }),
                    
                    jQuery("<button></button>").text("Clear All")
                        .css("marginLeft", "5px")
                        .on("click", () => {
                            jQuery(".todo-item").remove();
                        })
                );
        },

        "caldom.render": function(config){
            var container = document.createElement("div");
            document.body.appendChild( container );
            
            // ToDo Item Component
            class ToDoItem extends _.Component{

                constructor(state){
                    super();

                    this.react( state );
                }

                render(state){

                    return _("+li", state.task)
                        .css({
                            textDecoration: state.finished 
                                ? "line-through" 
                                : "none" 
                        })
                        .on( "click", () => this.onClick() );
                }

                onClick(){
                    this.state.finished = !this.state.finished;
                }

            }

            //Todo App Component
            class TodoApp extends _.Component{

                constructor(){
                    super();

                    this.react({
                        items: [],
                        input: ""
                    });
                }

                render(state){
                    return _("+div", [
                        _("+input")
                            .attr({
                                type: "text",
                                placeholder: "Type task here"
                            })
                            .val( state.input )
                            .on(
                                "change", 
                                (e) => state.input = e.target.value 
                            ),

                        _("+button", "Add")
                            .on( "click", () => this.addItem() ),

                        //Appending ToDo Item components
                        _("+ol", state.items),
                        
                        _("+button", "Clear Finished")
                            .on( "click", () => this.clearFinished() ),

                        _("+button", "Clear All")
                            .css("marginLeft", "1em")
                            .on( "click", () => this.clearAll() )
                    ]);
                }

                addItem(){
                    this.state.items.push(

                        new ToDoItem({ 
                            task: this.state.input,
                            finished: false
                        })

                    );
                }

                clearAll(){
                    this.state.items = [];
                }

                clearFinished(){
                    for( var i = 0; i < this.state.items.length; i++ ){
                        var item = this.state.items[i];

                        if( item.state.finished )
                            this.state.items.splice(i--, 1);
                    }
                }

            }

            _(container).append( new TodoApp() );
        },

        "caldom.update": function(config){
            var container = document.createElement("div");
            document.body.appendChild( container );
            
            // ToDo Item Component
            class ToDoItem extends _.Component{

                constructor(state){
                    super();

                    this.react( state );
                }

                render(state){

                    return this.$.li = _("+li", state.task)
                        .css({
                            textDecoration: state.finished 
                                ? "line-through" 
                                : "none" 
                        })
                        .on( "click", () => this.onClick() ).elem;
                }

                update( state, component, changed_keys, changes_count ){
                    this.$.li.style
                        .textDecoration = state.finished 
                            ? "line-through" 
                            : "none";
                }

                onClick(){
                    this.state.finished = !this.state.finished;
                }

            }

            //Todo App Component
            class TodoApp extends _.Component{

                constructor(){
                    super();

                    this.react({
                        items: [],
                        input: ""
                    });
                }

                render(state){
                    return _("+div", [
                        _("+input")
                            .attr({
                                type: "text",
                                placeholder: "Type task here"
                            })
                            .val( state.input )
                            .on(
                                "change", 
                                (e) => state.input = e.target.value 
                            ),

                        _("+button", "Add")
                            .on( "click", () => this.addItem() ),

                        //Appending ToDo Item components
                        this.$.ol = _("+ol", state.items),
                        
                        _("+button", "Clear Finished")
                            .on( "click", () => this.clearFinished() ),

                        _("+button", "Clear All")
                            .css("marginLeft", "1em")
                            .on( "click", () => this.clearAll() )
                    ]);
                }

                update(state, component, changed_keys, changes_count ){
                    if( changes_count == 1 ){
                        if( "input" in changed_keys ){
                            return; //Because not expecting changes from outside
                        }
                        else if( "items" in changed_keys ){
                            if( state.items.length == 0 ){
                                this.$.ol.children().remove();
                                return;
                            }
                        }
                    }
                    else if( changes_count == 2 && "length" in changed_keys ){
                        var new_item = state.items[ state.items.length - 1 ];

                        if( new_item ){
                            this.$.ol.append(new_item);
                            
                            return;
                        }
                    }

                    return true; //Proceed to render
                }

                addItem(){
                    this.state.items.push(

                        new ToDoItem({ 
                            task: this.state.input,
                            finished: false
                        })

                    );
                }

                clearAll(){
                    this.state.items = [];
                }

                clearFinished(){
                    for( var i = 0; i < this.state.items.length; i++ ){
                        var item = this.state.items[i];

                        if( item.state.finished )
                            this.state.items.splice(i--, 1);
                    }
                }

            }

            _(container).append( new TodoApp() );
        },

        "vue_keyed": function(config){

            var app_container = document.createElement("div");

            document.body.appendChild(
                app_container
            );

            var TodoApp = Vue.createApp({
                data: function(){
                    return{
                        items: [],
                        input: ""
                    }
                },

                template: ''
                    + '<div>'
                        + '<input type="text" placeholder="Type task here" @change="input = $event.target.value" :value="input" />'
                        + '<button @click="addItem">Add</button>'
                        + '<ol>'
                            + '<todo-item v-for="item in items" v-bind:item="item" :key="item.key"></todo-item>'
                        + '</ol>'
                        + '<button @click="clearFinished">Clear Finished</button>'
                        + '<button @click="clearAll" style="{ marginLeft: 1em }">Clear All</button>'
                    + '</div>',

                methods:{
                    addItem: function(){
                        this.items.push({
                            key: Date.now(),
                            task: this.input,
                            finished: false
                        });
                    },

                    clearAll: function(){
                        this.items = [];
                    },

                    clearFinished: function(){
                        for( var i = 0; i < this.items.length; i++ ){
                            var item = this.items[i];

                            if( item.finished )
                                this.items.splice(i--, 1);
                        }
                    }
                }
            });

            TodoApp.component('todo-item', {
                props: ["item"],
                methods: {
                    getTextDecoration: function(finished){
                        return finished ? 'line-through' : 'none';
                    }
                },
                template: '<li @click="item.finished = !item.finished" :style="{ textDecoration: getTextDecoration(item.finished)  }">{{ item.task }}</li>'
            });

            return TodoApp.mount( app_container );
        },

        "vue_non_keyed": function(config){

            var app_container = document.createElement("div");

            document.body.appendChild(
                app_container
            );

            var TodoApp = Vue.createApp({
                data: function(){
                    return{
                        items: [],
                        input: ""
                    }
                },

                template: ''
                    + '<div>'
                        + '<input type="text" placeholder="Type task here" @change="input = $event.target.value" :value="input" />'
                        + '<button @click="addItem">Add</button>'
                        + '<ol>'
                            + '<todo-item v-for="item in items" v-bind:item="item"></todo-item>'
                        + '</ol>'
                        + '<button @click="clearFinished">Clear Finished</button>'
                        + '<button @click="clearAll" style="{ marginLeft: 1em }">Clear All</button>'
                    + '</div>',

                methods:{
                    addItem: function(){
                        this.items.push({
                            key: Date.now(),
                            task: this.input,
                            finished: false
                        });
                    },

                    clearAll: function(){
                        this.items = [];
                    },

                    clearFinished: function(){
                        for( var i = 0; i < this.items.length; i++ ){
                            var item = this.items[i];

                            if( item.finished )
                                this.items.splice(i--, 1);
                        }
                    }
                }
            });

            TodoApp.component('todo-item', {
                props: ["item"],
                methods: {
                    getTextDecoration: function(finished){
                        return finished ? 'line-through' : 'none';
                    }
                },
                template: '<li @click="item.finished = !item.finished" :style="{ textDecoration: getTextDecoration(item.finished)  }">{{ item.task }}</li>'
            });

            return TodoApp.mount( app_container );
        },

        "react_keyed": function(config){

            var container = document.createElement("div");
            document.body.appendChild( container );

            class TodoItem extends React.Component{
                constructor(props){
                    super(props)

                    this.state = {
                        key: props.key,
                        task: props.task,
                        finished: props.finished
                    }
                }

                render(){
                    return React.createElement(
                        "li",
                        {
                            style:{
                                textDecoration: this.state.finished ? "line-through" : "none"
                            },
                            key: this.state.key,
                            onClick: () => this.onClick()
                        },
                        this.state.task
                    )
                }

                onClick(){
                    this.setState( (state) => ({
                        finished: !state.finished
                    }));
                }
            }

            class TodoApp extends React.Component{

                constructor(props){
                    super(props);

                    this.state = {
                        items: [],
                        input: ""
                    }
                }

                render(){
                    return React.createElement(
                        "div", null,
                        
                        React.createElement(
                            "input",
                            {
                                placeholder: "Type task here",
                                type: "text",
                                value: this.state.input,
                                onChange: (e) => this.state.input = e.target.value
                            }
                        ),

                        React.createElement(
                            "button",
                            {
                                onClick: () => this.addItem()
                            },
                            "Add"
                        ),

                        React.createElement(
                            "ol",
                            null,
                            this.state.items
                        ),

                        React.createElement(
                            "button",
                            {
                                onClick: () => this.clearFinished()
                            },
                            "Clear Finished"
                        ),

                        React.createElement(
                            "button",
                            {
                                style:{
                                    marginLeft: "1em"
                                },
                                onClick: () => this.clearAll()
                            },
                            "Clear All"
                        ),
                        
                    );
                }

                addItem(){
                    var new_item = React.createElement(
                        TodoItem,
                        {
                            key: Date.now(),
                            task: this.state.input,
                            finished: false
                        }
                    );

                    this.setState( state => ({
                        items: state.items.concat( new_item )
                    }));
                }

                clearAll(){
                    this.setState({
                        items: []
                    });
                }

                clearFinished(){
                    //Getting child's state is complicated 🤷‍♂️. Most recommended(?) way is to implement a callback to parent https://towardsdatascience.com/passing-data-between-react-components-parent-children-siblings-a64f89e24ecf.
                    //Since that contradict from above implementations, decided to ignore clearFinished functionality.
                    //This will reduce execution time a tiny tiny bit as this codeblock is not parsed.
                    //(Meaning, this will be slightly benefitial for the benchmark of React)

                    // var unfinished_items = [];

                    // for( var i = 0; i < this.state.items.length; i++ ){
                        
                    // }

                    // this.setState({
                    //     items: unfinished_items
                    // });
                }
            }

            ReactDOM.render( React.createElement(TodoApp, null), container );
        },

        "react_non_keyed": function(config){

            var container = document.createElement("div");
            document.body.appendChild( container );

            class TodoItem extends React.Component{
                constructor(props){
                    super(props)

                    this.state = {
                        key: props.key,
                        task: props.task,
                        finished: props.finished
                    }
                }

                render(){
                    return React.createElement(
                        "li",
                        {
                            style:{
                                textDecoration: this.state.finished ? "line-through" : "none"
                            },
                            onClick: () => this.onClick()
                        },
                        this.state.task
                    )
                }

                onClick(){
                    this.setState( (state) => ({
                        finished: !state.finished
                    }));
                }
            }

            class TodoApp extends React.Component{

                constructor(props){
                    super(props);

                    this.state = {
                        items: [],
                        input: ""
                    }
                }

                render(){
                    return React.createElement(
                        "div", null,
                        
                        React.createElement(
                            "input",
                            {
                                placeholder: "Type task here",
                                type: "text",
                                value: this.state.input,
                                onChange: (e) => this.state.input = e.target.value
                            }
                        ),

                        React.createElement(
                            "button",
                            {
                                onClick: () => this.addItem()
                            },
                            "Add"
                        ),

                        React.createElement(
                            "ol",
                            null,
                            this.state.items
                        ),

                        React.createElement(
                            "button",
                            {
                                onClick: () => this.clearFinished()
                            },
                            "Clear Finished"
                        ),

                        React.createElement(
                            "button",
                            {
                                style:{
                                    marginLeft: "1em"
                                },
                                onClick: () => this.clearAll()
                            },
                            "Clear All"
                        ),
                        
                    );
                }

                addItem(){
                    var new_item = React.createElement(
                        TodoItem,
                        {
                            key: Date.now(),
                            task: this.state.input,
                            finished: false
                        }
                    );

                    this.setState( state => ({
                        items: state.items.concat( new_item )
                    }));
                }

                clearAll(){
                    this.setState({
                        items: []
                    });
                }

                clearFinished(){
                    //Getting child's state is complicated 🤷‍♂️. Most recommended(?) way is to implement a callback to parent https://towardsdatascience.com/passing-data-between-react-components-parent-children-siblings-a64f89e24ecf.
                    //Since that contradict from above implementations, decided to ignore clearFinished functionality.
                    //This will reduce execution time a tiny tiny bit as this codeblock is not parsed.
                    //(Meaning, this will be slightly benefitial for the benchmark of React)

                    // var unfinished_items = [];

                    // for( var i = 0; i < this.state.items.length; i++ ){
                        
                    // }

                    // this.setState({
                    //     items: unfinished_items
                    // });
                }
            }

            ReactDOM.render( React.createElement(TodoApp, null), container );
        }
    },

    assert: function(config, test_return){
        return new Promise( function(resolve, reject){ //Using a promise because throws inside setTimeout doesn't actually throws :)

            function setNativeValue(element, value) {

                // Because dispatchEvent( new Event("change") ) doesn't work on React 🤷‍♂️ 
                // https://stackoverflow.com/questions/23892547/what-is-the-best-way-to-trigger-onchange-event-in-react-js
                
                const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
                const prototype = Object.getPrototypeOf(element);
                const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;
        
                if (valueSetter && valueSetter !== prototypeValueSetter) {
                    prototypeValueSetter.call(element, value);
                } else {
                    valueSetter.call(element, value);
                }
            }

            temp_holder = {};

            temp_holder.task_input = document.querySelectorAll("input[type=text]")[0];
            temp_holder.buttons = document.querySelectorAll("button");
            
            temp_holder.add_button = temp_holder.buttons[0];
            temp_holder.clear_finished_button = temp_holder.buttons[1];
            temp_holder.clear_all_button = temp_holder.buttons[2];
            
            function addItem(){
                if( config.candidate == "react_keyed" || config.candidate == "react_non_keyed"){
                    setNativeValue(temp_holder.task_input, Math.random()); 
                    temp_holder.task_input.dispatchEvent(new Event('input', { bubbles: true }));
                }
                else{
                    temp_holder.task_input.value = Math.random();
                    temp_holder.task_input.dispatchEvent( new Event("change") );
                }
                
                temp_holder.add_button.click();
            }
            
            addItem();
            addItem();
            addItem();

            setTimeout( function(){

                temp_holder.list_items = document.querySelectorAll("li");

                if( temp_holder.list_items.length != 3 ) reject( "list_item.length = " + temp_holder.list_items.length );

                temp_holder.list_items[1].click();

                setTimeout( function(){
                    if( temp_holder.list_items[1].style.textDecoration != "line-through" ) reject( "list_item[1].style.textDecoration = " + temp_holder.list_items[1].style.textDecoration );

                    // temp_holder.clear_finished_button.click(); //Not asserting this because not implemented in React. Refer candidate code above.

                    setTimeout( function(){
                        // if( temp_holder.list_items.length != 2 ) reject( "list_item.length = " + temp_holder.list_items.length );

                        temp_holder.clear_all_button.click();

                        setTimeout( function(){
                            temp_holder.list_items = document.querySelectorAll("li");
                            if( temp_holder.list_items.length != 0 ) reject( "list_item.length = " + temp_holder.list_items.length );

                            addItem();
                            addItem();
                            addItem();
                            addItem();
                            addItem();

                            setTimeout( function(){
                                temp_holder.list_items = document.querySelectorAll("li");

                                if( temp_holder.list_items.length != 5 ) reject( "list_item.length = " + temp_holder.list_items.length );

                                resolve();
                            }, 500);
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        });
    },

    reset: function(){
        _pfreak.clearBody();
        _input = null;
        _button = null;
        delete window.temp_holder;
    }
})