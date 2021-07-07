_pfreak.tasks.push({

    short_name: "add_classes_multiple_elems",

    category: "unit_level_multiple_elements",
    description: 'Adding multiple classes to multiple elements. (20,000 repeats).',

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

            for( var elem_i = 0, len = config.vanillaInstance.length; elem_i < len; elem_i++ ){
                config.vanillaInstance[elem_i].classList.add("new-class-one");
                config.vanillaInstance[elem_i].classList.add("new-class-two");
                config.vanillaInstance[elem_i].classList.add("new-class-three");
            }

        },

        "caldom": function(config){

            config.caldomInstance.addClass("new-class-one new-class-two new-class-three");

        },

        "umbrellajs": function(config){

            config.umbrellaJSInstance.addClass("new-class-one new-class-two new-class-three");

        },

        "zepto": function(config){

            config.zeptoInstance.addClass("new-class-one new-class-two new-class-three");
            
        },

        "jquery": function(config){

            config.jqueryInstance.addClass("new-class-one new-class-two new-class-three");

        }
    },

    assert: function(config){
        var elems = document.querySelectorAll("input");

        if( elems.length != config.repeats ) throw("elems.length = " + elems.length);

        for( var i = 0; i < elems.length; i++ ){
            if( !elems[i].classList.contains("new-class-one") ) throw false;
            if( !elems[i].classList.contains("new-class-two") ) throw false;
            if( !elems[i].classList.contains("new-class-three") ) throw false;
        }
    },

        reset: function(){
        _pfreak.clearBody();
    }
})