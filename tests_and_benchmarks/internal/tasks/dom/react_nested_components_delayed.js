_pfreak.tasks.push({

    short_name: "react_nested_components_delayed",
    display_order: 93,
    category: "dom",
    description: "",
    assert_delay: 2000,

    setTaskData: function(config){
        return config;
    },
    
    candidateSetup: function(config){
        _pfreak.clearBody();

        window.pfreak_render_count = 0;
        window.pfreak_update_count = 0;

        return config;
    },
    
    candidates: {
        "caldom": function(config){

            var ParentApp = function(){
                return _().react(
                    {
                        child_apps: []
                    },
                    {
                        willMount(){
                            this.render_count = 0;
                        },
            
                        render(state, parent){
                            window.pfreak_render_count++;
            
                            return _( "+div", [
                                _("+h1", ["Not Changing Heading"]),
                                this.render_count == 1 ? _("+h2").text("Buhaaaaa!") : null,
                                parent.$.span = _("+span", ["Child App:"]),
                                parent.$.child_container = _("+div", state.child_apps ),
                            ])
                            .prop( "render_count", parent.render_count++ );
                        }
                    }
                );
            }
            
            var ChildApp = function(){
                return _().react(
                    {
                        time: window.pfreak_render_count
                    },
                    {
                        willMount(){
                            this.render_count = 0;
                        },
            
                        render(state, item){
                            window.pfreak_render_count++;
                
                            return _("+section", [
                                item.$.p = _( "+p", [state.time] ).elems[0]
                            ])
                            .prop( "render_count", this.render_count++ );
                        },
            
                        update(state, item){
                            window.pfreak_update_count++
                            item.$.p.textContent = state.time;
                        }
                    }
                );
            }
            
            window.parentApp = ParentApp();
            
            _("body").append( parentApp );

            var delay = 100;
            var delay_gap = 200;

            function addItem(delay){
                setTimeout(function(){
                    parentApp.state.child_apps.push( ChildApp() );
                }, delay);
            }

            addItem(delay += delay_gap);
            addItem(delay += delay_gap);
            addItem(delay += delay_gap);
            addItem(delay += delay_gap);

            setTimeout(function(){
                parentApp.state.child_apps.splice(2, 1);

                setTimeout(function(){
                    delay = delay_gap + 0;

                    parentApp.state.child_apps[2].state.time = "asdfsdf";

                    addItem( delay += delay_gap );
                    addItem( delay += delay_gap );

                    // setTimeout( resolve, delay += delay_gap);
                }, delay_gap);

            }, delay += delay_gap);

            return parentApp;
        }
    },

    assert: function(config, test_return){

        if( window.pfreak_render_count != 14 ) throw "Render count is " + window.pfreak_render_count;
        if( window.pfreak_update_count != 1 ) throw "Update count is " + window.pfreak_update_count;

        if( document.querySelectorAll("span").length != 1 ) throw "Span not found";
        if( document.querySelectorAll("span")[0].textContent != "Child App:" ) throw "Span's text is " + document.querySelectorAll("span")[0].textContent;

        var list_items = document.querySelectorAll("p");

        if( list_items.length != 5 ) throw "P count is not 5. Actual: " + list_items.length;
        if( list_items[2].textContent != "asdfsdf" ) throw "p[2] text is " + list_items[2].textContent;

        for( var i = 0; i < list_items.length; i++ ){
            if( list_items[i] !== parentApp.state.child_apps[i].elems[0].firstChild ){
                // console.log(list_items[i], parentApp.state.child_apps[i].elems[0].firstChild, list_items[i] === parentApp.state.child_apps[i].elems[0].firstChild); 
                throw "Actual DOM nodes[i] doesn't match child component's .elems[i]"
            }
        }

        var rendered_nodes = document.querySelectorAll("section");
        for( var i = 0; i < rendered_nodes.length; i++ ){
            // if( rendered_nodes[i].render_count !== 0 ) throw("Section unnecessarily rendered.");
        }

        var divs = document.querySelectorAll("div");

        if( divs[0].render_count !== 0 ) throw("Parent's root unnecessarily rendered.");

        if( parentApp.$.span.elems[0] !== document.querySelectorAll("span")[0] ) throw("$.span doesn't match")
        if( parentApp.$.child_container.elems[0] !== divs[1] ) throw("$.child_container doesn't match")

        for( var i = 0; i < list_items.length; i++ ){
            if( list_items[i] !== parentApp.state.child_apps[i].$.p ){
                // console.log(list_items[i]);
                throw "child_apps[i].$.p doesn't match"
            }    
        }

    },

    reset: function(){
        _pfreak.clearBody();

        delete window.pfreak_render_count;
        delete window.pfreak_update_count;
        delete window.parentApp;
    }
});