(function(){

    function main(){
        console.log("Testing CalDom 0.4.12.");
        
        document.body.appendChild(
            _("+div")
                .attr({
                    "id": "test-div"
                })
                .append(
                    _("+input")
                        .attr({
                            "type": "text",
                            "value": "Test Value One"
                        })
                        .addClass("class-test-one class-test-two")
                        .css({
                            "background": "black",
                            "color": "#FFF"
                        })
                        .css("border", "solid 5px #0F0")
                        .on("change", function(){
                            _("#test-div")
                                .append(
                                    _("+p").html("Input one changed")
                                );
                        }),

                    _("+input")
                        .attr({
                            "type": "number",
                            "value": "2"
                        })
                        .addClass("class-test-one class-test-two class-test-three")
                        .removeClass("class-test-one class-test-two")
                        .css({
                            "background": "yellow",
                            "color": "#555"
                        })
                        .css("border", "solid 5px #00F")
                        .on("change", function(){
                            _("#test-div")
                                .append(
                                    _("+p").html("Input two changed")
                                );
                        }),
                    
                    _("+p").html("This is a paragrapgh")
                )
                .elems[0]
        );

        _("#test-div")
            .find(".class-test-three")
            .val(10)
            .elems[0].dispatchEvent( new Event("change") );

        _("#test-div")
            .prepend(
                _("+p").html(
                    _("input:last-of-type").siblings("input").val().join(", ")
                )
            )
    }

    function log(message){
        console.log(message);
    }

    function logTest(label, result){
        var color = result ? "green" : "red";

        console.log(label + ": %c" + result, "color:" + color);
        
    }

    main();
    
})();