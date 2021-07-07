_pfreak.tasks.push({

    short_name: "document_body_instance",

    category: "unit_level_single_element",
    description: 'Creating an instance with document.body (45,000 repeats).',

    setTaskData: function(config){
    },

    candidateSetup: function(config){

        config.repeats = config.repeats || 45000;
        
        return config;
    },
    
    candidates: {
        "vanilla_js": function(config){
            
            var last_elem;

            for(var i = 0; i < config.repeats; i++ ){
                last_elem = document.body;
            }

            return last_elem;

        },

        "caldom": function(config){

            var last_elem;

            for(var i = 0; i < config.repeats; i++ ){
                last_elem = _(document.body);
            }

            return last_elem;

        },

        "umbrellajs": function(config){

            var last_elem;

            for(var i = 0; i < config.repeats; i++ ){
                last_elem = u(document.body);
            }

            return last_elem;

        },

        "zepto": function(config){

            var last_elem;

            for(var i = 0; i < config.repeats; i++ ){
                last_elem = $(document.body);
            }

            return last_elem;

        },

        "jquery": function(config){

            var last_elem;

            for(var i = 0; i < config.repeats; i++ ){
                last_elem = jQuery(document.body);
            }

            return last_elem;

        }
    },

    assert: function(config, test_return){
        var firstNode = test_return.elems ? test_return.elems[0]: test_return.nodes ? test_return.nodes[0] : test_return[0] || test_return;

        if( document.body.isEqualNode(firstNode) !== true ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})