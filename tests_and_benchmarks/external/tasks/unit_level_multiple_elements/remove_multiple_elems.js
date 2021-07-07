_pfreak.tasks.push({

    short_name: "remove_multiple_elems",

    category: "unit_level_multiple_elements",
    description: 'Removing multiple elements. (10,000 repeats).',

    setTaskData: function(config){
        return {}
    },

    candidateSetup: function(config){
        config.repeats = config.repeats || 10000;
        
        document.body.innerHTML = '<input />'.repeat(config.repeats);

        config.vanillaInstance = document.body.querySelectorAll( "input" );
        if( config.candidate == "caldom") config.caldomInstance = _( "input" );
        if( config.candidate == "umbrellajs") config.umbrellaJSInstance = u( "input" );
        if( config.candidate == "zepto") config.zeptoInstance = $( "input" );
        if( config.candidate == "jquery") config.jqueryInstance = jQuery( "input" );

        return config;
    },
    
    candidates: {
        "vanilla_js": function(config){

            for( var elem_i = 0, len = config.vanillaInstance.length; elem_i < len; elem_i++ ){
                config.vanillaInstance[elem_i].parentNode.removeChild( config.vanillaInstance[elem_i] );
            }

        },

        "caldom": function(config){

            config.caldomInstance.remove();

        },

        "umbrellajs": function(config){

            config.umbrellaJSInstance.remove();

        },

        "zepto": function(config){
            config.zeptoInstance.remove();
        },

        "jquery": function(config){

            config.jqueryInstance.remove();

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