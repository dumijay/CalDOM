_pfreak.tasks.push({

    short_name: "get_data",
    display_order: 44,
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
                + '<input type="text" value="one" />'
                + '<input type="text" value="two" />'
                + '<input type="text" value="three" />'
            + '</div>';

        document.body.appendChild( div );

        config.caldomInstance = _( "input" );
        config.caldomInstance.eq(0).data("custom_data", document);
        config.caldomInstance.eq(1).data("custom_data", document);

        return config;
    },
    
    candidates: {
        "caldom": function(config){
            return config.caldomInstance.data("custom_data");
        }
    },

    assert: function(config, test_return){
        if( test_return[0] !== document ) throw false;
        if( test_return[1] !== document ) throw false;
        if( test_return[2] !== undefined ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})