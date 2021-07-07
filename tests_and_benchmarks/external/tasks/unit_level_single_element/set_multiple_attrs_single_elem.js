_pfreak.tasks.push({

    short_name: "set_multiple_attrs_single_elem",

    category: "unit_level_single_element",
    description: 'Setting multiple attributes of a single element. (35,000 repeats).',

    setTaskData: function(config){
        return {}
    },

    candidateSetup: function(config){
        config.repeats = config.repeats || 35000;

        document.body.innerHTML = '<input />'.repeat(config.repeats);

        var inputs = document.body.querySelectorAll( "input" );

        config.instances = [];

        for( var i = 0; i < config.repeats; i++ ){
            if( config.candidate == "vanilla_js") config.instances.push(inputs[i]);
            else if( config.candidate == "caldom") config.instances.push( _( inputs[i] ) );
            else if( config.candidate == "umbrellajs") config.instances.push( u( inputs[i] ) );
            else if( config.candidate == "zepto") config.instances.push( $( inputs[i] ) );
            else if( config.candidate == "jquery") config.instances.push( jQuery( inputs[i] ) );
        }

        config.attributes = {
            type: "text",
            value: "Some Text",
            placeholder: "Type your text here"
        }

        return config;
    },
    
    candidates: {
        "vanilla_js": function(config){

            for( var i = 0; i < config.repeats; i++ ){
                for( var key in config.attributes ){
                    config.instances[i].setAttribute(key, config.attributes[key]);
                }
            }

        },

        "caldom": function(config){

            for( var i = 0; i < config.repeats; i++ ){
                config.instances[i].attr(config.attributes);
            }

        },

        "umbrellajs": function(config){

            for( var i = 0; i < config.repeats; i++ ){
                config.instances[i].attr(config.attributes);
            }

        },

        "zepto": function(config){

            for( var i = 0; i < config.repeats; i++ ){
                config.instances[i].attr(config.attributes);
            }
            
        },

        "jquery": function(config){

            for( var i = 0; i < config.repeats; i++ ){
                config.instances[i].attr(config.attributes);
            }

        }
    },

    assert: function(config){
        var elems = document.querySelectorAll("input");
        
        if( elems.length != config.repeats ) throw("elems.length = " + elems.length);

        for( var i = 0; i < config.repeats; i++ ){
            for( var key in config.attributes ){
                if( elems[i].getAttribute(key) !== config.attributes[key] ) throw false;
            }
        }
    },

        reset: function(){
        _pfreak.clearBody();
    }
})