_pfreak.tasks.push({

    short_name: "map_single",
    display_order: 25,
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
                + '</section>'
            + '</div>';

        document.body.appendChild( div );

        config.caldomInstance = _( document.querySelectorAll("p") );

        return config;
    },
    
    candidates: {
        "caldom": function(config){
            return config.caldomInstance.map(function(elem, index){
                return [ elem, index ];
            });
        }
    },

    assert: function(config, test_return){
        if( test_return.length != 1 ) throw "Count is wrong";

        for( var i = 0; i < test_return.length; i++ ){
            if( 
                test_return[i][0].tagName != "P" 
                ||  test_return[i][1] != i
            ) throw false;
        }
    },


        reset: function(){
        _pfreak.clearBody();
    }
})