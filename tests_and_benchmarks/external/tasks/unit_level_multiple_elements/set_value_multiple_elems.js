_pfreak.tasks.push({

    short_name: "set_value_multiple_elems",

    category: "unit_level_multiple_elements",
    description: 'Setting value of multiple elements. (10,000 repeats).',

    setTaskData: function(config){
        return {}
    },

    candidateSetup: function(config){
        config.repeats = config.repeats || 10000;
        
        var html = "";

        for( var i = 0; i < config.repeats; i++ ){
            html += '<input type="text" value="my value ' + i + '" />';
        }
        
        document.body.innerHTML = html;

        config.vanillaInstance = document.body.querySelectorAll( 'input' );
        if( config.candidate == "caldom") config.caldomInstance = _('input' );
        if( config.candidate == "umbrellajs") config.umbrellaJSInstance = u('input' );
        if( config.candidate == "zepto") config.zeptoInstance = $('input' );
        if( config.candidate == "jquery") config.jqueryInstance = jQuery('input' );

        return config;
    },
    
    candidates: {
        "vanilla_js": function(config){

            for( var elem_i = 0, len = config.vanillaInstance.length; elem_i < len; elem_i++ ){
                config.vanillaInstance[elem_i].value = "new_value";
            }

        },

        "caldom": function(config){

            config.caldomInstance.val("new_value");

        },

        // No short-hand for value
        // "umbrellajs": function(config){

        //     for( var i = 0; i < config.repeats; i++ ){
        //         config.umbrellaJSInstance.val("new_value");
        //     }

        // },

        "zepto": function(config){

            config.zeptoInstance.val("new_value");
            
        },

        "jquery": function(config){

            config.jqueryInstance.val("new_value");

        }
    },

    assert: function(config){
        var elems = document.querySelectorAll("input");

        if( elems.length != config.repeats ) throw("elems.length = " + elems.length);

        for( var i = 0; i < elems.length; i++ ){
            if( elems[i].value !== "new_value" ) throw false;
        }
    },

        reset: function(){
        _pfreak.clearBody();
    }
})