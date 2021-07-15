_pfreak.tasks.push({

    short_name: "elems",
    display_order: 117,
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
            return config.caldomInstance.elems;
        }
    },

    assert: function(config, test_return){
        var paras = document.querySelectorAll("p");

        if( test_return[0] !== paras[0] ) throw false;
        if( test_return[1] !== paras[1] ) throw false;
    },

    reset: function(){
        _pfreak.clearBody();
    }
});