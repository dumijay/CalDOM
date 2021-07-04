_pfreak.tasks.push({

    short_name: "replace",
    display_order: 79,
    category: "dom",
    description: "",
    assert_delay: 0,

    setTaskData: function(config){
        return config;
    },
    
    candidateSetup: function(config){
        _pfreak.clearBody();
        
        var div = document.createElement("div");

        div.innerHTML = 
            '<div class="container">'
                + '<section>'
                    + '<h1>Main Heading</h1>'
                    + '<h2>Sub Heading</h2>'
                    + '<p style="font-size:1.2em">Para one content.</p>'
                    + '<img width="400px" src="images/image.jpg" alt="Alternative Text" />'
                    + '<p style="font-size:1.2em">Para two content.</p>'
                    + '<input type="checkbox />'
                    + '<select>'
                        + '<option value="1">Option 1</option>'
                        + '<option value="2">Option 2</option>'
                    + '</select>'
                    + '<img />'
                + '</section>'
            + '</div>';

        document.body.appendChild( div );

        config.caldomInstance = _( ".container" );

        document.querySelectorAll("h1")[0].customProperty = "this should not change";
        _("h1").data("test-data", "TBS");

        document.querySelectorAll("p")[0].customProperty = "this should change";

        window.pfreak_event_targets = [];

        config.eventCallback = function(e){
            window.pfreak_event_targets.push(e.target);
        }

        return config;
    },
    
    candidates: {
        "caldom": function(config){
            return config.caldomInstance.replace(function(){
                return _("+div")
                    .addClass("container narrow")
                    .append(
                        _("+section")
                            .addClass("middle")
                            .append(
                                _("+h1", ["Main Heading"])
                                    .data("test-data", "Changed"),

                                _("+h2", ["Sub Heading"])
                                    .attr("caldom-v", "52")
                                    .prop("customProperty", "This should have been added"),

                                _("+p")
                                    .css("font-size", "2em")
                                    .text("Para one content ammended."),

                                _("+img")
                                    .attr({
                                        width: "400px",
                                        height: "500px",
                                        src: "images/real.jpg"
                                    }),

                                _("+button")
                                    .text("Click Me")
                                    .on("click", config.eventCallback),

                                _("+input")
                                    .attr("type", "checkbox")
                                    .prop("checked", true)
                                    .prop("custom_value", "This should not have been added."),
                                
                                _("+select")
                                    .append(
                                        _("+option")
                                            .attr("value", "1")
                                            .text("Option 1"),
    
                                        _("+option")
                                            .attr("value", "2")
                                            .text("Option 2")
                                    )
                            )
                    )
            });
        }
    },

    assert: function(config, test_return){
        if( !(test_return instanceof _.Component) ) throw "Returned is not an instance of CalDOM";
        
        var items = document.querySelectorAll(".container");

        if( items[0].tagName != "DIV" ) throw false;
        if( items[0].className != "container narrow" ) throw false;
        if( items[0].children.length != 1 ) throw false;
        if( items[0].firstChild.children.length != 7 ) throw false;
        if( items[0].firstChild.children[0].tagName != "H1" ) throw false;
        if( items[0].firstChild.children[0].customProperty != "this should not change" ) throw false;
        if( items[0].firstChild.children[0].textContent != "Main Heading" ) throw false;
        if( _("h1").data("test-data") != "Changed" ) throw false;
        if( items[0].firstChild.children[1].tagName != "H2" ) throw false;
        if( items[0].firstChild.children[1].customProperty != "This should have been added" ) throw false;
        if( items[0].firstChild.children[2].tagName != "P" ) throw false;
        if( items[0].firstChild.children[2].textContent != "Para one content ammended." ) throw false;
        if( items[0].firstChild.children[2].style.fontSize != "2em" ) throw false;
        if( items[0].firstChild.children[3].tagName != "IMG" ) throw false;
        if( items[0].firstChild.children[3].getAttribute("width") != "400px" ) throw false;
        if( items[0].firstChild.children[3].getAttribute("height") != "500px" ) throw false;
        if( items[0].firstChild.children[3].getAttribute("src") != "images/real.jpg" ) throw false;
        if( items[0].firstChild.children[3].getAttribute("alt") != null ) throw false;
        if( items[0].firstChild.children[4].tagName != "BUTTON" ) throw false;
        if( items[0].firstChild.children[4].textContent != "Click Me" ) throw false;
        if( items[0].firstChild.children[4].customProperty == "this should change" ) throw false;

        items[0].firstChild.children[4].click();

        if( window.pfreak_event_targets[0] !== items[0].firstChild.children[4] ) throw false;

        if( items[0].firstChild.children[5].tagName != "INPUT" ) throw false;
        if( items[0].firstChild.children[5].checked !== true ) throw false;
        if( items[0].firstChild.children[5].custom_value == "This should not have been added." ) throw false;
        if( items[0].firstChild.children[6].tagName != "SELECT" ) throw false;
    },

        reset: function(){
        _pfreak.clearBody();
    }
})