_pfreak.tasks.push({

    short_name: "css_selector_find",

    category: "unit_level_single_element",
    description: 'Finding <li> elements inside 3 levels down in the DOM tree. (45,000 repeats).',

    setTaskData: function(config){
        return {}
    },

    candidateSetup: function(config){
        config.repeats = config.repeats || 45000;

        document.body.innerHTML = '<div id="container">'
                + '<ol class="my-first-list">'
                    + '<li class="find-me">Item 1</li>'.repeat(config.repeats)
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

        config.vanillaInstance = document.body;
        if( config.candidate == "caldom") config.caldomInstance = _( document.body );
        if( config.candidate == "umbrellajs") config.umbrellaJSInstance = u( document.body );
        if( config.candidate == "zepto") config.zeptoInstance = $( document.body );
        if( config.candidate == "jquery") config.jqueryInstance = jQuery( document.body );

        return config;
    },
    
    candidates: {
        "vanilla_js": function(config){
            
            return config.vanillaInstance.querySelectorAll( '#container .my-first-list .find-me, #container .my-second-list .find-me, li[custom_attr="find-me"]' );

        },

        "caldom": function(config){

            return config.caldomInstance
                .find( '#container .my-first-list .find-me, #container .my-second-list .find-me, li[custom_attr="find-me"]' );

        },

        "umbrellajs": function(config){

            return config.umbrellaJSInstance
                .find( '#container .my-first-list .find-me, #container .my-second-list .find-me, li[custom_attr="find-me"]' );

        },

        "zepto": function(config){

            return config.zeptoInstance
                .find( '#container .my-first-list .find-me, #container .my-second-list .find-me, li[custom_attr="find-me"]' );

        },

        "jquery": function(config){

            return config.jqueryInstance
                .find( '#container .my-first-list .find-me, #container .my-second-list .find-me, li[custom_attr="find-me"]' );

        }
    },

    assert: function(config, test_return){
        var elems = document.body.querySelectorAll( '#container .my-first-list .find-me, #container .my-second-list .find-me, li[custom_attr="find-me"]' );

        for( var i = 0, len = elems.length; i < len; i++ ){
            var test_returned_elem = test_return.elems ? test_return.elems[i]: test_return.nodes ? test_return.nodes[i] : test_return[i] || test_return;

            if( elems[i].isEqualNode(test_returned_elem) !== true  ) throw false;
        }
    },

        reset: function(){
        _pfreak.clearBody();
    }
})