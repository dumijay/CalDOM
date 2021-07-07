_pfreak.tasks.push({

    short_name: "remove_single_elem",

    category: "unit_level_single_element",
    description: 'Removing a single element. (35,000 repeats).',

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

        return config;
    },
    
    candidates: {
        "vanilla_js": function(config){

            for( var i = 0; i < config.repeats; i++ ){
                config.instances[i].parentNode.removeChild( config.instances[i] );
            }

        },

        "caldom": function(config){

            for( var i = 0; i < config.repeats; i++ ){
                config.instances[i].remove();
            }

        },

        "umbrellajs": function(config){

            for( var i = 0; i < config.repeats; i++ ){
                config.instances[i].remove();
            }

        },

        "zepto": function(config){
            for( var i = 0; i < config.repeats; i++ ){
                config.instances[i].remove();
            }
        },

        "jquery": function(config){

            for( var i = 0; i < config.repeats; i++ ){
                config.instances[i].remove();
            }

        }
    },

    assert: function(config){
        var elems = document.querySelectorAll("input");

        if( elems.length != 0 ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})