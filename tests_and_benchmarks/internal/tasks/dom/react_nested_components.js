_pfreak.tasks.push({

    short_name: "react_nested_components",
    display_order: 93,
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
            
            var ParentApp = function(){
                return _().react(
                    {
                        child_apps: []
                    },
                    {
                        render(state){
                            window.pfreak_render_count++;
                
                            return _("+div", [
                                _("+span", ["Child App:"]),
                                _("+ul", state.child_apps )
                            ]);
                        }
                    }
                );
            }

            var ChildApp = function(){
                return _().react(
                    {
                        time: Date.now()
                    },
                    {
                        render(state){
                            window.pfreak_render_count++;
                
                            return _( "+li", [state.time] );
                        },

                        update(state){
                            window.pfreak_update_count++
                            this.text( state.time );
                        }
                    }
                );
            }

            var parentApp = ParentApp();

            _("body").append( parentApp );

            parentApp.state.child_apps.push( ChildApp() );
            parentApp.state.child_apps.push( ChildApp() );
            parentApp.state.child_apps.push( ChildApp() );
            parentApp.state.child_apps.push( ChildApp() );

            parentApp.state.child_apps.splice(2, 1);
            parentApp.state.child_apps[2].state.time = "asdfsdf";

            parentApp.state.child_apps.push( ChildApp() );
            parentApp.state.child_apps.push( ChildApp() );

            return parentApp;
        }
    },

    assert: function(config, test_return){

        if( document.querySelectorAll("span").length != 1 ) throw "Span not found";
        if( document.querySelectorAll("span")[0].textContent != "Child App:" ) throw "Span's text is " + document.querySelectorAll("span")[0].textContent;

        var list_items = document.querySelectorAll("li");

        if( list_items.length != 5 ) throw "P count is not 5. Actual: " + list_items.length;
        if( list_items[2].textContent != "asdfsdf" ) throw "p[2] text is " + list_items[2].textContent;

        for( var i = 0; i < list_items.length; i++ ){
            if( list_items[i] !== test_return.state.child_apps[i].elems[0] )
                throw "Actual DOM nodes[i] doesn't match child component's .elems[i]"
        }

        if( window.pfreak_render_count != 7 ) throw "Render count is " + window.pfreak_render_count;
        if( window.pfreak_update_count != 1 ) throw "Update count is " + window.pfreak_update_count;
    },

    reset: function(){
        _pfreak.clearBody();

        delete window.pfreak_render_count;
        delete window.pfreak_update_count;
    }
});