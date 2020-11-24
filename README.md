# CalDom
CalDom is a chainable DOM traverser and a modifier. A lightweight, closer-vanilla-DOM-syntax alternative to jQuery.  
It's simply a chainable wrapper around document.querySelectorAll().

## Good God! Another jQuery-like framework?
I know :)

About a few years ago, I was creating animated web stuff (banners, games, etc.). The kind of animations more into programming than just moving parts.

* I needed a lightweight jQuery replacement. Specially to fit Google Display Network(GDN)'s 150kb file size limit. jQuery was about 70kb-ish back then.
* Plus, I needed to stay up to date with DOM/javascript vanilla syntax. (Because jQuery moves you away from it).

Hence, CalDOM was born. 8KB uncompressed, with most of the functionality I need without an overkill.
I created this years ago and kept improving it as my primary DOM handler. Just decided to put it out thinking someone else might find it useful.

If you have similar requirements & need something lighter closer to vanilla JS/DOM/HTML/CSS, this could be useful. Otherwise, I think you're better off with jQuery-alike.  

Come to think of it, my very unpopular decision to stay closer to vanilla javascript against tempting fancy-frameworks paid-back big time later. Drastically reduced the learning-curve for other languages and environments like NodeJS.

## Example: A Simple TODO list

I'm using the alias _ (underscore) for easy reference. This can be set to $ or any variable-name.

![To Do App Screenshot](./_etc/todo_app_screenshot.png)

```html
<style>
    .error{
        box-shadow: 0 0 5px red;
    }

    .todo-item{
        cursor: pointer;
        font-size: 1.5em;
    }
</style>

<script src="js/cal_dom_0.5.0.js"></script>
<script>
    _("body")
        .append(
            _input = _("+input")
                .attr({
                    type: "text",
                    placeholder: "Type item here",
                }),
            
            _button = _("+button").text("Add")
                .css({
                    cursor: "pointer",
                    marginLeft: "0.5em",
                })
                .on("click", () => {
                    var value = _input.elems[0].value;

                    if( !value.length ) return _input.addClass("error");
                    else _input.removeClass("error");

                    _("#todo-list")
                        .append(
                            _("+li").attr("class", "todo-item").text( value )
                                .on("click", (e) => {
                                    _(e.target).css("text-decoration", "line-through")
                                })
                        );
                }),
            
            _("+ol").attr("id", "todo-list"),
            
            _("+button").text("Clear")
                .on("click", (e) => {
                    _(".todo-item").remove();
                })
        );
</script>
```
