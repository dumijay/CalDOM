_pfreak.tasks.push({

    short_name: "get_text_multiple_elems",

    category: "unit_level_multiple_elements",
    count: 4000,
    description: 's text from multiple nodes (10,000 repeats).',

    setTaskData: function(config){
        return {}
    },
    
    candidateSetup: function(config){
        config.repeats = config.repeats || 10000;
        
        var html = "";

        for( var i = 0; i < config.repeats; i++ ){
            html += '<div>Text ' + i + '</div>';
        }
        
        document.body.innerHTML = html;

        config.vanillaInstance = document.querySelectorAll("div");
        if( config.candidate == "caldom") config.caldomInstance = _( "div" );
        if( config.candidate == "umbrellajs") config.umbrellaJSInstance = u( "div" );
        if( config.candidate == "zepto") config.zeptoInstance = $( "div" );
        if( config.candidate == "jquery") config.jqueryInstance = jQuery( "div" );

        return config;
    },
    
    candidates: {
        "vanilla_js": function(config){

            var result= [];

            for( var elem_i = 0, elem_count = config.vanillaInstance.length; elem_i < elem_count; elem_i++ ){
                result.push( config.vanillaInstance[elem_i].textContent );
            }

            return result;

        },

        "caldom": function(config){

            return config.caldomInstance.text();

        },

        "umbrellajs": function(config){

            return config.umbrellaJSInstance.array();

        },

        "zepto": function(config){

            return config.zeptoInstance.map(function(){
                return this.textContent;
            });

        },

        "jquery": function(config){

            return config.jqueryInstance.map(function(){
                return this.textContent;
            });

        }
    },

    assert: function(config, test_return){

        if( test_return.length != config.repeats ) throw("test_return.length = " + test_return.length);

        for (let i = 0; i < test_return.length; i++) {
            if( test_return[i] !== "Text " + i ) throw false;
        }
            
    },

        reset: function(){
        _pfreak.clearBody();
    }
})