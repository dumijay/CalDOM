_pfreak.tasks.push({

    short_name: "get_html",
    display_order: 26,
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
                    + '<p class="para-one">Para</p>'
                    + '<p class="para-two">Para</p>'
                + '</section>'
                + '<section class="inner-container">'
                    + '<p class="para-one">Para</p>'
                    + '<p class="para-two">Para</p>'
                + '</section>'
            + '</div>';

        document.body.appendChild( div );

        config.caldomInstance = _( ".inner-container" );

        return config;
    },
    
    candidates: {
        "caldom": function(config){
            return config.caldomInstance.html();
        }
    },

    assert: function(config, test_return){
        if( 
            !Array.isArray(test_return)
            || test_return.length != 2
            || test_return[0] != '<p class="para-one">Para</p><p class="para-two">Para</p>'
            || test_return[1] != '<p class="para-one">Para</p><p class="para-two">Para</p>'
         ) throw test_return[0];
    },

        reset: function(){
        _pfreak.clearBody();
    }
})