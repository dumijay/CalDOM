_pfreak.tasks.push({

    short_name: "get_checked_property_single_elem",

    category: "unit_level_single_element",
    count: 4000,
    description: 'Get Element.checked property from a single node (35,000 repeats).',

    setTaskData: function(config){
        return {}
    },
    
    candidateSetup: function(config){
        document.body.innerHTML = '<input type="checkbox" checked />';

        config.vanillaInstance = document.querySelectorAll("input")[0];
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
                last_return = config.vanillaInstance.checked;
            }

            return last_return;

        },

        "caldom": function(config){

            var last_return;

            for( var i = 0; i < config.repeats; i++ ){
                last_return = config.caldomInstance.prop("checked")[0];
            }

            return last_return;

        },

        // Couldn't find prop() or an equivalent
        // "umbrellajs": function(config){


        // },

        "zepto": function(config){

            var last_return;

            for( var i = 0; i < config.repeats; i++ ){
                last_return = config.zeptoInstance.prop("checked");
            }

            return last_return;

        },

        "jquery": function(config){

            var last_return;

            for( var i = 0; i < config.repeats; i++ ){
                last_return = config.jqueryInstance.prop("checked");
            }

            return last_return;

        }
    },

    assert: function(config, test_return){
        if( test_return !== true ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})