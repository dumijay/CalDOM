_pfreak.tasks.push({

    short_name: "create_element_append",

    category: "unit_level_single_element",
    description: 's alternative createElement() mechanism. (35,000 repeats).',

    setTaskData: function(config){
        return {}
    },
    
    candidateSetup: function(config){
        _pfreak.clearBody();

        config.repeats = config.repeats || 35000;

        config.vanillaInstance = document.body;
        if( config.candidate == "caldom") config.caldomInstance = _( document.body );
        if( config.candidate == "umbrellajs") config.umbrellaJSInstance = u( document.body );
        if( config.candidate == "zepto") config.zeptoInstance = $( document.body );
        if( config.candidate == "jquery") config.jqueryInstance = jQuery( document.body );

        return config;
    },
    
    candidates: {
        "vanilla_js": function(config){

            for(var i = 0; i < config.repeats; i++ ){
                config.vanillaInstance.appendChild( document.createElement("div") );
            }

        },

        "caldom": function(config){

            for(var i = 0; i < config.repeats; i++ ){
                config.caldomInstance.append( _("+div") );
            }

        },

        "umbrellajs": function(config){

            for(var i = 0; i < config.repeats; i++ ){
                config.umbrellaJSInstance.append( "<div>");
            }

        },

        "zepto": function(config){

            for(var i = 0; i < config.repeats; i++ ){
                config.zeptoInstance.append( "<div></div>" );
            }

        },

        "jquery": function(config){

            for(var i = 0; i < config.repeats; i++ ){
                config.jqueryInstance.append( "<div></div>" );
            }

        }
    },

    assert: function(config){
        var divs = document.querySelectorAll("div");

        if( divs.length !== config.repeats ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})