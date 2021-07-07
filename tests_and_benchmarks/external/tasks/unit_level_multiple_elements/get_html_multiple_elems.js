_pfreak.tasks.push({

    short_name: "get_html_multiple_elems",

    category: "unit_level_multiple_elements",
    count: 4000,
    description: 's innerHTML from multiple nodes (10,000 repeats).',

    setTaskData: function(config){
        return {}
    },
    
    candidateSetup: function(config){
        config.repeats = config.repeats || 10000;
        
        document.body.innerHTML = '<div><p class="new-elem"></p></div>'.repeat(config.repeats);

        config.vanillaInstance = document.querySelectorAll("div");
        if( config.candidate == "caldom") config.caldomInstance = _( "div" );
        if( config.candidate == "umbrellajs") config.umbrellaJSInstance = u( "div" );
        if( config.candidate == "zepto") config.zeptoInstance = $( "div" );
        if( config.candidate == "jquery") config.jqueryInstance = jQuery( "div" );

        return config;
    },
    
    candidates: {
        "vanilla_js": function(config){

            var result = [];

            for( var elem_i = 0, elem_count = config.vanillaInstance.length; elem_i < elem_count; elem_i++ ){
                result.push( config.vanillaInstance[elem_i].innerHTML );
            }

            return result;

        },

        "caldom": function(config){

            return config.caldomInstance.html();

        },

        // This is returning <li> nodes instead of a it's innerHTML string
        // "umbrellajs": function(config){

        //     var result;

        //     for( var i = 0; i < config.repeats; i++ ){
        //         result = config.umbrellaJSInstance.array(function(node){
        //             return node.innerHTML;
        //         });
        //     }

        //     return result;

        // },

        "zepto": function(config){

            return config.zeptoInstance.map(function(){
                return this.innerHTML;
            });

        },

        "jquery": function(config){

            return config.jqueryInstance.map(function(){
                return this.innerHTML;
            });

        }
    },

    assert: function(config, test_return){

        if( test_return.length != config.repeats ) throw("test_return.length = " + test_return.length);

        for (let i = 0; i < test_return.length; i++) {
            if( test_return[i] !== '<p class="new-elem"></p>' ) throw false;
        }
            
    },

        reset: function(){
        _pfreak.clearBody();
    }
})