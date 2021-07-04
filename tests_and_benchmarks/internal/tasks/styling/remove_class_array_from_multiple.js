_pfreak.tasks.push({

    short_name: "remove_class_array_from_multiple",
    display_order: 55,
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
                + '<input type="text" value="one" class="first-class second-class third-class"/>'
                + '<input type="text" value="two" class="first-class second-class third-class"/>'
            + '</div>';

        document.body.appendChild( div );

        config.caldomInstance = _( "input" );

        return config;
    },
    
    candidates: {
        "caldom": function(config){
            return config.caldomInstance.removeClass( ["second-class", "third-class"] );
        }
    },

    assert: function(config, test_return){
        if( !(test_return instanceof _.Component) ) throw "Returned is not an instance of CalDOM";
        
        var inputs = document.querySelectorAll("input");

        if( inputs[0].className != "first-class" ) throw false;
        if( inputs[1].className != "first-class" ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})