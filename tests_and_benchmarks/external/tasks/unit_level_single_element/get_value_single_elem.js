_pfreak.tasks.push({

    short_name: "get_value_single_elem",

    category: "unit_level_single_element",
    count: 4000,
    description: 's value from a single node (35,000 repeats).',

    setTaskData: function(config){
        return {}
    },
    
    candidateSetup: function(config){
        document.body.innerHTML = '<input type="text" value="my value 0" />';

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
                last_return = config.vanillaInstance.value;
            }

            return last_return;

        },

        "caldom": function(config){

            var last_return;

            for( var i = 0; i < config.repeats; i++ ){
                last_return = config.caldomInstance.val()[0];
            }

            return last_return;

        },

        // No short-hand for value
        // "umbrellajs": function(config){
        //     var result;

        //     for( var i = 0; i < config.repeats; i++ ){
        //         result = config.umbrellaJSInstance.val();
        //     }

        //     return result;
        // },

        "zepto": function(config){

            var last_return;

            for( var i = 0; i < config.repeats; i++ ){
                last_return = config.zeptoInstance.val();
            }

            return last_return;

        },

        "jquery": function(config){

            var last_return;

            for( var i = 0; i < config.repeats; i++ ){
                last_return = config.jqueryInstance.val();
            }

            return last_return;

        }
    },

    assert: function(config, test_return){
        if( test_return !== "my value 0" ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})