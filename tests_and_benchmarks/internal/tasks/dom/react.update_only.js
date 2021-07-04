_pfreak.tasks.push({

    short_name: "react.update_only",
    display_order: 81,
    category: "dom",
    description: "",
    assert_delay: 500,

    setTaskData: function(config){
        return config;
    },
    
    candidateSetup: function(config){
        _pfreak.clearBody();
        
        var div = document.createElement("div");

        div.innerHTML = 
            '<div class="container">'
                + '<h1>Test</h1>'
            + '</div>';

        document.body.appendChild( div );

        config.caldomInstance = _( ".container" );

        return config;
    },
    
    candidates: {
        "caldom": function(config){
            return config.caldomInstance.react(
                {
                    greeting: "Hello World"
                },

                {
                    update: function(state){
                        this.find("h1").text( state.greeting );
                    }
                }
            );
        }
    },

    assert: function(config, test_return){
        if( !(test_return instanceof _.Component) ) throw "Returned is not an instance of CalDOM";
        
        var items = document.querySelectorAll(".container");

        if( items[0].children[0].tagName != "H1" ) throw false;
        if( items[0].children[0].textContent != "Hello World" ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})