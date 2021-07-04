_pfreak.tasks.push({

    short_name: "eq_negative_number",
    display_order: 16,
    category: "traverse",
    description: "",
    assert_delay: 0,

    setTaskData: function(config){
        return config;
    },
    
    candidateSetup: function(config){
        _pfreak.clearBody();
        
        var div = document.createElement("div");

        div.appendChild( document.createElement("h1") );
        div.appendChild( document.createElement("h2") );
        div.appendChild( document.createElement("h3") );
        div.appendChild( document.createElement("h4") );

        document.body.appendChild( div );

        config.caldomInstance = _("div > *");
        
        return config;
    },
    
    candidates: {
        "caldom": function(config){
            return config.caldomInstance.eq(-2)
        }
    },

    assert: function(config, test_return){
        if( 
            test_return.elems[0].tagName != "H3"
         ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})