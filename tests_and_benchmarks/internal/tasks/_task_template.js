_pfreak.tasks.push({

    short_name: "task_short_name",
    display_order: 0,
    category: "Category_Name",
    description: "",
    assert_delay: 0,
    load_libraries: true,

    setTaskData: function(config){
        return config;
    },
    
    candidateSetup: function(config){
        _pfreak.clearBody();

        return config;
    },
    
    candidates: {
        "candidate_a": function(config){
            // Do something..
        }
    },

    assert: function(config, test_return){
        if( test_error ) throw false;
    },

    reset: function(){
        _pfreak.clearBody();
    }
});