_pfreak.tasks.push({

    short_name: "find_multiple_elems_by_selector",
    display_order: 4,
    category: "init",
    description: "",
    assert_delay: 0,

    setTaskData: function(config){
        return config;
    },
    
    candidateSetup: function(config){
        _pfreak.clearBody();

        document.body.appendChild( document.createElement("p") );
        document.body.appendChild( document.createElement("p") );

        return config;
    },
    
    candidates: {
        "caldom": function(config){
            return _("p");
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