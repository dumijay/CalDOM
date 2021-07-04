_pfreak.tasks.push({

    short_name: "react_state_change_keys_count",
    display_order: 92,
    category: "dom",
    description: "",
    assert_delay: 3000,

    setTaskData: function(config){
        return config;
    },
    
    candidateSetup: function(config){
        _pfreak.clearBody();
        
        var div = document.createElement("div");

        window.pfreak_events_first = [];
        window.pfreak_first_done = false;
        window.pfreak_events_second = [];

        div.innerHTML = 
            '<div class="container">'
            + '</div>';

        document.body.appendChild( div );

        config.caldomInstance = _( ".container" ).react(
            {
                greeting: "Hello World",
                unchanged_var: "Bla"
            },

            {
                render: function(state){
                    return _("+div")
                        .addClass("container")
                        .append(
                            _( "+h1", [ state.greeting ] )
                        )
                },

                update: function( state, component, changed_keys, change_count ){
                    if( !pfreak_first_done ){
                        pfreak_events_first.push([changed_keys, change_count]);
                    }
                    else{
                        pfreak_events_second.push([changed_keys, change_count]);
                    }
                }
            }
        );

        return config;
    },
    
    candidates: {
        "caldom": function(config){
            config.caldomInstance.state.greeting = "New Text";
            config.caldomInstance.react();
            
            for( var i = 0; i < 100; i++ ){
                config.caldomInstance.state.time = Date.now();
                config.caldomInstance.react();
            }
            
            config.caldomInstance.state.greeting = "Last Update";
            config.caldomInstance.state.new_var = "Last Update";
            config.caldomInstance.state.deep_level = {};
            config.caldomInstance.state.deep_level.deep_child = "Test";
            config.caldomInstance.react();

            setTimeout(function(){
                pfreak_first_done = true;
    
                config.caldomInstance.state.greeting = "New Text";
                config.caldomInstance.react();
                
                for( var i = 0; i < 50; i++ ){
                    config.caldomInstance.state.time = Date.now();
                    config.caldomInstance.react();
                }
                
                config.caldomInstance.state.greeting = "Last Update";
                config.caldomInstance.state.another_new_var = "Last Update";
                delete config.caldomInstance.state.new_var;
                config.caldomInstance.react();
            }, 1000);
        }
    },

    assert: function(config, test_return){

        if( window.pfreak_events_first.length != 1 ) throw window.pfreak_events_first.length;
        if( window.pfreak_events_second.length != 1 ) throw false;
        
        if( !( "greeting" in window.pfreak_events_first[0][0]) ) throw false;
        if( !( "time" in window.pfreak_events_first[0][0]) ) throw false;
        if( !( "new_var" in window.pfreak_events_first[0][0]) ) throw false;
        if( !( "deep_level" in window.pfreak_events_first[0][0]) ) throw false;
        if( !( "deep_child" in window.pfreak_events_first[0][0]) ) throw false;
        if( ( "unchanged_var" in window.pfreak_events_first[0][0]) ) throw false;

        if( window.pfreak_events_first[0][1] != 105 ) throw false;
        
        if( !( "greeting" in window.pfreak_events_second[0][0]) ) throw false;
        if( !( "time" in window.pfreak_events_second[0][0]) ) throw false;
        if( !( "new_var" in window.pfreak_events_second[0][0]) ) throw false;
        if( !( "another_new_var" in window.pfreak_events_second[0][0]) ) throw false;
        if( ( "unchanged_var" in window.pfreak_events_second[0][0]) ) throw false;

        if( window.pfreak_events_second[0][1] != 54 ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})