_pfreak.tasks.push({

    short_name: "react_lifecycle_events_before_mount",
    display_order: 88,
    category: "dom",
    description: "",
    assert_delay: 1000,

    setTaskData: function(config){
        return config;
    },
    
    candidateSetup: function(config){
        _pfreak.clearBody();
        
        window.pfreak_events = [];
        
        var div = document.createElement("div");

        div.innerHTML = 
            '<div class="container">'
            + '</div>';

        document.body.appendChild( div );

        config.caldomInstance = _( ".container" );

        return config;
    },
    
    candidates: {
        "caldom": function(config){
            var app = _().react(
                {
                    greeting: "Hello World"
                },

                {
                    render: function(state){

                        window.pfreak_events.push("render");

                        return _( "+h1", [ state.greeting ] );
                    },

                    update: function(state){
                        window.pfreak_events.push("update");

                        this.find("h1").text( "Updated" );
                    },

                    willMount: function(){
                        window.pfreak_events.push("willMount");
                    },

                    didMount: function(){
                        window.pfreak_events.push("didMount");
                    },

                    willUnmount: function(){
                        window.pfreak_events.push("willUnmount");
                    },

                    didUnmount: function(){
                        window.pfreak_events.push("didUnmount");
                    },

                    didUpdate: function(){
                        window.pfreak_events.push("didUpdate");
                    },
                }
            );

            app.state.greeting = "New Greeting";
        }

    },

    assert: function(config, test_return){
        
        if( window.pfreak_events.length != 0 ) throw false
    },

        reset: function(){
        _pfreak.clearBody();
    }
})