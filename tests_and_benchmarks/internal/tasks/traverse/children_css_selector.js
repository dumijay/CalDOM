_pfreak.tasks.push({

    short_name: "children_css_selector",
    display_order: 20,
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
            + '</div>';

        document.body.appendChild( div );

        config.caldomInstance = _( document.querySelector(".inner-container") );

        return config;
    },
    
    candidates: {
        "caldom": function(config){
            return config.caldomInstance.children(".para-two");
        }
    },

    assert: function(config, test_return){
        if( 
            test_return.elems.length != 1
            || test_return.elems[0].tagName != "P"
         ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})