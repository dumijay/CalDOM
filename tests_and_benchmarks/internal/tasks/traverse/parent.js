_pfreak.tasks.push({

    short_name: "parent",
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

        div.appendChild( document.createElement("p") );
        div.appendChild( document.createElement("p") );

        document.body.appendChild( div );

        config.caldomInstance = _( document.querySelector("p") );

        return config;
    },
    
    candidates: {
        "caldom": function(config){
            return config.caldomInstance.parent();
        }
    },

    assert: function(config, test_return){
        if( 
            test_return.elems[0].tagName != "DIV"
         ) throw false;
    },


        reset: function(){
        _pfreak.clearBody();
    }
})