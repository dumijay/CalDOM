_pfreak.tasks.push({

    short_name: "set_value_single_elem",

    category: "unit_level_single_element",
    description: 'Setting value of a single element. (35,000 repeats).',

    setTaskData: function(config){
        return {}
    },

    candidateSetup: function(config){
        config.repeats = config.repeats || 35000;

        document.body.innerHTML = '<input value="old value" type="text" />'.repeat(config.repeats);

        var inputs = document.body.querySelectorAll( "input" );

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
                config.instances[i].value = "new_value";
            }

        },

        "caldom": function(config){

            for( var i = 0; i < config.repeats; i++ ){
                config.instances[i].val("new_value");
            }

        },

        // No short-hand for value
        // "umbrellajs": function(config){

        //     for( var i = 0; i < config.repeats; i++ ){
        //         config.umbrellaJSInstance.val("new_value");
        //     }

        // },

        "zepto": function(config){

            for( var i = 0; i < config.repeats; i++ ){
                config.instances[i].val("new_value");
            }
            
        },

        "jquery": function(config){

            for( var i = 0; i < config.repeats; i++ ){
                config.instances[i].val("new_value");
            }

        }
    },

    assert: function(config){
        var elems = document.querySelectorAll("input");
        
        if( elems.length != config.repeats ) throw("elems.length = " + elems.length);

        for( var i = 0; i < config.repeats; i++ ){
            if( elems[i].value !== "new_value" ) throw false;
        }
    },

        reset: function(){
        _pfreak.clearBody();
    }
})