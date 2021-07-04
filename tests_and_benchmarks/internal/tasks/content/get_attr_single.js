_pfreak.tasks.push({

    short_name: "get_attr_single",
    display_order: 35,
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
            return config.caldomInstance.attr("type");
        }
    },

    assert: function(config, test_return){
        if( 
            test_return[0] != "text"
         ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})