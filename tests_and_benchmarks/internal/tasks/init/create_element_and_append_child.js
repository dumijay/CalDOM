_pfreak.tasks.push({

    short_name: "create_element_and_append_child",
    display_order: 13,
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
            return _(
                "+div",
                _("+h1", "Heading")
            );
        }
    },

    assert: function(config, test_return){
        if(
            test_return.elems[0].tagName != "DIV"
            || test_return.elems[0].children[0].tagName != "H1"
            || test_return.elems[0].children[0].textContent != "Heading"
         ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})