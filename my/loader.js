var jsFiles = [	'jquery', 'lodash', 'chroma', 'd3', 'sigma'];
var cssPreprocessors = ['sass', 'less',	'stylus'];

var jsPreprocessors = ['coffeescript', 'livescript', 'typescript', 'typescript.compile'];
var cssFiles = ['reset', 'normal', 'bootstrap'];

log(load.js(jsPreprocessors, "js"));
log(load.js(jsFiles, "js", function() {

}));

log(load.js(cssPreprocessors, "js"));
log(load.css(cssFiles, "css"));
