_pfreak.tasks.push({

    short_name: "prepend_single_element",
    display_order: 75,
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

        config.caldomInstance = _( ".container" );

        return config;
    },
    
    candidates: {
        "caldom": function(config){
            return config.caldomInstance.prepend( _("+h1") );
        }
    },

    assert: function(config, test_return){
        if( !(test_return instanceof _.Component) ) throw "Returned is not an instance of CalDOM";
        
        var items = document.querySelectorAll(".container");

        if( items[0].children[0].tagName != "H1" ) throw false;
        if( items[0].children[1].tagName != "P" ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})