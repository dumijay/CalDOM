_pfreak.tasks.push({

    short_name: "set_css_multiple_elems",

    category: "unit_level_multiple_elements",
    description: 'Setting CSS of multiple elements. (10,000 repeats).',

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

        return config;
    },
    
    candidates: {
        "vanilla_js": function(config){
            
            for( var elem_i = 0, len = config.vanillaInstance.length; elem_i < len; elem_i++ ){
                config.vanillaInstance[elem_i].style.width = "100px";
                config.vanillaInstance[elem_i].style.height = "200px";
            }

        },

        "caldom": function(config){

            config.caldomInstance.css({
                width: "100px",
                height: "200px"
            });

        },

        //UmbrellaJS doesn't have a CSS()
        // "umbrellajs": function(config){

        //     for( var i = 0; i < config.repeats; i++ ){
        //         config.umbrellaJSInstance.css({
        //             width: "100px",
        //             height: "200px"
        //         });
        //     }

        // },

        "zepto": function(config){

            config.zeptoInstance.css({
                width: "100px",
                height: "200px"
            });
            
        },

        "jquery": function(config){

            config.jqueryInstance.css({
                width: "100px",
                height: "200px"
            });

        }
    },

    assert: function(config){
        var elems = document.querySelectorAll("input");

        if( elems.length != config.repeats ) throw("elems.length = " + elems.length);

        for( var i = 0; i < elems.length; i++ ){
            if( elems[i].style.width !== "100px" ) throw false;
            if( elems[i].style.height !== "200px" ) throw false;
        }
    },

        reset: function(){
        _pfreak.clearBody();
    }
})