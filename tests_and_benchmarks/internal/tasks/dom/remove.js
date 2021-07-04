_pfreak.tasks.push({

    short_name: "remove",
    display_order: 78,
    category: "dom",
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
                + '<p>Para One</p>'
            + '</div>';

        document.body.appendChild( div );

        config.caldomInstance = _( "p" );

        return config;
    },
    
    candidates: {
        "caldom": function(config){
            return config.caldomInstance.remove();
        }
    },

    assert: function(config, test_return){
        if( !(test_return instanceof _.Component) ) throw "Returned is not an instance of CalDOM";
        
        var items = document.querySelectorAll(".container");

        if( items[0].children.length != 0 ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})