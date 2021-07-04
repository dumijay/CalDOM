_pfreak.tasks.push({

    short_name: "set_attr_key_value_object_single",
    display_order: 38,
    category: "content",
    description: "",
    assert_delay: 0,

    setTaskData: function(config){
        return config;
    },
    
    candidateSetup: function(config){
        _pfreak.clearBody();
        
        var div = document.createElement("div");

        div.innerHTML = 
            '<div class="container">'
                + '<input type="text" value="one" />'
            + '</div>';

        document.body.appendChild( div );

        config.caldomInstance = _( "input" );

        return config;
    },
    
    candidates: {
        "caldom": function(config){
            return config.caldomInstance.attr({
                type: "number",
                value: "something_else"
            });
        }
    },

    assert: function(config, test_return){
        if( !(test_return instanceof _.Component) ) throw "Returned is not an instance of CalDOM";

        var inputs = document.querySelectorAll("input");

        if( 
            inputs[0].getAttribute("type") != "number"
            || inputs[0].getAttribute("value") != "something_else"
         ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})