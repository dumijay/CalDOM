_pfreak.tasks.push({

    short_name: "append_multiple_elems",

    category: "unit_level_multiple_elements",
    description: 'Append multiple native Elements to document.body (2,000 repeats).',

    setTaskData: function(config){
        return {}
    },
    
    candidateSetup: function(config){
        _pfreak.clearBody();

        config.repeats = config.repeats || 2000;

        config.vanillaInstance = document.body;
        if( config.candidate == "caldom") config.caldomInstance = _( document.body );
        if( config.candidate == "umbrellajs") config.umbrellaJSInstance = u( document.body );
        if( config.candidate == "zepto") config.zeptoInstance = $( document.body );
        if( config.candidate == "jquery") config.jqueryInstance = jQuery( document.body );

        config.elems = [];

        for( var i = 0; i < config.repeats; i++ ){
            config.elems.push(
                document.createElement("div"),
                document.createElement("p"),
                document.createElement("a"),
                document.createElement("span"),
                document.createElement("section")
            )
        }


        return config;
    },
    
    candidates: {
        "vanilla_js": function(config){
            
            for( var elem_i = 0, len = config.elems.length; elem_i < len; elem_i++ ){
                config.vanillaInstance.appendChild( config.elems[elem_i] );
            }

        },

        "caldom": function(config){

            config.caldomInstance.append( config.elems );

        },

        "umbrellajs": function(config){

            config.umbrellaJSInstance.append( config.elems );

        },

        "zepto": function(config){
                        
            var elems = [
                document.createElement("div"),
                document.createElement("p"),
                document.createElement("a"),
                document.createElement("span"),
                document.createElement("section")
            ];

            config.zeptoInstance.append( config.elems );

        },

        "jquery": function(config){

            config.jqueryInstance.append( config.elems );

        }
    },

    assert: function(config, test_return){

        var appended_elems = document.body.querySelectorAll(":not(script)");

        if( appended_elems.length != config.repeats * 5 ) throw("elems.length = " + appended_elems.length);

        for( var i = 0; i < appended_elems.length; i++ ){
            if( appended_elems[i].tagName !== config.elems[i].tagName ) throw false;
        }
    },

        reset: function(){
        _pfreak.clearBody();
    }
})