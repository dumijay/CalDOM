_pfreak.tasks.push({

    short_name: "get_value_multiple_elems",

    category: "unit_level_multiple_elements",
    description: 'Get Element.value from multiple nodes (10,000 repeats).',

    setTaskData: function(config){
        return {}
    },
    
    candidateSetup: function(config){
        config.repeats = config.repeats || 10000;
        
        var html = "";

        for( var i = 0; i < config.repeats; i++ ){
            html += '<input type="text" value="my value ' + i + '" />';
        }
        
        document.body.innerHTML = html;

        config.vanillaInstance = document.querySelectorAll("input");
        if( config.candidate == "caldom") config.caldomInstance = _( "input" );
        if( config.candidate == "umbrellajs") config.umbrellaJSInstance = u( "input" );
        if( config.candidate == "zepto") config.zeptoInstance = $( "input" );
        if( config.candidate == "jquery") config.jqueryInstance = jQuery( "input" );

        return config;
    },
    
    candidates: {
        "vanilla_js": function(config){

            var result= [];

            for( var elem_i = 0, elem_count = config.vanillaInstance.length; elem_i < elem_count; elem_i++ ){
                result.push( config.vanillaInstance[elem_i].value );
            }

            return result;

        },

        "caldom": function(config){

            return config.caldomInstance.val();

        },

        // Throws umbrellajs:3 Uncaught DOMException: Failed to execute 'querySelectorAll' on 'Document': 'my value 0' is not a valid selector.
        // "umbrellajs": function(config){

        //     var result;

        //     for( var i = 0; i < config.repeats; i++ ){
        //         result = config.umbrellaJSInstance.array(function(node){
        //             return node.value;
        //         });
        //     }

        //     return result;

        // },

        "zepto": function(config){

            return config.zeptoInstance.map(function(){
                return this.value;
            });

        },

        "jquery": function(config){

            return config.jqueryInstance.map(function(){
                return this.value;
            });

        }
    },

    assert: function(config, test_return){

        if( test_return.length != config.repeats ) throw("test_return.length = " + test_return.length);

        for (let i = 0; i < test_return.length; i++) {
            if( test_return[i] !== "my value " + i ) throw false;
        }
    },

        reset: function(){
        _pfreak.clearBody();
    }
})