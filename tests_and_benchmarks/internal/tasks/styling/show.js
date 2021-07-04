_pfreak.tasks.push({

    short_name: "show",
    display_order: 56,
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
                + '<section style="display:none"><input type="text" value="one" /></section>'
                + '<section style="display:none"><input type="text" value="two" /></section>'
            + '</div>';

        document.body.appendChild( div );

        config.caldomInstance = _( "section" );

        return config;
    },
    
    candidates: {
        "caldom": function(config){
            return config.caldomInstance.show();
        }
    },

    assert: function(config, test_return){
        if( !(test_return instanceof _.Component) ) throw "Returned is not an instance of CalDOM";
        
        var items = document.querySelectorAll("section");

        if( items[0].style.display != "block" ) throw false;
        if( items[1].style.display != "block" ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})