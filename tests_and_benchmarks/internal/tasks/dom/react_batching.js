_pfreak.tasks.push({

    short_name: "react_batching",
    display_order: 90,
    category: "dom",
    description: "",
    assert_delay: 1000,

    setTaskData: function(config){
        return config;
    },
    
    candidateSetup: function(config){
        _pfreak.clearBody();
        
        var div = document.createElement("div");

        window.pfreak_events = [];

        div.innerHTML = 
            '<div class="container">'
            + '</div>';

        document.body.appendChild( div );

        config.caldomInstance = _( ".container" ).react(
            {
                greeting: "Hello World"
            },

            {
                render: function(state){
                    window.pfreak_events.push( "rendered" );

                    return _("+div")
                        .addClass("container")
                        .append(
                            _( "+h1", [ state.greeting ] )
                        )
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
                config.caldomInstance.state.greeting = Date.now();
                config.caldomInstance.react();
            }
            
            config.caldomInstance.state.greeting = "Last Update";
            config.caldomInstance.react();
        }
    },

    assert: function(config, test_return){
        
        var items = document.querySelectorAll(".container");

        if( items[0].children[0].tagName != "H1" ) throw false;
        if( items[0].children[0].textContent != "Last Update" ) throw false;
        if( window.pfreak_events.length != 2 ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})