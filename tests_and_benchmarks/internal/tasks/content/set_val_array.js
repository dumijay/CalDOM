_pfreak.tasks.push({

    short_name: "set_val_array",
    display_order: 34,
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
                + '<input type="text" value="two" />'
            + '</div>';

        document.body.appendChild( div );

        config.caldomInstance = _( "input" );

        return config;
    },
    
    candidates: {
        "caldom": function(config){
            return config.caldomInstance.val([
                "new_value_one",
                "new_value_two"
            ]);
        }
    },

    assert: function(config, test_return){
        if( !(test_return instanceof _.Component) ) throw "Returned is not an instance of CalDOM";
        
        var inputs = document.querySelectorAll("input");

        if( 
            inputs[0].value != "new_value_one"
            || inputs[1].value != "new_value_two"
         ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})