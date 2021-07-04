_pfreak.tasks.push({

    short_name: "react_render_state_change",
    display_order: 84,
    category: "dom",
    description: "",
    assert_delay: 500,

    setTaskData: function(config){
        return config;
    },
    
    candidateSetup: function(config){
        _pfreak.clearBody();
        
        var div = document.createElement("div");

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
        }
    },

    assert: function(config, test_return){
        
        var items = document.querySelectorAll(".container");

        if( items[0].children[0].tagName != "H1" ) throw false;
        if( items[0].children[0].textContent != "New Text" ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})