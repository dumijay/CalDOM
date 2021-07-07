_pfreak.tasks.push({

    short_name: "get_attr_single_elem",

    category: "unit_level_single_element",
    description: 'Get attribute of a single element. (35,000 repeats).',

    setTaskData: function(config){
        return {}
    },

    candidateSetup: function(config){
        document.body.innerHTML = '<input type="text" />';

        config.vanillaInstance = document.body.querySelectorAll( "input" )[0];
        if( config.candidate == "caldom") config.caldomInstance = _( "input" );
        if( config.candidate == "umbrellajs") config.umbrellaJSInstance = u( "input" );
        if( config.candidate == "zepto") config.zeptoInstance = $( "input" );
        if( config.candidate == "jquery") config.jqueryInstance = jQuery( "input" );

        config.repeats = config.repeats || 35000;

        return config;
    },
    
    candidates: {
        "vanilla_js": function(config){

            var last_return;

            for( var i = 0; i < config.repeats; i++ ){
                last_return = config.vanillaInstance.getAttribute("type");
            }

            return last_return;

        },

        "caldom": function(config){

            var last_return;

            for( var i = 0; i < config.repeats; i++ ){
                last_return = config.caldomInstance.attr("type")[0];
            }

            return last_return;

        },

        "umbrellajs": function(config){

            var last_return;

            for( var i = 0; i < config.repeats; i++ ){
                last_return = config.umbrellaJSInstance.attr("type");
            }

            return last_return;

        },

        "zepto": function(config){

            var last_return;

            for( var i = 0; i < config.repeats; i++ ){
                last_return = config.zeptoInstance.attr("type");
            }

            return last_return;

        },

        "jquery": function(config){

            var last_return;

            for( var i = 0; i < config.repeats; i++ ){
                last_return = config.jqueryInstance.attr("type");
            }

            return last_return;

        }
    },

    assert: function(config, test_return){
        var i = 0;

        for (var i = 0; i < test_return.length; i++) {
            if( test_return !== "text" ) throw false;
        }
        
    },

        reset: function(){
        _pfreak.clearBody();
    }
})