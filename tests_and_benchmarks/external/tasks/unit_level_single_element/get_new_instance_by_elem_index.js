_pfreak.tasks.push({

    short_name: "get_new_instance_by_elem_index",

    category: "unit_level_single_element",
    count: 4000,
    description: 'Get a new instance by element index. (35,000 repeats).',

    setTaskData: function(config){
        return {}
    },
    
    candidateSetup: function(config){
        document.body.innerHTML = '<input type="text" value="my value 0" />'
            + '<input type="text" value="my value 1" />'
            + '<input type="text" value="my value 2" />'
            + '<input type="text" value="my value 3" />'
            + '<input type="text" value="my value 4" />'
            + '<input type="text" value="my value 5" />'
            + '<input type="text" value="my value 6" />'
            + '<input type="text" value="my value 7" />'
            + '<input type="text" value="my value 8" />';

        config.vanillaInstance = document.querySelectorAll("input");
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
                last_return = config.vanillaInstance[4];
            }

            return last_return;

        },

        "caldom": function(config){

            var last_return;

            for( var i = 0; i < config.repeats; i++ ){
                last_return = config.caldomInstance.eq(4);
            }

            return last_return;

        },

        // No short-hand method
        // "umbrellajs": function(config){

        // },

        "zepto": function(config){

            var last_return;

            for( var i = 0; i < config.repeats; i++ ){
                last_return = config.zeptoInstance.eq(4);
            }

            return last_return;

        },

        "jquery": function(config){

            var last_return;

            for( var i = 0; i < config.repeats; i++ ){
                last_return = config.jqueryInstance.eq(4);
            }

            return last_return;

        }
    },

    assert: function(config, test_return){
        var test_return = test_return.elems ? test_return.elems[0] : test_return[0] || test_return;
        if( test_return.value !== "my value 4" ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})