_pfreak.tasks.push({

    short_name: "extended_class",
    display_order: 1,
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
            class Test extends _.Component{}

            return new Test();
        }
    },

    assert: function(config, test_return){
        if( !(test_return instanceof _.Component) ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})