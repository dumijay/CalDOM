_pfreak.tasks.push({

    short_name: "deleting_50_of_1000_rows",

    category: "mixed_reactive",
    description: 'Deleting 50 rows of 1000 rows with new data, each containing 1 text cell with a click event and a background color.',
    assert_delay: 1000,

    setTaskData: function(config){

        config.values = [];
        config.new_values = [];

        config.row_count = 1000;
        
        function getRandomValue(i, letter){
            return {
                key: i,
                text: i + " : " + letter,
                r: Math.round(Math.random() * 255),
                g: Math.round(Math.random() * 255),
                b: Math.round(Math.random() * 255)
            }
        }

        for( var i = 0; i < config.row_count; i++ ){
            config.values.push( getRandomValue(i, "A") );
        }

        config.new_values = [].concat(config.values);

        for( var i = 0; i < config.row_count; i += 20 ){
            config.new_values.splice(i--, 1);
        }

        return config;
    },
    
    candidateSetup: function(config){
        _pfreak.clearBody();

        config.clickEventListener = function(){
            window.pfreak_event = "clicked";
        }

        var pre_executions = {

            "vanilla_js": function(config){
                var container = document.createElement("div");
                document.body.appendChild( container );
                
                var table = document.createElement("table");
                var tbody = document.createElement("tbody");
                table.appendChild(tbody);
                
                for( var i = 0; i < config.values.length; i++ ){
                    var value = config.values[i];

                    var tr = document.createElement("tr");

                    var td = document.createElement("td");
                    td.textContent = value.text;
                    
                    
                    td.style.backgroundColor = "rgb(" + value.r + ", " + value.g + ", " + value.b + ")";
                    td.addEventListener("click", config.clickEventListener);

                    tr.appendChild(td);
                    tbody.appendChild(tr);
                }

                container.appendChild( table );

                return container;
            },

            "caldom": function(config){
                var container = document.createElement("div");
                document.body.appendChild( container );

                var _table = _("+table").append(
                    _("+tbody")
                        .append(
                            config.values.map(
                                (value) => _("+tr")
                                    .append(
                                        _("+td", value.text)
                                            .css("backgroundColor", "rgb(" + value.r + ", " + value.g + ", " + value.b + ")")
                                            .on("click", config.clickEventListener )
                                    )
                            )
                        )
                );

                return _(container).append( _table );
            },

            "umbrellajs": function(config){
                var container = document.createElement("div");
                document.body.appendChild( container );

                var _tbody; 
                var _table = u("<table>")
                    .append( //Couldn't create tbody using u("<tbody>");
                        config.values.map(
                            (value) => u("<tr>")
                                .append(
                                    u("<td>")
                                        .text( value.text )
                                        .on("click", config.clickEventListener )
                                        //UmbrellaJS Don't have a css()
                                ).nodes[0] //Not accepting UmbrellaJS instances inside an array
                        )
                    );

                return u(container).append( _table );
            },

            "zepto": function(config){
                var container = document.createElement("div");
                document.body.appendChild( container );
                
                var _table = $("<table></table>")
                    .append(
                        $("<tbody></tbody")
                            .append(
                                config.values.map(
                                    (value) => $("<tr></tr>")
                                        .append(
                                            $("<td></td>")
                                                .text( value.text )
                                                .css("backgroundColor", "rgb(" + value.r + ", " + value.g + ", " + value.b + ")")
                                                .on("click", config.clickEventListener )
                                        )
                                )
                            )
                    );

                return $(container).append( _table );
            },

            "jquery": function(config){
                var container = document.createElement("div");
                document.body.appendChild( container );
                
                var _table = jQuery("<table></table>")
                    .append(
                        jQuery("<tbody></tbody")
                            .append(
                                config.values.map(
                                    (value) => jQuery("<tr></tr>")
                                        .append(
                                            jQuery("<td></td>")
                                                .text( value.text )
                                                .css("backgroundColor", "rgb(" + value.r + ", " + value.g + ", " + value.b + ")")
                                                .on("click", config.clickEventListener )
                                        )
                                )
                            )
                    );

                return jQuery(container).append( _table );
            },

            "caldom.render": function(config){
                var container = document.createElement("div");
                document.body.appendChild( container );

                class App extends _.Component{
                    
                    constructor(values){
                        super();

                        this.react({
                            values: values
                        });
                    }

                    render(){
                        // console.log("CalDom: render");

                        var _table = _("+table").append(
                            this.$.tbody = _("+tbody",
                                this.state.values.map(
                                    (value) => _("+tr")
                                        .append(
                                            _("+td", value.text)
                                                .css("backgroundColor", "rgb(" + value.r + ", " + value.g + ", " + value.b + ")")
                                                .on("click", config.clickEventListener )
                                        )
                                )
                            ).elem
                        )
                        
                        return _table;
                    }

                    // didUpdate(){
                    //     console.log("CalDom: didUpdate");
                    // }
                }

                var new_app = new App( config.values );
                _(container).append( new_app );

                return new_app;
            },

            "caldom.update": function(config){
                var container = document.createElement("div");
                document.body.appendChild( container );

                class App extends _.Component{
                    
                    constructor(values){
                        super();

                        this.react({
                            values: values
                        });
                    }

                    render(){
                        return _("+table", 
                            this.$.tbody = _("+tbody", 
                                this.state.values.map(
                                    (value) => _("+tr", 
                                        _("+td", value.text)
                                            .css("backgroundColor", "rgb(" + value.r + ", " + value.g + ", " + value.b + ")")
                                            .on("click", config.clickEventListener )
                                    )
                                )
                            ).elems[0]
                        );
                    }

                    update(state){
                        if( this.$.tbody.children.length != this.state.values.length ){
                            //Need to add new TRs, proceed to render()
                            return true;
                        }
                
                        var trs = Array.prototype.slice.call(this.$.tbody.children);
                
                        for( var i = 0; i < trs.length; i++ ){
                            var tr = trs[i];
                            var td = tr.firstChild;
                            var value = this.state.values[i];
                
                            if( value ){
                                //Update existing TRs with new values
                                td.textContent = value.text;
                                td.style.backgroundColor = "rgb(" + value.r + ", " + value.g + ", " + value.b + ")";
                            }
                        }
                    }

                    // didUpdate(){
                    //     console.log("CalDom: didUpdate");
                    // }
                }

                var new_app = new App( config.values );
                _(container).append( new_app );

                return new_app;
            },

            "react_keyed": function(config){
                var container = document.createElement("div");
                document.body.appendChild( container );

                class App extends React.Component{
                    constructor(props){
                        super(props)

                        this.state = {
                            values: props.values
                        }
                    }

                    render(){
                        // console.log("React: render");
                        return React.createElement(
                            "table",
                            null,
                            React.createElement(
                                "tbody",
                                null,
                                this.state.values.map(
                                    (value) => React.createElement(
                                        "tr",
                                        { key: value.key },
                                        React.createElement(
                                            "td", 
                                            {
                                                style:{
                                                    backgroundColor: "rgb(" + value.r + ", " + value.g + ", " + value.b + ")"
                                                },
        
                                                onClick: config.clickEventListener
                                            },
                                            value.text
                                        )
                                    )
                                )
                            )
                        );
                    }

                    // componentDidUpdate(){
                    //     console.log("React: didUpdate");
                    // }
                }

                return ReactDOM.render( React.createElement(App, { values: config.values }), container );
            },

            "react_non_keyed": function(config){
                var container = document.createElement("div");
                document.body.appendChild( container );

                class App extends React.Component{
                    constructor(props){
                        super(props)

                        this.state = {
                            values: props.values
                        }
                    }

                    render(){
                        // console.log("React: render");
                        return React.createElement(
                            "table",
                            null,
                            React.createElement(
                                "tbody",
                                null,
                                this.state.values.map(
                                    (value) => React.createElement(
                                        "tr",
                                        null,
                                        React.createElement(
                                            "td", 
                                            {
                                                style:{
                                                    backgroundColor: "rgb(" + value.r + ", " + value.g + ", " + value.b + ")"
                                                },
        
                                                onClick: config.clickEventListener
                                            },
                                            value.text
                                        )
                                    )
                                )
                            )
                        );
                    }

                    // componentDidUpdate(){
                    //     console.log("React: didUpdate");
                    // }
                }

                return ReactDOM.render( React.createElement(App, { values: config.values }), container );
            },

            "vue_keyed": function(config){
                var app_container = document.createElement("div");

                document.body.appendChild(
                    app_container
                );
                
                var App = Vue.createApp({
                    
                    data: function(){
                        return{
                            values: config.values,
                            clickEventListener: config.clickEventListener
                        }
                    },
        
                    template: '' 
                        + '<table>'
                            + '<tbody>'
                                + '<tr v-for="value in values" :key="value.key">'
                                    + '<td :style="{ backgroundColor: \'rgb(\' + value.r + \', \' + value.g + \', \' + value.b + \')\'}" @click="clickEventListener">'
                                        + '{{ value.text }}'
                                    + '</td>'
                                + '</tr>'
                            + '</tbody>'
                        + '</table>'
                });
        
                return App.mount( app_container );
            },

            "vue_non_keyed": function(config){
                var app_container = document.createElement("div");

                document.body.appendChild(
                    app_container
                );
                
                var App = Vue.createApp({
                    
                    data: function(){
                        return{
                            values: config.values,
                            clickEventListener: config.clickEventListener
                        }
                    },
        
                    template: '' 
                        + '<table>'
                            + '<tbody>'
                                + '<tr v-for="value in values">'
                                    + '<td :style="{ backgroundColor: \'rgb(\' + value.r + \', \' + value.g + \', \' + value.b + \')\'}" @click="clickEventListener">'
                                        + '{{ value.text }}'
                                    + '</td>'
                                + '</tr>'
                            + '</tbody>'
                        + '</table>'
                });
        
                return App.mount( app_container );
            }
        }

        config.preExecutedInstance = pre_executions[config.candidate](config);

        return config;
    },
    
    candidates: {
        "vanilla_js": function(config){
            var tds = document.querySelectorAll("td");
            
            for( var i = 0; i < tds.length; i++ ){
                var td = tds[i];
                var value = config.new_values[i];

                if( value ){
                    td.textContent = value.text;
                    td.style.backgroundColor = "rgb(" + value.r + ", " + value.g + ", " + value.b + ")";
                }
                else{
                    td.parentNode.parentNode.removeChild(td.parentNode);
                }
            }
        },

        "caldom": function(config){
            
            _("td").each(function(elem, i){
                var value = config.new_values[i];
                
                if( value ){
                    _(elem)
                        .text( value.text )
                        .css( "backgroundColor", "rgb(" + value.r + ", " + value.g + ", " + value.b + ")");
                }
                else{
                    _(elem).parent().remove();
                }
            });
        },

        "umbrellajs": function(config){
            u("td").each(function(elem, i){
                var value = config.new_values[i];

                if( value ){
                    u(elem)
                        .text( value.text )
                        .nodes[0].style.backgroundColor = "rgb(" + value.r + ", " + value.g + ", " + value.b + ")"
                }
                else{
                    u(elem).parent().remove();
                }
                
            });
        },

        "zepto": function(config){
            $("td").each(function(i){
                var value = config.new_values[i];

                if( value ){
                    $(this)
                        .text( value.text )
                        .css( "backgroundColor", "rgb(" + value.r + ", " + value.g + ", " + value.b + ")" );
                }
                else{
                    $(this).parent().remove();
                }
                
            });
        },

        "jquery": function(config){
            jQuery("td").each(function(i){
                var value = config.new_values[i];

                if( value ){
                    jQuery(this)
                        .text( value.text )
                        .css( "backgroundColor", "rgb(" + value.r + ", " + value.g + ", " + value.b + ")" )
                }
                else{
                    jQuery(this).parent().remove();
                }
            });
        },

        "caldom.render": function(config){
            // console.log("CalDom: Before new state");
            // config.preExecutedInstance.state.values = config.new_values;
            
            config.preExecutedInstance.state.values = config.new_values;
            // config.preExecutedInstance.react({
            //     values: config.new_values
            // });
            // console.log("CalDom: After new state");
        },

        "caldom.update": function(config){
            // console.log("CalDom: Before new state");
            // config.preExecutedInstance.state.values = config.new_values;
            
            config.preExecutedInstance.state.values = config.new_values;
            // console.log("CalDom: After new state");
        },

        "vue_keyed": function(config){
            config.preExecutedInstance.values = config.new_values;
        },

        "vue_non_keyed": function(config){
            config.preExecutedInstance.values = config.new_values;
        },

        "react_keyed": function(config){
            // console.log("React: Before new state");
            config.preExecutedInstance.setState({
                values: config.new_values
            });
            // console.log("React: After new state");
        },

        "react_non_keyed": function(config){
            // console.log("React: Before new state");
            config.preExecutedInstance.setState({
                values: config.new_values
            });
            // console.log("React: After new state");
        }
    },

    assert: function(config, test_return){
        var tds = document.querySelectorAll("td");

        tds[10].click();

        for( var i = 0; i < config.new_values.length; i++ ){
            if( tds[i].textContent != config.new_values[i].text ) throw tds[i].textContent;
        }

        if( tds.length != config.row_count - 50 ) throw false;
        
        if( window.pfreak_event != "clicked" ) throw("Click event didn't work");
    },

    reset: function(){
        _pfreak.clearBody();
        _input = null;
        _button = null;
        delete window.pfreak_event;
    }
})