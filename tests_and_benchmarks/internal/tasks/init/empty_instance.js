_pfreak.tasks.push({

    short_name: "empty_instance",
    display_order: 0,
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
            return _();
        }
    },

    assert: function(config, test_return){
        if( !(test_return instanceof _.Component) ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})