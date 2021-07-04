_pfreak.tasks.push({

    short_name: "find_css_selector_from_single",
    display_order: 13,
    category: "traverse",
    description: "",
    assert_delay: 0,

    setTaskData: function(config){
        return config;
    },
    
    candidateSetup: function(config){
        _pfreak.clearBody();
        
        var div = document.createElement("div");

        div.appendChild( document.createElement("p") );
        div.appendChild( document.createElement("p") );

        document.body.appendChild( div );

        config.caldomInstance = _( document.querySelector("div") );

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
         ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})