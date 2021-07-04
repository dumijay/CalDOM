_pfreak.tasks.push({

    short_name: "create_new_svg_element",
    display_order: 10,
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
            return _("~rect");
        }
    },

    assert: function(config, test_return){
        if( test_return.elems[0].tagName != "rect" ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})