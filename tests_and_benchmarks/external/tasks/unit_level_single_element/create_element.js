_pfreak.tasks.push({

    short_name: "create_element",

    category: "unit_level_single_element",
    description: 'Creating an Element. (35,000 repeats).',

    setTaskData: function(config){
        return {}
    },
    
    candidateSetup: function(config){
        _pfreak.clearBody();

        config.repeats = config.repeats || 35000;

        return config;
    },
    
    candidates: {
        "vanilla_js": function(config){

            var last_elem;

            for( var i = 0; i < config.repeats; i++ ){
                last_elem = document.createElement("div");
            }

            return last_elem;
            
        },

        "caldom": function(config){

            var last_elem;

            for( var i = 0; i < config.repeats; i++ ){
                last_elem = _("+div").elems[0];
            }

            return last_elem;

        },

        "umbrellajs": function(config){

            var last_elem;

            for( var i = 0; i < config.repeats; i++ ){
                last_elem = u("<div>").nodes[0];
            }

            return last_elem;

        },

        "zepto": function(config){

            var last_elem;

            for( var i = 0; i < config.repeats; i++ ){
                last_elem = $("<div></div>")[0];
            }

            return last_elem;
            
        },

        "jquery": function(config){

            var last_elem;

            for( var i = 0; i < config.repeats; i++ ){
                last_elem = jQuery("<div></div>")[0];
            }

            return last_elem;

        }
    },

    assert: function(config, test_return){
        
        if( test_return.tagName !== "DIV" ) throw false;

    },

    reset: function(){
        _pfreak.clearBody();
    }
})