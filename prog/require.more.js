require([   'jquery',   'jquery.helpers',   'underscore',   'coffeescript', 'backbone',
            'chroma',   'd3',               'sigma',        'sass',
            'less',     'stylus'],
function(   $,          helpers,            _,              coffeescript,   backbone,
            chroma,     d3,                 sigma,          sass,
            less,       stylus)
{


});

require.config({
    baseUrl: "js"
});

// require(['css!reset', 'css!normal', 'css!bootstrap'], function() {});


require.config({
    paths: {
        underscore : "libs/underscore.min"
    },
    shim : {
        underscore : {
            exports : "_"
        }
    }
});

require.config({
    paths: {
        jquery     : "libs/jquery.min",
        backbone   : "libs/backbone.min",
        underscore : "libs/underscore.min",
    },
    shim : {
        underscore : {
            exports : "_"
        },
        backbone : {
            deps    : [ "jquery", "underscore" ],
            exports : "Backbone"
        }
    }
});



// var deps = [
// 	/*'require.css', */
// 	'jquery',
// 	'jquery.helpers',
// 	'underscore',
// 	'coffeescript',
// 	/*'TypeScript', 	'typescriptcompile', 	'prefix', */
// 	'backbone',
// 	'modern'
// 	];
// // var deps = {
// // 	'jquery': "$",
// // 	'jquery.helpers':'helpers',
// // 	'underscore':"_",
// // 	'coffeescript':"coffeescript",
// // 	'backbone':"backbone",
// // 	'modern':"modern"
// // };
// require(deps, function() {
// 	var args = {};
// 	deps.every(function(o, i, a) {
// 		log(o, i, a, deps[i]);
// 		return true;
// 	});
// });


require.config({
	baseUrl: "js",
	paths : {
		css: 'require/css',
		font: 'require/font',
		image: 'require/image',
		propertyParser : 'require/propertyParser',
		jquery: [
			'http://code.jquery.com/jquery-1.11.0.min',
			'jquery'
		],
		reset: "../css/reset",
		normal: "../css/normal",
		bootstrap: "../css/bootstrap"
	},
	scriptType: "text/javascript"
});

// require(["image!img/psi.ico"]);
// require(["font!fonts/font-awesome"]);
