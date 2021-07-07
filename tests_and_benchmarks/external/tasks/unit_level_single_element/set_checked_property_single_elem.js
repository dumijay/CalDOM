_pfreak.tasks.push({

    short_name: "set_checked_property_single_elem",

    category: "unit_level_single_element",
    count: 4000,
    description: 'Set checked property of a single element (35,000 repeats).',

    setTaskData: function(config){
        return {}
    },
    
    candidateSetup: function(config){

        config.repeats = config.repeats || 35000;

        document.body.innerHTML = '<input type="checkbox" />'.repeat(config.repeats);

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
                config.instances[i].checked = true;
            }

        },

        "caldom": function(config){

            for( var i = 0; i < config.repeats; i++ ){
                config.instances[i].prop("checked", true);
            }

        },

        // Couldn't find prop() or an equivalent
        // "umbrellajs": function(config){


        // },

        "zepto": function(config){

            for( var i = 0; i < config.repeats; i++ ){
                config.instances[i].prop("checked", true);
            }

        },

        "jquery": function(config){

            for( var i = 0; i < config.repeats; i++ ){
                config.instances[i].prop("checked", true);
            }

        }
    },

    assert: function(config, test_return){

        var elems = document.querySelectorAll("input");

        if( elems.length != config.repeats ) throw("elems.length = " + elems.length);

        for( var i = 0; i < elems.length; i++ ){
            if( elems[i].checked !== true ) throw false;
        }
    },

        reset: function(){
        _pfreak.clearBody();
    }
})