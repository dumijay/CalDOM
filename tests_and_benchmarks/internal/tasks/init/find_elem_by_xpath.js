_pfreak.tasks.push({

    short_name: "find_elem_by_xpath",
    display_order: 3,
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
            return _("$//html/body");
        }
    },

    assert: function(config, test_return){
        if( test_return.elems[0] !== document.body ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})