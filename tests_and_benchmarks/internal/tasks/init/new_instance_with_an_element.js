_pfreak.tasks.push({

    short_name: "new_instance_with_an_element",
    display_order: 7,
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
            return _(document.body);
        }
    },

    assert: function(config, test_return){
        if( test_return.elems[0] !== document.body ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})