_pfreak.tasks.push({

    short_name: "get_text_multiple",
    display_order: 29,
    category: "content",
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
                    + '<p class="para-one">Para One</p>'
                    + '<p class="para-two">Para Two</p>'
                + '</section>'
                + '<section class="inner-container">'
                    + '<p class="para-one">Para Three</p>'
                    + '<p class="para-two">Para Four</p>'
                + '</section>'
            + '</div>';

        document.body.appendChild( div );

        config.caldomInstance = _("p");

        return config;
    },
    
    candidates: {
        "caldom": function(config){
            return config.caldomInstance.text();
        }
    },

    assert: function(config, test_return){
        if( 
            !Array.isArray(test_return)
            || test_return[0] != "Para One"
            || test_return[1] != "Para Two"
            || test_return[2] != "Para Three"
            || test_return[3] != "Para Four"
        ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})