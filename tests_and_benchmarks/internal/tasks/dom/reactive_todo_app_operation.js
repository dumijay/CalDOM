_pfreak.tasks.push({

    short_name: "reactive_todo_app_operation",
    display_order: 119,
    category: "dom",
    description: "",
    assert_delay: 0,

    setTaskData: function(config){
        return config;
    },
    
    candidateSetup: function(config){
        _pfreak.clearBody();

        var container = document.createElement("div");
        document.body.appendChild( container );
        
        // ToDo Item Component
        class ToDoItem extends _.Component{

            constructor(state){
                super();

                this.react( state );
            }

            render(state){

                return _("+li", [state.task])
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

                    _("+button", ["Add"])
                        .on( "click", () => this.addItem() ),

                    //Appending ToDo Item components
                    _("+ol", state.items),
                    
                    _("+button", ["Clear Finished"])
                        .on( "click", () => this.clearFinished() ),

                    _("+button", ["Clear All"])
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

        config.app = new TodoApp();

        _(container).append( config.app );

        return config;
    },
    
    candidates: {
        "caldom": function(config){
            //Doing nothing
        }
    },

    assert: async function(config, test_return){

        var delay = 300;
        var task_id = 0;

        function operate(){
            return new Promise(function(resolve, reject){
                setTimeout(async function(){
                    temp_holder = {};

                    temp_holder.task_input = document.querySelectorAll("input[type=text]")[0];
                    temp_holder.buttons = document.querySelectorAll("button");
                    
                    temp_holder.add_button = temp_holder.buttons[0];
                    temp_holder.clear_finished_button = temp_holder.buttons[1];
                    temp_holder.clear_all_button = temp_holder.buttons[2];
                    
                    function addItem(){
                        return new Promise(function(resolveAddItem){
                
                            temp_holder.task_input.value = task_id++;
                            temp_holder.task_input.dispatchEvent( new Event("change") );
                            
                            temp_holder.add_button.click();
                            
                            resolveAddItem();
                        });
                    }
                    
                    await addItem();
                    await addItem();
                    await addItem();
                    await addItem();
                    await addItem();
                    await addItem();
                    await addItem();
                    await addItem();
                    await addItem();
                    await addItem();

                    setTimeout( function(){

                        temp_holder.list_items = document.querySelectorAll("li");

                        for( var i = 0; i < 10; i ++ ){
                            if( temp_holder.list_items[i].textContent != i ) reject("li's text is " + temp_holder.list_items[i].textContent);
                        }

                        if( temp_holder.list_items.length != 10 ) reject( "Fist Check: list_item.length = " + temp_holder.list_items.length );

                        temp_holder.list_items[1].click();
                        temp_holder.list_items[3].click();
                        temp_holder.list_items[5].click();
                        temp_holder.list_items[7].click();
                        temp_holder.list_items[9].click();

                        setTimeout( function(){
                            var finished_i = -1;

                            if( temp_holder.list_items[finished_i += 2].style.textDecoration != "line-through" ) reject( "list_item[1].style.textDecoration = " + temp_holder.list_items[finished_i].style.textDecoration );
                            if( temp_holder.list_items[finished_i += 2].style.textDecoration != "line-through" ) reject( "list_item[3].style.textDecoration = " + temp_holder.list_items[finished_i].style.textDecoration );
                            if( temp_holder.list_items[finished_i += 2].style.textDecoration != "line-through" ) reject( "list_item[5].style.textDecoration = " + temp_holder.list_items[finished_i].style.textDecoration );
                            if( temp_holder.list_items[finished_i += 2].style.textDecoration != "line-through" ) reject( "list_item[7].style.textDecoration = " + temp_holder.list_items[finished_i].style.textDecoration );
                            if( temp_holder.list_items[finished_i += 2].style.textDecoration != "line-through" ) reject( "list_item[9].style.textDecoration = " + temp_holder.list_items[finished_i].style.textDecoration );

                            temp_holder.clear_finished_button.click();

                            setTimeout( async function(){

                                temp_holder.list_items = document.querySelectorAll("li");

                                var odd = -2;
                                for( var i = 0; i < 5; i ++ ){
                                    if( temp_holder.list_items[i].textContent != (odd += 2) ) reject("li's text is " + temp_holder.list_items[i].textContent);
                                    if( temp_holder.list_items[i].style.textDecoration != "none" ) reject( "list_item[i].style.textDecoration = " + temp_holder.list_items[i].style.textDecoration );
                                }

                                setTimeout( async function(){
                                    // if( temp_holder.list_items.length != 2 ) reject( "list_item.length = " + temp_holder.list_items.length );

                                    temp_holder.clear_all_button.click();

                                    setTimeout( async function(){
                                        temp_holder.list_items = document.querySelectorAll("li");
                                        if( temp_holder.list_items.length != 0 ) reject( "After Clear All: list_item.length = " + temp_holder.list_items.length );

                                        await addItem();
                                        await addItem();
                                        await addItem();
                                        await addItem();
                                        await addItem();

                                        setTimeout(function(){

                                            temp_holder.list_items = document.querySelectorAll("li");

                                            for( var i = 0; i < 5; i++ ){
                                                if( temp_holder.list_items[i].textContent != i + 10 ) reject("li's text is " + temp_holder.list_items[i].textContent);
                                                if( temp_holder.list_items[i].style.textDecoration != "none" ) reject( "list_item[i].style.textDecoration = " + temp_holder.list_items[i].style.textDecoration );
                                            }
                                        
                                            if( temp_holder.list_items.length != 5 ) throw( "Final list_item.length = " + temp_holder.list_items.length );

                                            resolve();
                                        }, delay);
                                    }, delay);
                                }, delay);
                            }, delay);
                        }, delay);
                    }, delay);
                }, delay);
            });
        }

        await  operate();
    },

    reset: function(){
        _pfreak.clearBody();
    }
});