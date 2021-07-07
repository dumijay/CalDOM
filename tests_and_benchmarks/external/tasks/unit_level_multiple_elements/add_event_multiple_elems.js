_pfreak.tasks.push({

    short_name: "add_event_multiple_elems",

    category: "unit_level_multiple_elements",
    description: 'Adding multiple classes to multiple elements. (10,000 repeats).',

    setTaskData: function(config){
        return {}
    },

    candidateSetup: function(config){
        config.repeats = config.repeats || 10000;
        
        document.body.innerHTML = '<input type="text" />'.repeat(config.repeats);

        config.vanillaInstance = document.body.querySelectorAll( "input" );
        if( config.candidate == "caldom") config.caldomInstance = _( "input" );
        if( config.candidate == "umbrellajs") config.umbrellaJSInstance = u( "input" );
        if( config.candidate == "zepto") config.zeptoInstance = $( "input" );
        if( config.candidate == "jquery") config.jqueryInstance = jQuery( "input" );

        config.clickEventListener = function(e){
            e.target._clicked = true;
        }

        return config;
    },
    
    candidates: {
        "vanilla_js": function(config){

            for( var elem_i = 0, len = config.vanillaInstance.length; elem_i < len; elem_i++ ){
                config.vanillaInstance[elem_i].addEventListener("click", config.clickEventListener);
            }

        },

        "caldom": function(config){

            config.caldomInstance.on("click", config.clickEventListener);

        },

        "umbrellajs": function(config){

            config.umbrellaJSInstance.on("click", config.clickEventListener);

        },

        "zepto": function(config){
            
            config.zeptoInstance.on("click", config.clickEventListener);

        },

        "jquery": function(config){

            config.jqueryInstance.on("click", config.clickEventListener);

        }
    },

    assert: function(config){
        var elems = document.querySelectorAll("input");

        if( elems.length != config.repeats ) throw("elems.length = " + elems.length);

        for( var i = 0; i < elems.length; i++ ){
            elems[i].click();

            if( !elems[i]._clicked ) throw false;
        }
    },

        reset: function(){
        _pfreak.clearBody();
    }
})