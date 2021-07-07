_pfreak.tasks.push({

    short_name: "add_class_multiple_elems",

    category: "unit_level_multiple_elements",
    description: 'Adding a class to multiple elements. (20,000 repeats).',

    setTaskData: function(config){
        return {}
    },

    candidateSetup: function(config){

        config.repeats = config.repeats || 20000;

        document.body.innerHTML = '<input type="text" />'.repeat(config.repeats);

        config.vanillaInstance = document.body.querySelectorAll( "input" );
        if( config.candidate == "caldom") config.caldomInstance =  _( "input" );
        if( config.candidate == "umbrellajs") config.umbrellaJSInstance = u( "input" );
        if( config.candidate == "zepto") config.zeptoInstance = $( "input" );
        if( config.candidate == "jquery") config.jqueryInstance = jQuery( "input" );

        return config;
    },
    
    candidates: {
        "vanilla_js": function(config){

            for( var elem_i = 0, len = config.vanillaInstance.length; elem_i < len; elem_i++ ){
                config.vanillaInstance[elem_i].classList.add("new-class");
            }

        },

        "caldom": function(config){

            config.caldomInstance.addClass("new-class");

        },

        "umbrellajs": function(config){

            config.umbrellaJSInstance.addClass("new-class");

        },

        "zepto": function(config){
            
            config.zeptoInstance.addClass("new-class");
            
        },

        "jquery": function(config){

            config.jqueryInstance.addClass("new-class");

        }
    },

    assert: function(config){
        var elems = document.querySelectorAll("input");

        if( elems.length != config.repeats ) throw("elems.length = " + elems.length);
        
        for( var i = 0; i < elems.length; i++ ){
            if( !elems[i].classList.contains("new-class") ) throw false;
        }
    },

        reset: function(){
        _pfreak.clearBody();
    }
})