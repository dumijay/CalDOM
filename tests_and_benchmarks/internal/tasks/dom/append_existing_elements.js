_pfreak.tasks.push({

    short_name: "append_existing_elements",
    display_order: 73,
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
            '<div class="container-a">'
                + '<p>Para One</p>'
                + '<p>Para Two</p>'
            + '</div>'
            + '<div class="container-b">'
            + '</div>';

        document.body.appendChild( div );

        config.caldomInstance = _( ".container-b" );

        return config;
    },
    
    candidates: {
        "caldom": function(config){
            return config.caldomInstance.append( document.querySelectorAll("p") );
        }
    },

    assert: function(config, test_return){
        if( !(test_return instanceof _.Component) ) throw "Returned is not an instance of CalDOM";
        
        var items = document.querySelectorAll(".container-a, .container-b");

        if( items[0].children.length != 0 ) throw false;
        if( items[1].children[0].tagName != "P" ) throw false;
        if( items[1].children[1].tagName != "P" ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})