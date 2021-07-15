_pfreak.tasks.push({

    short_name: "elem",
    display_order: 118,
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

        config.caldomInstance = _( "p" );

        return config;
    },
    
    candidates: {
        "caldom": function(config){
            return config.caldomInstance.elem;
        }
    },

    assert: function(config, test_return){
        var paras = document.querySelectorAll("p");

        if( test_return !== paras[0] ) throw false;
    },

    reset: function(){
        _pfreak.clearBody();
    }
});