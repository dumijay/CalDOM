_pfreak.tasks.push({

    short_name: "set_checked_property_multiple_elems",

    category: "unit_level_multiple_elements",
    description: 'Set checked property of multiple elements. (20,000 repeats).',

    setTaskData: function(config){
        return {}
    },
    
    candidateSetup: function(config){

        config.repeats = config.repeats || 20000;

        var count = config.repeats / 2;
        
        if( count < 1 ) count = 1;

        document.body.innerHTML = '<input type="checkbox" checked /><input type="checkbox" />'.repeat(count);

        config.vanillaInstance = document.querySelectorAll("input");
        if( config.candidate == "caldom") config.caldomInstance = _( "input" );
        if( config.candidate == "umbrellajs") config.umbrellaJSInstance = u( "input" );
        if( config.candidate == "zepto") config.zeptoInstance = $( "input" );
        if( config.candidate == "jquery") config.jqueryInstance = jQuery( "input" );

        return config;
    },
    
    candidates: {
        "vanilla_js": function(config){

            for( var elem_i = 0, elem_count = config.vanillaInstance.length; elem_i < elem_count; elem_i++ ){
                config.vanillaInstance[elem_i].checked = true;
            }
        },

        "caldom": function(config){

            config.caldomInstance.prop("checked", true);

        },

        // Couldn't find prop() or an equivalent
        // "umbrellajs": function(config){


        // },

        "zepto": function(config){

            config.zeptoInstance.prop("checked", true);

        },

        "jquery": function(config){

            config.jqueryInstance.prop("checked", true);

        }
    },

    assert: function(config, test_return){

        var elems = document.querySelectorAll("input");
        
        var count = config.repeats / 2;
        if( count < 1 ) count = 1;

        if( elems.length / 2 != count ) throw("elems.length = " + elems.length);

        for( var i = 0; i < elems.length; i++ ){
            if( elems[i].checked !== true ) throw false;
        }
    },

        reset: function(){
        _pfreak.clearBody();
    }
})