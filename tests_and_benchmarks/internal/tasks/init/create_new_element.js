_pfreak.tasks.push({

    short_name: "create_new_element",
    display_order: 11,
    category: "init",
    description: "",
    assert_delay: 0,

    setTaskData: function(config){
        return config;
    },
    
    candidateSetup: function(config){
        _pfreak.clearBody();

        return config;
    },
    
    candidates: {
        "caldom": function(config){
            return _("+h1");
        }
    },

    assert: function(config, test_return){
        if( test_return.elems[0].tagName != "H1" ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})