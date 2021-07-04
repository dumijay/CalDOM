_pfreak.tasks.push({

    short_name: "on_string_single_event",
    display_order: 59,
    category: "events",
    description: "",
    assert_delay: 0,

    setTaskData: function(config){
        return config;
    },
    
    candidateSetup: function(config){
        _pfreak.clearBody();

        window.test_events = [];

        config.onEventCallback = function(e){
            window.test_events.push( e.target );
        }
        
        var div = document.createElement("div");

        div.innerHTML = 
            '<div class="container">'
                + '<input type="text" value="one" />'
                + '<input type="text" value="two" />'
            + '</div>';

        document.body.appendChild( div );

        config.caldomInstance = _( "input" );

        return config;
    },
    
    candidates: {
        "caldom": function(config){
            return config.caldomInstance.on("click", config.onEventCallback);
        }
    },

    assert: function(config, test_return){
        if( !(test_return instanceof _.Component) ) throw "Returned is not an instance of CalDOM";
        
        var inputs = document.querySelectorAll("input");
        inputs[0].click();
        inputs[1].click();

        if( window.test_events[0] !== inputs[0] ) throw false;
        if( window.test_events[1] !== inputs[1] ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})