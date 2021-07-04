_pfreak.tasks.push({

    short_name: "new_instance_with_caldom",
    display_order: 8,
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
            return _( _("+div") );
        }
    },

    assert: function(config, test_return){
        if( test_return.elems[0].tagName != "DIV" ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})