_pfreak.tasks.push({

    short_name: "get_attr_multiple_elems",

    category: "unit_level_multiple_elements",
    description: 'Get attribute of multiple elements. (20,000 repeats).',

    setTaskData: function(config){
        return {}
    },

    candidateSetup: function(config){
        config.repeats = config.repeats || 20000;
        
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

            var result = [];

            for( var elem_i = 0, elem_count = config.vanillaInstance.length; elem_i < elem_count; elem_i++ ){
                result.push( config.vanillaInstance[elem_i].getAttribute("type") );
            }

            return result;

        },

        "caldom": function(config){

            return config.caldomInstance.attr("type");

        },

        // "umbrellajs": function(config){ //Failed

        //     return config.umbrellaJSInstance.array(function(node){
        //         return node.getAttribute("type");
        //     });

        // },

        "zepto": function(config){

            return config.zeptoInstance.map(function(){
                return this.getAttribute("type");
            });

        },

        "jquery": function(config){

            return config.jqueryInstance.map(function(){
                return this.getAttribute("type");
            });

        }
    },

    assert: function(config, test_return){
        var i = 0;

        if( test_return.length != config.repeats ) throw("test_return.length = " + test_return.length);

        for (var i = 0; i < test_return.length; i++) {
            if( test_return[i] !== "text" ) throw false;
        }
        
    },

        reset: function(){
        _pfreak.clearBody();
    }
})