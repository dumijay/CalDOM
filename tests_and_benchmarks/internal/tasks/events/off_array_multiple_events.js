_pfreak.tasks.push({

    short_name: "off_array_multiple_events",
    display_order: 64,
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

        var inputs = document.querySelectorAll("input");
        inputs[0].addEventListener("click", config.onEventCallback);
        inputs[0].addEventListener("change", config.onEventCallback);
        inputs[1].addEventListener("click", config.onEventCallback);
        inputs[1].addEventListener("change", config.onEventCallback);

        config.caldomInstance = _( "input" );

        return config;
    },
    
    candidates: {
        "caldom": function(config){
            return config.caldomInstance.off(["click", "change"], config.onEventCallback);
        }
    },

    assert: function(config, test_return){
        if( !(test_return instanceof _.Component) ) throw "Returned is not an instance of CalDOM";
        
        var inputs = document.querySelectorAll("input");
        inputs[0].click();
        inputs[0].dispatchEvent( new Event("change") );
        inputs[1].click();
        inputs[1].dispatchEvent( new Event("change") );

        if( window.test_events.length !== 0 ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})