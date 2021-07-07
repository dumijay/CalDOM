_pfreak.tasks.push({

    short_name: "set_multiple_attrs_multiple_elems",

    category: "unit_level_multiple_elements",
    description: 'Setting multiple attributes of multiple elements. (10,000 repeats).',

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

        config.attributes = {
            type: "text",
            value: "Some Text",
            placeholder: "Type your text here"
        }

        return config;
    },
    
    candidates: {
        "vanilla_js": function(config){

            for( var elem_i = 0, len = config.vanillaInstance.length; elem_i < len; elem_i++ ){
                for( var key in config.attributes ){
                    config.vanillaInstance[elem_i].setAttribute(key, config.attributes[key]);
                }
            }

        },

        "caldom": function(config){

            config.caldomInstance.attr(config.attributes);

        },

        "umbrellajs": function(config){

            config.umbrellaJSInstance.attr(config.attributes);

        },

        "zepto": function(config){

            config.zeptoInstance.attr(config.attributes);
            
        },

        "jquery": function(config){

            config.jqueryInstance.attr(config.attributes);

        }
    },

    assert: function(config){
        var elems = document.querySelectorAll("input");

        if( elems.length != config.repeats ) throw("elems.length = " + elems.length);

        for( var i = 0; i < elems.length; i++ ){
            for( var key in config.attributes ){
                if( elems[i].getAttribute(key) !== config.attributes[key] ) throw false;
            }
        }
    },

        reset: function(){
        _pfreak.clearBody();
    }
})