_pfreak.tasks.push({

    short_name: "parents_of_multiple_children",
    display_order: 22,
    category: "traverse",
    description: "",
    assert_delay: 0,

    setTaskData: function(config){
        return config;
    },
    
    candidateSetup: function(config){
        _pfreak.clearBody();
        
        var div = document.createElement("div");

        div.innerHTML = 
            '<div class="container">'
                + '<section class="inner-container">'
                    + '<p class="para-one">Para</p>'
                    + '<p class="para-two">Para</p>'
                + '</section>'
                + '<section class="inner-container">'
                    + '<p class="para-one">Para</p>'
                    + '<p class="para-two">Para</p>'
                + '</section>'
            + '</div>';

        document.body.appendChild( div );

        config.caldomInstance = _( document.querySelectorAll(".para-one") );

        return config;
    },
    
    candidates: {
        "caldom": function(config){
            return config.caldomInstance.parent();
        }
    },

    assert: function(config, test_return){
        if( 
            test_return.elems.length != 2
         ) throw test_return.elems.length;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})