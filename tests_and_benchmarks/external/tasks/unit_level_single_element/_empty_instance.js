_pfreak.tasks.push({

    short_name: "empty_instance",

    category: "unit_level_single_element",
    description: 'Creating an empty instance. Note that document.querySelectorAll(null) is used for VanillaJS. (35,000 repeats).',

    setTaskData: function(config){
    },

    candidateSetup: function(config){

        config.repeats = config.repeats || 35000;
        
        return config;
    },
    
    candidates: {
        "vanilla_js": function(config){
            var last_instance;

            for(var i = 0; i < config.repeats; i++ ){
                last_instance = document.querySelectorAll(null);
            }
            
            return last_instance
        },

        "caldom": function(config){
            var last_instance;

            for(var i = 0; i < config.repeats; i++ ){
                last_instance = _(null);
            }
            
            return last_instance
        },

        "umbrellajs": function(config){
            var last_instance;

            for(var i = 0; i < config.repeats; i++ ){
                last_instance = u(null);
            }
            
            return last_instance

        },

        "zepto": function(config){
            var last_instance;

            for(var i = 0; i < config.repeats; i++ ){
                last_instance = $(null);
            }
            
            return last_instance
        },

        "jquery": function(config){
            var last_instance;

            for(var i = 0; i < config.repeats; i++ ){
                last_instance = jQuery(null);
            }
            
            return last_instance

        }
    },

    assert: function(config, test_return){
        //Ignored
    },

    reset: function(){
        //Nothing to clear
    }
});