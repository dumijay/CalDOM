_pfreak.tasks.push({

    short_name: "eq_positive_number",
    display_order: 15,
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

        document.body.appendChild( div );

        config.caldomInstance = _("div > *");

        return config;
    },
    
    candidates: {
        "caldom": function(config){
            return _("div > *").eq(1)
        }
    },

    assert: function(config, test_return){
        if( 
            test_return.elems[0].tagName != "H2"
         ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})