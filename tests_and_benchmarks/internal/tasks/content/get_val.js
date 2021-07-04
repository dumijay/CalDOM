_pfreak.tasks.push({

    short_name: "get_val",
    display_order: 32,
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
            return config.caldomInstance.val();
        }
    },

    assert: function(config, test_return){
        if( 
            test_return[0] != "one"
            || test_return[1] != "two"
         ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})