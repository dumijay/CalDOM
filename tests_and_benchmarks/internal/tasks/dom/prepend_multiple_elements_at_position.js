_pfreak.tasks.push({

    short_name: "prepend_multiple_elements_at_position",
    display_order: 77,
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
                + '<section></section>'
            + '</div>';

        document.body.appendChild( div );

        config.caldomInstance = _( ".container" );
        config.caldomBeforElem = _( ".container" ).find("section");

        return config;
    },
    
    candidates: {
        "caldom": function(config){
            return config.caldomInstance.prepend( [_("+h1"), _("+h2")], config.caldomBeforElem );
        }
    },

    assert: function(config, test_return){
        if( !(test_return instanceof _.Component) ) throw "Returned is not an instance of CalDOM";
        
        var items = document.querySelectorAll(".container");

        if( items[0].children[0].tagName != "P" ) throw false;
        if( items[0].children[1].tagName != "H1" ) throw false;
        if( items[0].children[2].tagName != "H2" ) throw false;
        if( items[0].children[3].tagName != "SECTION" ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})