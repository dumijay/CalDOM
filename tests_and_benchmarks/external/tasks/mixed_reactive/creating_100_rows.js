_pfreak.tasks.push({

    short_name: "creating_100_rows",

    category: "mixed_reactive",
    description: 'Creating 100 rows, each containing 1 text cell with a click event and a background color.',
    assert_delay: 1000,

    setTaskData: function(config){
        
    },
    
    candidateSetup: function(config){
        _pfreak.clearBody();

        config.clickEventListener = function(){
            window.pfreak_event = "clicked";
        }

        config.values = [];

        config.row_count = 100;

        for( var i = 0; i < config.row_count; i++ ){
            config.values.push({
                key: i,
                text: i + " : A",
                r: Math.round(Math.random() * 255),
                g: Math.round(Math.random() * 255),
                b: Math.round(Math.random() * 255)
            });
        }

        return config;
    },
    
    candidates: {
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
        },

        "caldom": function(config){
            var container = document.createElement("div");
            document.body.appendChild( container );

            _(container, 
                _("+table", 
                    _("+tbody",
                        config.values.map(
                            (value) => _("+tr")
                                .append(
                                    _("+td", value.text)
                                        .css("backgroundColor", "rgb(" + value.r + ", " + value.g + ", " + value.b + ")")
                                        .on("click", config.clickEventListener )
                                )
                        )
                    )
                )
            );
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

            u(container).append( _table );
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

            $(container).append( _table );
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

            jQuery(container).append( _table );
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
                    return _("+table", 
                        _("+tbody", 
                            this.state.values.map(
                                (value) => _("+tr", 
                                    _("+td", value.text)
                                        .css("backgroundColor", "rgb(" + value.r + ", " + value.g + ", " + value.b + ")")
                                        .on("click", config.clickEventListener )
                                )
                            )
                        )
                    );
                }
            }

            _(container).append( new App( config.values ) );
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
            }

            _(container).append( new App( config.values ) );
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
    
            App.mount( app_container );
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
    
            App.mount( app_container );
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
            }

            ReactDOM.render( React.createElement(App, { values: config.values }), container );
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
            }

            ReactDOM.render( React.createElement(App, { values: config.values }), container );
        }
    },

    assert: function(config, test_return){
        var tds = document.querySelectorAll("td");

        tds[10].click();

        for( var i = 0; i < config.values.length; i++ ){
            if( tds[i].textContent != config.values[i].key + " : A") throw tds[i].textContent;
        }

        if( tds.length != config.row_count ) throw false;
        
        if( window.pfreak_event != "clicked" ) throw("Click event didn't work");

    },

    reset: function(){
        _pfreak.clearBody();
        _input = null;
        _button = null;
        delete window.pfreak_event;
    }
})