_pfreak.tasks.push({

    short_name: "append_html",
    display_order: 67,
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
            + '</div>';

        document.body.appendChild( div );

        config.caldomInstance = _( ".container" );

        return config;
    },
    
    candidates: {
        "caldom": function(config){
            return config.caldomInstance.append( "<h1>Heading</h1>" );
        }
    },

    assert: function(config, test_return){
        if( !(test_return instanceof _.Component) ) throw "Returned is not an instance of CalDOM";
        
        var items = document.querySelectorAll(".container");

        // if( items[0].childNodes[0].tagType != 3 ) throw false;
        if( items[0].textContent != "<h1>Heading</h1>" ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})