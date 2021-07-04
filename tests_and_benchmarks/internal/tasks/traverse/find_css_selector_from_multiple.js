_pfreak.tasks.push({

    short_name: "find_css_selector_from_multiple",
    display_order: 13,
    category: "traverse",
    description: "",
    assert_delay: 0,

    setTaskData: function(config){
        return config;
    },
    
    candidateSetup: function(config){
        _pfreak.clearBody();
        
        var div_one = document.createElement("div");
        var div_two = document.createElement("div");

        div_one.appendChild( document.createElement("p") );
        div_one.appendChild( document.createElement("p") );
        div_two.appendChild( document.createElement("p") );
        div_two.appendChild( document.createElement("p") );

        document.body.appendChild( div_one );
        document.body.appendChild( div_two );

        config.caldomInstance = _("div");

        return config;
    },
    
    candidates: {
        "caldom": function(config){
            return config.caldomInstance.find("p");
        }
    },

    assert: function(config, test_return){
        if( 
            test_return.elems[0].tagName != "P"
            || test_return.elems[1].tagName != "P"
            || test_return.elems[2].tagName != "P"
            || test_return.elems[3].tagName != "P"
         ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})