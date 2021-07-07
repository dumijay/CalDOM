_pfreak.tasks.push({

    short_name: "set_html_multiple_elems",

    category: "unit_level_multiple_elements",
    description: 'Setting innerHTML of multiple elements. (10,000 repeats).',

    setTaskData: function(config){
        return {}
    },

    candidateSetup: function(config){
        config.repeats = config.repeats || 10000;
        
        document.body.innerHTML = '<div id="container">'
                + '<ol class="my-first-list">'
                    + '<li class="find-me">Item 1</li>'.repeat(config.repeats)
                + '</ol>'
            + '</div>';

        config.vanillaInstance = document.body.querySelectorAll( "li" );
        if( config.candidate == "caldom") config.caldomInstance = _( "li" );
        if( config.candidate == "umbrellajs") config.umbrellaJSInstance = u( "li" );
        if( config.candidate == "zepto") config.zeptoInstance = $( "li" );
        if( config.candidate == "jquery") config.jqueryInstance = jQuery( "li" );

        return config;
    },
    
    candidates: {
        "vanilla_js": function(config){

            for( var elem_i = 0, len = config.vanillaInstance.length; elem_i < len; elem_i++ ){
                config.vanillaInstance[elem_i].innerHTML = '<div class="new-div-element"></div>';
            }

        },

        "caldom": function(config){

            config.caldomInstance.html('<div class="new-div-element"></div>');

        },

        "umbrellajs": function(config){

            config.umbrellaJSInstance.html('<div class="new-div-element"></div>');

        },

        "zepto": function(config){

            config.zeptoInstance.html('<div class="new-div-element"></div>');
            
        },

        "jquery": function(config){

            config.jqueryInstance.html('<div class="new-div-element"></div>');

        }
    },

    assert: function(config){
        var elems = document.querySelectorAll("li");

        if( elems.length != config.repeats ) throw("elems.length = " + elems.length);

        for( var i = 0; i < elems.length; i++ ){
            if( elems[i].innerHTML !== '<div class="new-div-element"></div>' ) throw false;
        }
        
    },

        reset: function(){
        _pfreak.clearBody();
    }
})