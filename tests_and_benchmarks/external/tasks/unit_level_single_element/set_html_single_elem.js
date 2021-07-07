_pfreak.tasks.push({

    short_name: "set_html_single_elem",

    category: "unit_level_single_element",
    description: 'Setting innerHTML of a single element. (35,000 repeats).',

    setTaskData: function(config){
        return {}
    },

    candidateSetup: function(config){
        config.repeats = config.repeats || 35000;

        document.body.innerHTML = '<div class="text-container"></div>'.repeat(config.repeats);

        var divs = document.body.querySelectorAll( "div" );

        config.instances = [];

        for( var i = 0; i < config.repeats; i++ ){
            if( config.candidate == "vanilla_js") config.instances.push(divs[i]);
            else if( config.candidate == "caldom") config.instances.push( _( divs[i] ) );
            else if( config.candidate == "umbrellajs") config.instances.push( u( divs[i] ) );
            else if( config.candidate == "zepto") config.instances.push( $( divs[i] ) );
            else if( config.candidate == "jquery") config.instances.push( jQuery( divs[i] ) );
        }

        return config;
    },
    
    candidates: {
        "vanilla_js": function(config){

            for( var i = 0; i < config.repeats; i++ ){
                config.instances[i].innerHTML = '<div class="new-div-element"></div>';
            }

        },

        "caldom": function(config){

            for( var i = 0; i < config.repeats; i++ ){
                config.instances[i].html('<div class="new-div-element"></div>');
            }

        },

        "umbrellajs": function(config){

            for( var i = 0; i < config.repeats; i++ ){
                config.instances[i].html('<div class="new-div-element"></div>');
            }

        },

        "zepto": function(config){

            for( var i = 0; i < config.repeats; i++ ){
                config.instances[i].html('<div class="new-div-element"></div>');
            }
            
        },

        "jquery": function(config){

            for( var i = 0; i < config.repeats; i++ ){
                config.instances[i].html('<div class="new-div-element"></div>');
            }

        }
    },

    assert: function(config){
        var elems = document.querySelectorAll(".text-container");

        if( elems.length != config.repeats ) throw("elems.length = " + elems.length);

        for( var i = 0; i < config.repeats; i++ ){
            if( elems[i].innerHTML !== '<div class="new-div-element"></div>' ) throw elems[i].innerHTML;
        }
    },

        reset: function(){
        _pfreak.clearBody();
    }
})