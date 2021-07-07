_pfreak.tasks.push({

    short_name: "set_multiple_properties_single_elem",

    category: "unit_level_single_element",
    description: 'Set multiple properties of a single elements. (35,000 repeats).',

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

        config.properties = {
            category: "checkbox",
            checked: true,
            customProperty: "Custom property",
            customObject: { "custom_key": "abcd" }
        }

        return config;
    },
    
    candidates: {
        "vanilla_js": function(config){

            for( var i = 0; i < config.repeats; i++ ){
                for( var key in config.properties ){
                    config.instances[i][key] = config.properties[key];
                }
            }

        },

        "caldom": function(config){

            for( var i = 0; i < config.repeats; i++ ){
                config.instances[i].prop(config.properties);
            }

        },

        // Couldn't find prop() or an equivalent
        // "umbrellajs": function(config){


        // },

        // Didn't work { key: val } input despite the mention in the documentation
        // "zepto": function(config){

        //     for( var i = 0; i < config.repeats; i++ ){
        //         config.zeptoInstance.prop(config.properties);
        //     }

        // },

        "jquery": function(config){

            for( var i = 0; i < config.repeats; i++ ){
                config.instances[i].prop(config.properties);
            }

        }
    },

    assert: function(config, test_return){

        var elems = document.querySelectorAll("input");
        
        if( elems.length != config.repeats ) throw("elems.length = " + elems.length);

        for( var i = 0; i < config.repeats; i++ ){
            for( var key in config.properties ){
                if( elems[i][key] != config.properties[key] ) throw false;
            }
        }
    },

        reset: function(){
        _pfreak.clearBody();
    }
})