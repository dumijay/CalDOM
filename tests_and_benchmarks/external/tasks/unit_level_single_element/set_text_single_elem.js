_pfreak.tasks.push({

    short_name: "set_text_single_elem",

    category: "unit_level_single_element",
    description: 'Setting text of a single element. (35,000 repeats).',

    setTaskData: function(config){
        return {}
    },

    candidateSetup: function(config){
        config.repeats = config.repeats || 35000;

        document.body.innerHTML = '<div id="text-container"></div>'.repeat(config.repeats);

        var inputs = document.body.querySelectorAll( "div" );

        config.instances = [];

        for( var i = 0; i < config.repeats; i++ ){
            if( config.candidate == "vanilla_js") config.instances.push(inputs[i]);
            else if( config.candidate == "caldom") config.instances.push( _( inputs[i] ) );
            else if( config.candidate == "umbrellajs") config.instances.push( u( inputs[i] ) );
            else if( config.candidate == "zepto") config.instances.push( $( inputs[i] ) );
            else if( config.candidate == "jquery") config.instances.push( jQuery( inputs[i] ) );
        }

        return config;
    },
    
    candidates: {
        "vanilla_js": function(config){

            for( var i = 0; i < config.repeats; i++ ){
                config.instances[i].textContent = "New Text";
            }

        },

        "caldom": function(config){

            for( var i = 0; i < config.repeats; i++ ){
                config.instances[i].text("New Text");
            }

        },

        "umbrellajs": function(config){

            for( var i = 0; i < config.repeats; i++ ){
                config.instances[i].text("New Text");
            }

        },

        "zepto": function(config){

            for( var i = 0; i < config.repeats; i++ ){
                config.instances[i].text("New Text");
            }
            
        },

        "jquery": function(config){

            for( var i = 0; i < config.repeats; i++ ){
                config.instances[i].text("New Text");
            }

        }
    },

    assert: function(config){
        var elems = document.querySelectorAll("div");
        
        if( elems.length != config.repeats ) throw("elems.length = " + elems.length);

        for( var i = 0; i < config.repeats; i++ ){
            if( elems[i].textContent !== "New Text" ) throw false;
        }
    },

        reset: function(){
        _pfreak.clearBody();
    }
})