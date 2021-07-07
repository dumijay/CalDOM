_pfreak.tasks.push({

    short_name: "set_multiple_properties_multiple_elems",

    category: "unit_level_multiple_elements",
    description: 'Set multiple properties of multiple elements. (10,000 repeats).',

    setTaskData: function(config){
        return {}
    },
    
    candidateSetup: function(config){
        config.repeats = config.repeats || 10000;
        
        document.body.innerHTML = '<input/>'.repeat(config.repeats);

        config.vanillaInstance = document.querySelectorAll("input");
        if( config.candidate == "caldom") config.caldomInstance = _( "input" );
        if( config.candidate == "umbrellajs") config.umbrellaJSInstance = u( "input" );
        if( config.candidate == "zepto") config.zeptoInstance = $( "input" );
        if( config.candidate == "jquery") config.jqueryInstance = jQuery( "input" );

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

            for( var elem_i = 0, elem_count = config.vanillaInstance.length; elem_i < elem_count; elem_i++ ){
                for( var key in config.properties ){
                    config.vanillaInstance[elem_i][key] = config.properties[key];
                }
            }

        },

        "caldom": function(config){

            config.caldomInstance.prop(config.properties);

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

            config.jqueryInstance.prop(config.properties);

        }
    },

    assert: function(config, test_return){

        var elems = document.querySelectorAll("input");

        if( elems.length != config.repeats ) throw("elems.length = " + elems.length);

        for( var i = 0; i < elems.length; i++ ){
            for( var key in config.properties ){
                if( elems[i][key] != config.properties[key] ) throw false;
            }
        }
    },

        reset: function(){
        _pfreak.clearBody();
    }
})