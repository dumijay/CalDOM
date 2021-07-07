_pfreak.tasks.push({

    short_name: "get_text_single_elem",

    category: "unit_level_single_element",
    count: 4000,
    description: 's text from a single node (35,000 repeats).',

    setTaskData: function(config){
        return {}
    },
    
    candidateSetup: function(config){
        document.body.innerHTML = '<div id="text-container">Text Here</div>';

        config.vanillaInstance = document.querySelectorAll("#text-container")[0];
        if( config.candidate == "caldom") config.caldomInstance = _( "#text-container" );
        if( config.candidate == "umbrellajs") config.umbrellaJSInstance = u( "#text-container" );
        if( config.candidate == "zepto") config.zeptoInstance = $( "#text-container" );
        if( config.candidate == "jquery") config.jqueryInstance = jQuery( "#text-container" );

        config.repeats = config.repeats || 35000;

        return config;
    },
    
    candidates: {
        "vanilla_js": function(config){

            var last_return;

            for( var i = 0; i < config.repeats; i++ ){
                last_return = config.vanillaInstance.textContent;
            }

            return last_return;

        },

        "caldom": function(config){

            var last_return;

            for( var i = 0; i < config.repeats; i++ ){
                last_return = config.caldomInstance.text()[0];
            }

            return last_return;

        },

        "umbrellajs": function(config){

            var last_return;

            for( var i = 0; i < config.repeats; i++ ){
                last_return = config.umbrellaJSInstance.text();
            }

            return last_return;
            
        },

        "zepto": function(config){

            var last_return;

            for( var i = 0; i < config.repeats; i++ ){
                last_return = config.zeptoInstance.text();
            }

            return last_return;

        },

        "jquery": function(config){

            var last_return;

            for( var i = 0; i < config.repeats; i++ ){
                last_return = config.jqueryInstance.text();
            }

            return last_return;

        }
    },

    assert: function(config, test_return){
        if( test_return !== "Text Here" ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})