
$("coffeescript").each(function() {
  return;
  var $this = $(this);
  var script = $("<script><\/script>", {type: "text\/javascript"}).text(CoffeeScript.compile($this.text()));
  $this.replaceWith(script);
});



var LiveScript = require("LiveScript");
$("livescript").each(function() {
  return;
  var $this = $(this);
  var script = $("<script><\/script>", {type: "text\/livescript"}).text($this.text());
  $this.replaceWith(script);
});
LiveScript.compile();
LiveScript.go();

$("sass").each(function() {
  var input = $(this)[0];
  var style = document.createElement("style");
  style.innerHTML = "/* from sass*/\n\n"+Sass.compile(input.innerHTML);
  input.parentNode.replaceChild(style, input);
  log("sass works");
});


$("stylus").each(function() {
  var input = $(this)[0];
  var rendered = stylus.render(input.innerHTML);
  var style = document.createElement("style");
  style.innerHTML = "/* from stylus*/\n\n"+rendered;
  input.parentNode.replaceChild(style, input);
  log("stylus works");
})

// try and make this non-async
$("less").each(function() {
  var input = $(this)[0];
  less.render(input.innerHTML).then(function(output) {
    var style = document.createElement("style");
    style.innerHTML = "/* from less*/\n\n"+output.css;
    input.parentNode.replaceChild(style, input);
    log("less works");
  });
});

$("markdown").each(function() {
  var text = $(this).text();
  var div = document.createElement("div");
  div.innerHTML = markdown.toHTML(text);
  div.setAttribute("from", "markdown");

  $(this)[0].parentNode.replaceChild(div, $(this)[0]);
  log("markdown works");

});

$("haml").each(function() {
  var text = Haml.render($(this).text());
  var div = document.createElement("div");
  div.innerHTML = text;
  div.class = "hide";
  div.setAttribute("from", "haml");
  $(this)[0].parentNode.replaceChild(div, $(this)[0]);
  log("haml works");
});

$("yaml").each(function() {
  var text = JSON.stringify(yaml.load($(this).text()));
  var div = document.createElement("div");
  div.innerHTML = text;
  div.setAttribute("from", "yaml");

  $(this)[0].parentNode.replaceChild(div, $(this)[0]);
  log("yaml works");
});

$("jade").each(function() {
  var text = jade.render($(this).text());
  var div = document.createElement("div");
  div.innerHTML = text;
  div.setAttribute("from", "jade");

  $(this)[0].parentNode.replaceChild(div, $(this)[0]);
  log("jade works");
});





