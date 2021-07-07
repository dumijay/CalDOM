_pfreak.tasks.push({

    short_name: "each_callback_multiple_elems",

    category: "unit_level_multiple_elements",
    description: 'Enumerate each element with a callback. (40,000 repeats).',

    setTaskData: function(config){
        return {}
    },

    candidateSetup: function(config){
        config.repeats = config.repeats || 40000;
        
        document.body.innerHTML = '<input type="text" />'.repeat(config.repeats);

        config.vanillaInstance = document.body.querySelectorAll( "input" );
        if( config.candidate == "caldom") config.caldomInstance = _( "input" );
        if( config.candidate == "umbrellajs") config.umbrellaJSInstance = u( "input" );
        if( config.candidate == "zepto") config.zeptoInstance = $( "input" );
        if( config.candidate == "jquery") config.jqueryInstance = jQuery( "input" );

        config.callbackThis = function(){
            this._processed = true;
        }

        config.callbackElemFirst = function(elem){
            elem._processed = true;
        }

        return config;
    },
    
    candidates: {
        "vanilla_js": function(config){
            
            for( var elem_i = 0, len = config.vanillaInstance.length; elem_i < len; elem_i++ ){
                config.callbackElemFirst( config.vanillaInstance[elem_i] );
            }

        },

        "caldom": function(config){

            config.caldomInstance.each( config.callbackElemFirst );

        },

        "umbrellajs": function(config){

            config.umbrellaJSInstance.each( config.callbackElemFirst );

        },

        "zepto": function(config){

            config.zeptoInstance.each( config.callbackThis );
            
        },

        "jquery": function(config){

            config.jqueryInstance.each( config.callbackThis );

        }
    },

    assert: function(config){
        var elems = document.querySelectorAll("input");

        if( elems.length != config.repeats ) throw("elems.length = " + elems.length);

        for( var i = 0; i < elems.length; i++ ){
            if( elems[i]._processed !== true ) throw false;
        }
    },

        reset: function(){
        _pfreak.clearBody();
    }
})