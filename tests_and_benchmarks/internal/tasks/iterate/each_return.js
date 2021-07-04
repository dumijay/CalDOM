_pfreak.tasks.push({

    short_name: "each_return",
    display_order: 23,
    category: "iterate",
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

        config.caldomInstance = _( document.querySelectorAll("p") );

        return config;
    },
    
    candidates: {
        "caldom": function(config){
            
            return config.caldomInstance.each(function(){
                
            });
        }
    },

    assert: function(config, test_return){
        if( !(test_return instanceof _.Component) ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})