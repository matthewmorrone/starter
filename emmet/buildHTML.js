// my little html string builder
buildHTML = function(tag, html, attrs) {
  // you can skip html param
  if (typeof(html) != 'string') {
    attrs = html;
    html = null;
  }
  var h = '<' + tag;
  for (attr in attrs) {
    if(attrs[attr] === false) continue;
    h += ' ' + attr + '="' + attrs[attr] + '"';
  }
  return h += html ? ">" + html + "</" + tag + ">" : "/>";
}

buildHTML("a", "Marc Grabanski", {
  id: "mylink",
  href: "http://marcgrabanski.com"
});
// outputs: <a id="mylink" href="http://marcgrabanski.com">Marc Grabanski</a>

// or leave out the html
buildHTML("input", {
  id: "myinput",
  type: "text",
  value: "myvalue"
});
// outputs: <input id="myinput" type="text" value="myvalue" />