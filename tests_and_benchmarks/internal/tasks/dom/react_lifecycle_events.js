_pfreak.tasks.push({

    short_name: "react_lifecycle_events",
    display_order: 89,
    category: "dom",
    description: "",
    assert_delay: 1500,

    setTaskData: function(config){
        return config;
    },
    
    candidateSetup: function(config){
        _pfreak.clearBody();
        
        window.pfreak_events = [];
        window.pfreak_render_params = [];
        window.pfreak_update_params = [];
        
        var div = document.createElement("div");

        div.innerHTML = 
            '<div class="container">'
            + '</div>';

        document.body.appendChild( div );

        config.caldomInstance = _( ".container" );

        return config;
    },
    
    candidates: {
        "caldom": function(config){
            var app = _().react(
                {
                    greeting: "Hello World"
                },

                {
                    render: function(state, component){

                        window.pfreak_events.push("render");
                        window.pfreak_render_params.push( state, component );

                        return _( "+h1", [ state.greeting ] );
                    },

                    update: function(state, component, changed_keys, changes_counts){
                        window.pfreak_events.push("update");
                        window.pfreak_update_params.push( state, component, changed_keys, changes_counts );

                        this.find("h1").text( "Updated" );
                    },

                    willMount: function(){
                        window.pfreak_events.push("willMount");
                    },

                    didMount: function(){
                        window.pfreak_events.push("didMount");
                    },

                    willUnmount: function(){
                        window.pfreak_events.push("willUnmount");
                    },

                    didUnmount: function(){
                        window.pfreak_events.push("didUnmount");
                    },

                    didUpdate: function(){
                        window.pfreak_events.push("didUpdate");
                    },
                }
            );

            config.caldomInstance.append( app );
            app.state.greeting = "New Greeting";

            setTimeout(function(){
                app.remove();
                app.state.greeting = "Another Update";
            }, 500);
            
        }

    },

    assert: function(config, test_return){
        var events_error = "Didn't match events. Actual events: " + window.pfreak_events.join(", ");
        
        if( window.pfreak_events.length != 8 ) throw events_error;
        
        var i = 0;
        if( window.pfreak_events[i++] != "willMount" ) throw events_error;
        if( window.pfreak_events[i++] != "render" ) throw events_error;
        if( window.pfreak_events[i++] != "didUpdate" ) throw events_error;
        if( window.pfreak_events[i++] != "didMount" ) throw events_error;
        if( window.pfreak_events[i++] != "update" ) throw events_error;
        if( window.pfreak_events[i++] != "didUpdate" ) throw events_error;
        if( window.pfreak_events[i++] != "willUnmount" ) throw events_error;
        if( window.pfreak_events[i++] != "didUnmount" ) throw events_error;

        if( window.pfreak_render_params[0].greeting != "Another Update" ) throw "Render state param mismatch";
        if( !(window.pfreak_render_params[1] instanceof _.Component) ) throw  "Render component param mismatch" + window.pfreak_render_params[1];
        
        if( window.pfreak_update_params[0].greeting != "Another Update" ) throw  "Update state param mismatch";
        if( !(window.pfreak_update_params[1] instanceof _.Component) ) throw "Update component param mismatch";
        if( window.pfreak_update_params[2].greeting !== true ) throw "Update changed_keys param mismatch" + window.pfreak_update_params[2];
        if( window.pfreak_update_params[3] != 1 ) throw "Update changes_count param mismatch";
    },

    reset: function(){
        _pfreak.clearBody();
        
        delete window.pfreak_render_params;
        delete window.pfreak_update_params;
        delete window.pfreak_events;
    }
})