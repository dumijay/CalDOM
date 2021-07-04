_pfreak.tasks.push({

    short_name: "react_nested_components_es6",
    display_order: 94,
    category: "dom",
    description: "",
    assert_delay: 1000,

    setTaskData: function(config){
        return config;
    },
    
    candidateSetup: function(config){
        _pfreak.clearBody();

        window.pfreak_render_count = 0;
        window.pfreak_update_count = 0;

        return config;
    },
    
    candidates: {
        "caldom": function(config){
            
            class ParentApp extends _.Component{

                constructor(){
                    super();

                    this.react(
                        {
                            child_apps: []
                        }
                    );
                }

                render(state){
                    window.pfreak_render_count++;
        
                    return _("+div", [
                        _("+span", ["Child App:"]),
                        _("+ul", state.child_apps )
                    ]);
                }
            }

            class ChildApp extends _.Component{

                constructor(){
                    super();
                    
                    this.react(
                        {
                            time: Date.now()
                        }
                    );
                }

                render(state){
                    window.pfreak_render_count++;
        
                    return _( "+p", [state.time] );
                }
                
                update(state){
                    window.pfreak_update_count++
                    this.text( state.time );
                }
            }

            var parentApp = new ParentApp();

            _("body").append( parentApp );

            parentApp.state.child_apps.push( new ChildApp() );
            parentApp.state.child_apps.push( new ChildApp() );
            parentApp.state.child_apps.push( new ChildApp() );
            parentApp.state.child_apps.push( new ChildApp() );

            parentApp.state.child_apps.splice(2, 1);
            parentApp.state.child_apps[2].state.time = "asdfsdf";

            parentApp.state.child_apps.push( new ChildApp() );
            parentApp.state.child_apps.push( new ChildApp() );
        }
    },

    assert: function(config, test_return){

        if( document.querySelectorAll("span").length != 1 ) throw "Span not found";
        if( document.querySelectorAll("span")[0].textContent != "Child App:" ) throw "Span's text is " + document.querySelectorAll("span")[0].textContent;

        if( document.querySelectorAll("p").length != 5 ) throw "P count is not 5. Actual: " + document.querySelectorAll("p").length;
        if( document.querySelectorAll("p")[2].textContent != "asdfsdf" ) throw "p[2] text is " + document.querySelectorAll("p")[2].textContent;

        if( window.pfreak_render_count != 7 ) throw "Render count is " + window.pfreak_render_count;
        if( window.pfreak_update_count != 1 ) throw "Update count is " + window.pfreak_update_count;
    },

    reset: function(){
        _pfreak.clearBody();

        delete window.pfreak_render_count;
        delete window.pfreak_update_count;
    }
});