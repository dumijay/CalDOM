_pfreak.tasks.push({

    short_name: "hide",
    display_order: 58,
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
                + '<section><input type="text" value="one" /></section>'
                + '<section><input type="text" value="two" /></section>'
            + '</div>';

        document.body.appendChild( div );

        config.caldomInstance = _( "section" );

        return config;
    },
    
    candidates: {
        "caldom": function(config){
            return config.caldomInstance.hide();
        }
    },

    assert: function(config, test_return){
        if( !(test_return instanceof _.Component) ) throw "Returned is not an instance of CalDOM";
        
        var items = document.querySelectorAll("section");

        if( items[0].style.display != "none" ) throw false;
        if( items[1].style.display != "none" ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})