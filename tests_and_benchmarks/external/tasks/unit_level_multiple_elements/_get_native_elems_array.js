_pfreak.tasks.push({

    short_name: "get_native_elems_array",

    category: "unit_level_multiple_elements",
    description: 'Get an array of native Elements from the instance. (10,000 repeats).',

    setTaskData: function(config){
        return {}
    },

    candidateSetup: function(config){
        document.body.innerHTML = '<div id="container">'
                + '<ol class="my-first-list">'
                    + '<li class="find-me">Item 1</li>'
                    + '<li class="find-me-not">Item 1</li>'
                    + '<li class="find-me">Item 1</li>'
                    + '<li class="find-me" custom_attr="find-me">Item 1</li>'
                    + '<li class="find-me-not">Item 1</li>'
                + '</ol>'
                + '<ol class="my-second-list">'
                    + '<li class="find-me" custom_attr="find-me">Item 1</li>'
                    + '<li class="find-me-not">Item 1</li>'
                    + '<li class="find-me">Item 1</li>'
                    + '<li class="find-me">Item 1</li>'
                    + '<li class="find-me-not" custom_attr="find-me">Item 1</li>'
                + '</ol>'
            + '</div>';

        config.vanillaInstance = document.querySelectorAll( '#container .my-first-list .find-me, #container .my-second-list .find-me, li[custom_attr="find-me"]' );
        if( config.candidate == "caldom") config.caldomInstance = _( document.body )
            .find( '#container .my-first-list .find-me, #container .my-second-list .find-me, li[custom_attr="find-me"]' );
        if( config.candidate == "umbrellajs") config.umbrellaJSInstance = u( document.body )
            .find( '#container .my-first-list .find-me, #container .my-second-list .find-me, li[custom_attr="find-me"]' );
        if( config.candidate == "zepto") config.zeptoInstance = $( document.body )
            .find( '#container .my-first-list .find-me, #container .my-second-list .find-me, li[custom_attr="find-me"]' );
        if( config.candidate == "jquery") config.jqueryInstance = jQuery( document.body )
            .find( '#container .my-first-list .find-me, #container .my-second-list .find-me, li[custom_attr="find-me"]' );

        return config;
    },
    
    candidates: {
        "vanilla_js": function(config){
            
            return config.vanillaInstance;

        },

        "caldom": function(config){

            return config.caldomInstance.elems

        },

        "umbrellajs": function(config){

            return config.umbrellaJSInstance.nodes;

        },

        "zepto": function(config){

            return config.zeptoInstance.get();

        },

        "jquery": function(config){

            return config.jqueryInstance.get();

        }
    },

    assert: function(config, test_return){
        var elems = document.body.querySelectorAll( '#container .my-first-list .find-me, #container .my-second-list .find-me, li[custom_attr="find-me"]' );

        for( var i = 0, len = elems.length; i < len; i++ ){
            if( elems[i].isEqualNode(test_return[i]) !== true  ) throw false;
        }
    },

        reset: function(){
        _pfreak.clearBody();
    }
})