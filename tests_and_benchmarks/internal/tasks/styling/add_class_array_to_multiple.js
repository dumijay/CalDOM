_pfreak.tasks.push({

    short_name: "add_class_array_to_multiple",
    display_order: 52,
    category: "styling",
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
            return config.caldomInstance.addClass( ["new-class-one", "new-class-two"] );
        }
    },

    assert: function(config, test_return){
        if( !(test_return instanceof _.Component) ) throw "Returned is not an instance of CalDOM";
        
        var inputs = document.querySelectorAll("input");

        if( inputs[0].className != "new-class-one new-class-two" ) throw false;
        if( inputs[1].className != "new-class-one new-class-two" ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})