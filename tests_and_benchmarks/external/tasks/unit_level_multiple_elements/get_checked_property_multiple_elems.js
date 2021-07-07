_pfreak.tasks.push({

    short_name: "get_checked_property_multiple_elems",

    category: "unit_level_multiple_elements",
    description: 'Get Element.checked property from multiple nodes (20,000 repeats).',

    setTaskData: function(config){
        return {}
    },
    
    candidateSetup: function(config){
        config.repeats = config.repeats || 20000;

        var count = config.repeats / 2;
        
        if( count < 1 ) count = 1;

        document.body.innerHTML = '<input type="checkbox" checked /><input type="checkbox" />'.repeat(count);

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
                result.push( config.vanillaInstance[elem_i].checked );
            }

            return result;

        },

        "caldom": function(config){

            return config.caldomInstance.prop("checked");

        },

        // Only returning true values
        // "umbrellajs": function(config){

        //     var result;

        //     for( var i = 0; i < config.repeats; i++ ){
        //         result = config.umbrellaJSInstance.array(function(i, node){
        //             return node.checked;
        //         });
        //     }

        //     return result;

        // },

        "zepto": function(config){

            return config.zeptoInstance.map(function(){
                return this.checked;
            });

        },

        "jquery": function(config){

            return config.jqueryInstance.map(function(){
                return this.checked;
            });

        }
    },

    assert: function(config, test_return){
        var elems = document.querySelectorAll("input");

        var count = config.repeats / 2;
        if( count < 1 ) count = 1;

        if( elems.length / 2 != count ) throw("elems.length = " + elems.length);

        for( var i = 0; i < elems.length; i++ ){
            if( !elems[i].checked != i % 2 ) throw false;
        }
    },

        reset: function(){
        _pfreak.clearBody();
    }
})