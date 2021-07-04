_pfreak.tasks.push({

    short_name: "append_mixed_arguments",
    display_order: 72,
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
            return config.caldomInstance.append(
                    document.createElement("h1"),
                    _("+p"),
                    null,
                    undefined,
                    "Text Node",
                    '<h2>Sub Heading</h2>'
                );
        }
    },

    assert: function(config, test_return){
        if( !(test_return instanceof _.Component) ) throw "Returned is not an instance of CalDOM";
        
        var items = document.querySelectorAll(".container");

        if( items[0].childNodes[0].tagName != "H1" ) throw false;
        if( items[0].childNodes[1].tagName != "P" ) throw false;
        if( items[0].childNodes[2].nodeType !== Node.TEXT_NODE ) throw false;
        if( items[0].childNodes[2].textContent != "Text Node" ) throw false;
        if( items[0].childNodes[3].nodeType != 3 ) throw false;
        if( items[0].childNodes[3].textContent != "<h2>Sub Heading</h2>" ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})