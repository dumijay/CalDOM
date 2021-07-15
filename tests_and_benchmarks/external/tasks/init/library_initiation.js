_pfreak.tasks.push({

    short_name: "library_initiation",
    display_order: 55,
    category: "init",
    description: '',
    assert_delay: 0,
    load_libraries: false,

    setTaskData: function(config){
        return config;
    },
    
    candidateSetup: function(config){
        _pfreak.clearBody();

        config.library_paths = {
            "vanilla_js": null,
            "caldom": {
                "sources": [
                    "caldom.min.js"
                ],
                "isLoadedFunction": " return typeof _ != 'undefined' "
            },
            "caldom.render": {
                "sources": [
                    "caldom.min.js"
                ],
                "isLoadedFunction": " return typeof _ != 'undefined' "
            },
            "caldom.update": {
                "sources": [
                    "caldom.min.js"
                ],
                "isLoadedFunction": " return typeof _ != 'undefined' "
            },
            "umbrellajs": {
                "sources": [
                    "umbrellajs-3.2.2.js"
                ],
                "isLoadedFunction": " return typeof u != 'undefined' "
            },
            "zepto": {
                "sources": [
                    "zepto-1.2.0.min.js"
                ],
                "isLoadedFunction": " return typeof $ != 'undefined' "
            },
            "jquery": {
                "sources": [
                    "jquery-3.6.0.min.js"
                ],
                "isLoadedFunction": " return typeof jQuery != 'undefined' "
            },
            "react_keyed": {
                "sources": [
                    "react.production-17.0.2.min.js",
                    "react-dom.production-17.0.2.min.js"
                ],
                "isLoadedFunction": " return typeof React != 'undefined' && typeof ReactDOM != 'undefined' "
            },
            "react_non_keyed": {
                "sources": [
                    "react.production-17.0.2.min.js",
                    "react-dom.production-17.0.2.min.js"
                ],
                "isLoadedFunction": " return typeof React != 'undefined' && typeof ReactDOM != 'undefined' "
            },
            "vue_keyed": {
                "sources": [
                    "vue.global.prod-3.1.1.js"
                ],
                "isLoadedFunction": " return typeof Vue != 'undefined' "
            },
            "vue_non_keyed": {
                "sources": [
                    "vue.global.prod-3.1.1.js"
                ],
                "isLoadedFunction": " return typeof Vue != 'undefined' "
            }
        }

        config.loadLibraries = function(sources){
            for( var i = 0; i < sources.length; i++ ){
                var script = document.createElement("script");
                script.src = "libraries/" +  sources[i];

                document.body.appendChild(script);
            }
        }

        return config;
    },
    
    candidates: {
        "vanilla_js": function(config){
            
        },

        "caldom": function(config){
            config.loadLibraries( config.library_paths[config.candidate].sources );
        },

        "umbrellajs": function(config){
            config.loadLibraries( config.library_paths[config.candidate].sources );
        },

        "zepto": function(config){
            config.loadLibraries( config.library_paths[config.candidate].sources );
        },

        "jquery": function(config){
            config.loadLibraries( config.library_paths[config.candidate].sources );
        },

        "caldom.render": function(config){
            config.loadLibraries( config.library_paths[config.candidate].sources );
        },

        "caldom.update": function(config){
            config.loadLibraries( config.library_paths[config.candidate].sources );
        },

        "vue_keyed": function(config){
            config.loadLibraries( config.library_paths[config.candidate].sources );
        },

        "vue_non_keyed": function(config){
            config.loadLibraries( config.library_paths[config.candidate].sources );
        },

        "react_keyed": function(config){
            config.loadLibraries( config.library_paths[config.candidate].sources );
        },

        "react_non_keyed": function(config){
            config.loadLibraries( config.library_paths[config.candidate].sources );
        }
    },

    assert: function(config, test_return){
        if( config.candidate != "vanilla_js"){
            var isLoaded = new Function( config.library_paths[config.candidate].isLoadedFunction );
            if( !isLoaded() ) throw( config.candidate + " failed to load." );
        }
    },

    reset: function(){
        _pfreak.clearBody();
    }
});