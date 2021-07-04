_pfreak.tasks.push({

    short_name: "set_html_string",
    display_order: 27,
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

        config.caldomInstance = _(".inner-container");

        return config;
    },
    
    candidates: {
        "caldom": function(config){
            return config.caldomInstance.html("<h1>Heading</h1>");
        }
    },

    assert: function(config, test_return){
        if( !(test_return instanceof _.Component) ) throw "Returned is not an instance of CalDOM";
        
        var headings = document.querySelectorAll(".inner-container");

        if( 
            headings[0].innerHTML != '<h1>Heading</h1>'
            || headings[1].innerHTML != '<h1>Heading</h1>'
        ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})