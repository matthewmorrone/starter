

var Point
Point = (function()
{
	Point.name = 'Point'
	function Point(x, y, color, velocity, radius, mass)
	{
		this.x = x || 0
		this.y = y || 0
		this.color = color || "black"
		this.mass = mass
		this.acceleration = {x: 0, y: -10}
		this.velocity = velocity
		this.radius = radius

		if (empty(color))	 {color = "black"}
		if (empty(mass))	{mass = 1.0}



		this.draw = function()
		{
			c.beginPath()
			c.arc(this.x, this.y, 5, 0, 2*Math.PI)
			c.fill()
			c.fillStyle = color
			c.closePath()
			return this
		}
		this.recolor = function(color)
		{
			this.color = color
			c.beginPath()
			c.arc(this.x, this.y, 5, 0, 2*Math.PI)
			c.fillStyle = color
			c.fill()
			c.closePath()
			return this
		}
		this.equals = function(that)
		{
			return this.x == that.x && this.y == that.y
		}
		this.proximity = function(x, y)
		{
			var dx = this.x - (x - o.left)
			var dy = this.y - (y - o.top)
			return Math.sqrt(dx * dx + dy * dy)
		}
		this.distance = function(that)
		{
			var dx = this.x - that.x
			var dy = this.y - that.y
			return Math.sqrt(dx * dx + dy * dy)
		}
		this.getX = function() {return x}
		this.getY = function() {return y}
		this.setX = function(x) {this.x = x}
		this.setY = function(y) {this.y = y}
		this.clone = function()
		{
			return new Point(this.x, this.y)
		}

		this.add = function(v)
		{
			return new Point(this.x + v.x, this.y + v.y)
		}
		this.clone = function()
		{
			return new Point(this.x, this.y)
		}
		this.degreesTo = function(v)
		{
			var dx = this.x - v.x;
			var dy = this.y - v.y;
			var angle = Math.atan2(dy, dx); //	 radians
			return angle * (180 / Math.PI); //	 degrees
		}
		this.distance = function(v)
		{
			var x = this.x - v.x;
			var y = this.y - v.y;
			return Math.sqrt(x * x + y * y)
		}
		this.equals = function(toCompare)
		{
			return this.x == toCompare.x && this.y == toCompare.y
		}
		this.interpolate = function(v, f)
		{
			return new Point((this.x + v.x) * f, (this.y + v.y) * f)
		}
		this.length = function()
		{
			return Math.sqrt(this.x * this.x + this.y * this.y)
		}
		this.normalize = function(thickness)
		{
			var l = this.length();
			this.x = this.x / l * thickness;
			this.y = this.y / l * thickness;
		}
		this.orbit = function(origin, arcWidth, arcHeight, degrees)
		{
			var radians = degrees * (Math.PI / 180);
			this.x = origin.x + arcWidth * Math.cos(radians);
			this.y = origin.y + arcHeight * Math.sin(radians);
		}
		this.offset = function(dx, dy)
		{
			this.x += dx;
			this.y += dy;
		}
		this.subtract = function(v)
		{
			return new Point(this.x - v.x, this.y - v.y)
		}
		this.toString = function()
		{
			return "(x=" + this.x + ", y=" + this.y + ")"
		}
	}

	Point.prototype.applyForce = function(x, y)
	{
		this.velocity.x += x
		return this.velocity.y += y
	}

	Point.prototype.tick = function()
	{
		if (this.y + this.velocity.y * .1 < 0 && this.velocity.y <= 0.1)
		{
			this.velocity.y = -this.velocity.y * .7
		}
		if ((this.x + this.velocity.x * .1 < 0) || (this.x + this.velocity.x * .1 > 512))
		{
			this.velocity.x = -this.velocity.x * .7
		}
		this.y += this.velocity.y * .1
		this.x += this.velocity.x * .1
		this.velocity.x += this.acceleration.x
		return this.velocity.y += this.acceleration.y
	}

	Point.prototype.display = function(ctx)
	{
		ctx.save()
		ctx.beginPath()
		ctx.fillStyle = "rgba(" + this.color.red + ", " + this.color.green + ", " + this.color.blue + ", .8)"
		ctx.arc(this.x, 512 - this.y, this.radius, 0, 20, true)
		ctx.fill()
		return ctx.restore()
	}


	Point.interpolate = function(pt1, pt2, f)
	{
		return new Point((pt1.x + pt2.x) * f, (pt1.y + pt2.y) * f)
	}
	Point.polar = function(len, angle)
	{
		return new Point(len * Math.sin(angle), len * Math.cos(angle))
	}
	Point.distance = function(pt1, pt2)
	{
		var x = pt1.x - pt2.x
		var y = pt1.y - pt2.y
		return Math.sqrt(x * x + y * y)
	}


	return Point

})
()







var Line

Line = (function()
{
	Line.name = 'Line'
	function Line(p1, p2, color)
	{
		this.first = p1
		this.second = p2
	}
	return Line
})
()


function Line(a, b)
{
	this.a = a
	this.b = b

	// if (!a || !b) {throw TypeError("Must provide two points.")}

	this.getA = function()	{return this.a}
	this.getB = function()	{return this.b}
	this.setA = function(a) {this.a = a}
	this.setB = function(b) {this.b = b}
	this.draw = function()
	{
		c.beginPath()
		c.moveTo(this.a.x, this.a.y)
		c.lineTo(this.b.x, this.b.y)
		c.stroke()
		c.closePath()
		return this
	}
	this.swap = function()
	{
		var c = this.a
		this.a = this.b
		this.b = c
	}
	this.slope = function()
	{
		return (a.y - b.y) / (a.x - b.x)
	}
	this.intercept = function()
	{
		return this.a.y - this.slope() * this.a.x
	}
	this.distance = function()
	{
		var dx = this.a.x - this.b.x
		var dy = this.a.y - this.b.y
		return Math.sqrt(dx * dx + dy * dy)
	}
	this.equals = function(that)
	{
		return this.a.equals(that.a) && this.b.equals(that.b)
	}

	function halfway(a, b)
	{
		var dx = (a[0] + b[0]) / 2
		var dy = (a[1] + b[1]) / 2
		return {dx: dx, dy: dy}
	}

}

function Graph()
{
	this.vertices = []
	this.edges = []

	this.newV = function(x, y)	{var v = new Vertex(x, y); this.addV(v); return this.vertices[this.vertices.length-1]}
	this.addV = function(v)	 {this.vertices.push(v); v.draw()}
	this.newE = function(a, b)	{var e = new Edge(a, b); this.addE(e); return this.edges[this.edges.length-1]}
	this.addE = function(e)	 {this.edges.push(e); e.draw()}
	this.getV = function(i)	 {return this.vertices[i]}
	this.getE = function(i)	 {return this.edges[i]}

	this.collide = function(x, y)
	{
		for(var v in this.vertices)
		{
			if (this.vertices[v].proximity(x, y) < 5)
			{
				this.vertices[v].recolor("blue")
				return this.vertices[v]
			}
			else
			{
				this.vertices[v].recolor("black")
			}
		}
	}

	this.draw = function()
	{
		for(var v in this.vertices)
		{
			this.vertices[v].draw()
		}
		for(var e in this.edges)
		{
			this.edges[e].draw()
		}
	}
	this.crossCount = function()
	{
		var total = 0
		for(var i in range(0, this.edges.length-1))
		{
			for(var j in range(parseInt(i)+1, this.edges.length-1))
			{
				if (i == j) {continue}
				x1 = this.edges[i].a.x; y1 = this.edges[i].a.y
				x2 = this.edges[i].b.x; y2 = this.edges[i].b.y
				x3 = this.edges[j].a.x; y3 = this.edges[j].a.y
				x4 = this.edges[j].b.x; y4 = this.edges[j].b.y
				// alert(i+" "+j+" "+x1+" "+y1+" "+x2+" "+y2+" "+x3+" "+y3+" "+x4+" "+y4)
				var den = (y4 - y3) * (x2 - x1) - (x4 * x3) * (y2 - y1)

				if (den == 0) {continue}

				var ua = ((x4 - x3) * (y1 - y3) - (y4 * y3) * (x1 - x3))
				var ub = ((x2 - x1) * (y1 - y3) - (y2 * y1) * (x1 - x3))

				if (ua > 0 && ua < 1 && ub > 0 && ub < 1)
				{
					total++
				}
			}
		}
		return total
	}
}







function Circle(x,y,rad,color) {
	var _this = this;

	// constructor
	(function() {
		_this.x = x || null;
		_this.y = y || null;
		_this.radius = rad || null;
		_this.color = color || null;
	})();

	this.draw = function(ctx) {
		if(!_this.x || !_this.y || _this.radius || _this.color) {
			console.error('Circle requires an x, y, radius and color');
			return;
		}
		ctx.beginPath();
		ctx.arc(_this.x, _this.y, _this.radius, 0, 2 * Math.PI, false);
		ctx.fillStyle = _this.color;
		ctx.fill();
	}
}

// <canvas id="canvas" width="496" height="200"></canvas>

// canvas {
//	 position: absolute;
//	 left: 50%;
//	 margin-left: -250px;
//	 top: 50%;
//	 margin-top: -100px;
//	 border: 1px solid #ccc;
// }

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var circles = [];
var colors = ['#A6A938', '#789E35', '#8B2E5F', '#5A2971'];

var radius = 5;

var i = 0;
for(var y = 0; y < 10; y++) {
	for(var x = 0; x < 21; x++) {
		var c = new Circle(x*24, 10+y*21, radius, colors[i]);
		circles.push(c);
		i = (i == colors.length-1) ? 0 : i+1;
	}
}

// Circle object
function Circle(x,y,rad,color) {
	var _this = this;

	// constructor
	(function() {
		_this.x = x || null;
		_this.y = y || null;
		_this.radius = rad || null;
		_this.color = color || null;
	})();

	 this.update = function() {
	 _this.x += 0.5;
	 _this.y += 0.5;
	 if(_this.x > 496+_this.radius) _this.x = 0-_this.radius;
	 if(_this.y > 200+_this.radius) _this.y = 0-_this.radius;
	 }

	this.draw = function(ctx) {
		if(!_this.x || !_this.y || !_this.radius || !_this.color) {
			console.error('Circle requires an x, y, radius and color');
			return;
		}
		ctx.beginPath();
		ctx.arc(_this.x, _this.y, _this.radius, 0, 2 * Math.PI, false);
		ctx.fillStyle = _this.color;
		ctx.fill();
	};
}

// animation loop
function loop() {
	ctx.clearRect(0,0,500,200);
	for(var i = 0; i < circles.length; i++) {
		circles[i].update();
		circles[i].draw(ctx);
	}
	requestAnimationFrame(loop);
}

// start the loop
loop();




var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var circles = [];
var colors = ['#A6A938', '#789E35', '#8B2E5F', '#5A2971'];
var centerX = canvas.width/2;
var centerY = canvas.height/2;
var innerRadius = 20;

var radius = 5;

for(var i = 0; i < 200; i++) {
	var p = Math.random();
	var x = centerX + innerRadius * Math.cos(2 * Math.PI * p);
	var y = centerY + innerRadius * Math.sin(2 * Math.PI * p);
	var circle = new Circle(x,y,radius,colors[Math.floor(i%4)]);
	var r = innerRadius+20+Math.random()*80;
	circle.innerX = x;
	circle.outerX = centerX + r * Math.cos(2 * Math.PI * p);
	circle.innerY = y;
	circle.outerY = centerY + r * Math.sin(2 * Math.PI * p);
	circles.push(circle);

}

// Circle object
function Circle(x,y,rad,color) {
	var _this = this;

	// constructor
	(function() {
		_this.x = x || null;
		_this.y = y || null;
		_this.radius = rad || null;
		_this.color = color || null;
		})();


	this.draw = function(ctx) {
		if(!_this.x || !_this.y || !_this.radius || !_this.color) {
			console.error('Circle requires an x, y, radius and color');
			return;
		}
		ctx.beginPath();
		ctx.arc(_this.x, _this.y, _this.radius, 0, 2 * Math.PI, false);
		ctx.fillStyle = _this.color;
		ctx.fill();
	};
}

// animation loop
function loop() {
	ctx.clearRect(0,0,500,200);
	for(var i = 0; i < circles.length; i++) {
		circles[i].draw(ctx);
	}
	requestAnimationFrame(loop);
}

// start the loop
loop();

// Tween the circles, I'm using GSAP TweenLite library here
for(var i = 0; i < circles.length; i++) {
	tweenCircle(circles[i]);
}

function tweenCircle(c) {
	TweenLite.to(c, 0.5+Math.random(), {x: c.outerX, y: c.outerY, ease: Cubic.easeInOut, onComplete: function() {
		TweenLite.to(c, 0.5+Math.random(), {x: c.innerX, y: c.innerY, ease: Cubic.easeInOut, onComplete: function() {
			tweenCircle(c);
		}
	})
	}});
}


function Canvas(el)
{
	this.canvas = document.getElementsByTagName('canvas')[0]
	this.width = canvas.width
	this.height = canvas.height
	this.c = this.canvas.getContext('2d')
	this.color = "red"
	this.origin = {}
	this.origin.x = this.width/2
	this.origin.y = this.height/2
	this.g = 25
	this.minx = -10
	this.miny = -10
	this.maxx = 10
	this.maxy = 10

	this.clear = function()
	{
		this.c.clearRect(0, 0, this.width, this.height)
		return this
	}
	this.draw = function(f)
	{
		f()
	}
	this.redraw = function()
	{
		this.clear()
		this.draw()
	}
	this.tra = function(x, y)
	{
		return {x: (x * this.g + this.origin.x), y: (this.height - (y * this.g + this.origin.y))}
	}
	this.dot = function(x, y, color)
	{
		var p = this.tra(x, y)

		this.c.beginPath()
		this.c.arc(p.x, p.y, 3, Math.PI, -Math.PI, false)
		this.c.lineWidth = 1
		this.c.fillStyle = color
		this.c.fill()
		return this
	}
	this.line = function(x1, y1, x2, y2, color, width)
	{
		var p1 = this.tra(x1, y1)
		var p2 = this.tra(x2, y2)

		this.c.beginPath()
		this.c.moveTo(p1.x, p1.y)
		this.c.lineTo(p2.x, p2.y)
		this.c.strokeStyle = color || "black"
		this.c.lineWidth = width || 1
		this.c.stroke()
		this.c.closePath()
		return this
	}
	this.render = function(f)
	{
		if (_.isFunction(f)) 	{for(var i = -10; i < 10; i+=.01) {this.dot(i, f(i), "red")}}
		if (_.isArray(f)) 		{for(var d in f) {this.dot(d, f[d], "red")}}
		return this
	}
	this.integr = function(f)
	{
		for(var i = -10; i < 10; i+=.01) {this.line(i, 0, i, f(i), "red")}
		return this
	}
	//this.differ = function(f, x) {return this}

	this.grid = function()
	{
		this.c.strokeStyle = "rgba(0, 0, 255, 1)"
		for (var i = this.minx; i <= this.maxx; i++) {this.line(i, this.miny, i, this.maxy, "rgba(0, 0, 255, 1)")}
		for (var j = this.miny; j <= this.maxy; j++) {this.line(this.minx, j, this.maxx, j, "rgba(0, 0, 255, 1)")}

		this.line(this.minx, 0, this.maxx, 0, "rgba(0, 0, 0, 1)", 4)
		this.line(0, this.miny, 0, this.maxy, "rgba(0, 0, 0, 1)", 4)

		for (var i = this.minx; i <= this.maxx; i++) {this.line(i, -.2, i, .2, "rgba(0, 0, 0, 1)", 4)}
		for (var j = this.miny; j <= this.maxy; j++) {this.line(-.2, j, .2, j, "rgba(0, 0, 0, 1)", 4)}
		return c
	}
	return this
}




var Canvas;

Canvas = (function()
{
	Canvas.name = 'Canvas';
	function Canvas(el)
	{
		if (isString(el)) {
			el = $(el);
		}
		if (el instanceof jQuery) {
			el = el[0];
		}
		this.canvas = el;
		this.context = this.canvas.getContext('2d');
		return this;
	}

	Canvas.prototype.clear = function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		return this;
	}

	Canvas.prototype.origin = function() {
		return {hx: this.canvas.width/2, hy: this.canvas.height/2}
	}

	Canvas.prototype.draw = function(fn) {
		if (isFunction(fn)) {
			this.drawer = fn;
			return this.drawer();
		}
		return this;
	}

	Canvas.prototype.raw = function() {
		return this;
	}

	Canvas.prototype.axis = function(c, w) {
		var ctx = this.context;
		ctx.moveTo(0, this.height/2)
		ctx.lineTo(this.height, this.height/2)
		ctx.moveTo(0, this.width/2)
		ctx.lineTo(this.width, this.width/2)
		ctx.strokeStyle = c || "rgba(0, 0, 0, 1)";
		ctx.lineWidth = w || 2;
		ctx.stroke();
		return this;
	}

	Canvas.prototype.grid = function(n, c) {
		if (!n) {return this.axis();};
		var a = this.canvas.width/n;
		var b = this.canvas.height/n;
		var ctx = this.context;
		ctx.beginPath();
		for(var i = 0; i < a; i++) {
			ctx.moveTo(i*a, 0);
			ctx.lineTo(i*a, this.canvas.width;
		}
		for(var j = 0; j < b; j++) {
			ctx.moveTo(0, j*b);
			ctx.lineTo(this.canvas.height, j*b);
		}
		ctx.strokeStyle = c || "rgba(0, 0, 0, 1)";
		ctx.closePath();
		return this;
	}

	Canvas.prototype.label = function(x, y, label)
	{
		var ctx = this.context;
		ctx.font = "10pt Calibri";
		ctx.fillStyle = "rgba(0, 0, 0, 1)";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(label, x, y);
		return this;
	}

	Canvas.prototype.dot = function(x, y, color)
	{
		var ctx = this.context;
		ctx.save();
		ctx.fillStyle = color || "black";
		ctx.fillRect(x-3, y-18, 4, 4);
		ctx.restore();
		return this;
	}

	Canvas.prototype.render = function(fn, color) {
		color = color || "rgba(0, 0, 0, 1)";
		var ctx = this.context;
		for(var i = 0; i < this.canvas.width; i++) {
			this.dot(i, fn(i), color);
		}
	}

	Canvas.prototype.line = function()
	{
		var x1, y1, x2, y2;
		var color;
		var args = arguments;
		var error = false;
		switch (args.length-1) {
			case -1: error = true; break;
			case 0:
				x1 = args[0][0][0];
				y1 = args[0][0][1];
				x2 = args[0][1][0];
				y2 = args[0][1][1];
				color = args[1] || "";
			break;
			case 1:
				x1 = args[0][0];
				y1 = args[0][1];
				x2 = args[1][0];
				y2 = args[1][1];
				color = args[2] || "";
			break;
			case 2: error = true; break;
			case 3:
				x1 = args[0];
				y1 = args[1];
				x2 = args[2];
				y2 = args[3];
				color = args[4] || "";
			break;
			default: error = true; break;
		};
		if (error === true) {return false;};
		var ctx = this.context;

		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		if (color) {
			ctx.strokeStyle = s;
		}
		ctx.stroke();
		ctx.closePath();
		return this;
	}

	Canvas.prototype.circle = function(x, y, r, w, s, f, l)
	{
		var ctx = this.context;
		ctx.beginPath();
		ctx.arc(x, y, r, Math.PI, -Math.PI, false);
		ctx.lineWidth = w;
		if (f)
		{
			ctx.fillStyle = f
			ctx.fill();
		}
		if (s)
		{
			ctx.strokeStyle = s;
			ctx.stroke();
		}
		if (l)
		{
			this.label(x+", "+y+", "+r, x*100+500, y*100+500)
		}
	}

	Canvas.prototype.square = function(x, y, e, w, c, f)
	{
		var ctx = this.context;
		if (c == '')
		{
			c = 'rgba(0, 0, 0, 0)';
		}
		ctx.beginPath();
		ctx.rect(x, y, e, e);
		ctx.lineWidth = w;
		ctx.strokeStyle = c;
		ctx.stroke();
		if (f)
		{
			ctx.fillStyle = f;
			ctx.fillRect(x, y, e, e);
		}
		return this;
	}

	Canvas.prototype.rectangle = function(x, y, dx, dy, s, f, l)
	{
		var ctx = this.context;
		ctx.beginPath()
		if (s != '')
		{
			ctx.strokeStyle = s;
			ctx.stroke();
		}
		if (f != '')
		{
			ctx.fillStyle = f;
			ctx.fill();
		}
		ctx.fillRect(x-3, y-18, dx+3, dy);
		if (l == true)
		{
			label(x+", "+y+", "+r, x*100+500, y*100+500);
		}
		ctx.closePath();
		return this;

	}
	Canvas.prototype.roundedRect = function(x, y, w, h, r)
	{
		var ctx = this.context;
		ctx.beginPath();
		ctx.moveTo(x, y+r);
		ctx.lineTo(x, y+h-r);
		ctx.quadraticCurveTo(x, y+h, x+r, y+h);
		ctx.lineTo(x+w-r, y+h);
		ctx.quadraticCurveTo(x+w, y+h, x+w, y+h-r);
		ctx.lineTo(x+w, y+r);
		ctx.quadraticCurveTo(x+w, y, x+w-r, y);
		ctx.lineTo(x+r, y);
		ctx.quadraticCurveTo(x, y, x, y+r);
		ctx.stroke();
		return this;

	}
	Canvas.prototype.smiley = function(x, y, r, c)
	{
		var ctx = this.context;
		if (c) {
			ctx.strokeStyle = c;
		}
		ctx.beginPath();
		ctx.arc(x,y,r/2,0,Math.PI*2,true);
		ctx.stroke();
		ctx.closePath();

		ctx.beginPath();
		ctx.arc(x,y+r/10,r/4,0,Math.PI,false);
		ctx.stroke();
		ctx.closePath();

		ctx.beginPath();
		ctx.arc(x-r/5,y-r/8,r/10,0,Math.PI*2,true);
		ctx.stroke();
		ctx.closePath();

		ctx.beginPath();
		ctx.arc(x+r/5,y-r/8,r/10,0,Math.PI*2,true)
		ctx.stroke();
		ctx.closePath();
		return this;
	}

	Canvas.prototype.speechbubble = function(n)
	{
		var c = this.context;
		n = n || 100;
		c.beginPath();
		c.moveTo(.75*n, .25*n)
		c.quadraticCurveTo(.25*n, 	.25*n, 	.25*n, 	.625*n);
		c.quadraticCurveTo(.25*n, 	n, 		.5*n, 	n);
		c.quadraticCurveTo(.5*n, 	1.2*n, 	.3*n, 	1.25*n);
		c.quadraticCurveTo(.6*n, 	1.2*n, 	.65*n, 	n);
		c.quadraticCurveTo(1.25*n, 	n, 		1.25*n, .625*n);
		c.quadraticCurveTo(1.25*n, 	.25*n, 	.75*n, 	.25*n);
		c.stroke();
		return this;
	}
	Canvas.prototype.heart = function(n)
	{
		var c = this.context;
		n = n || 100;
		c.beginPath();
		c.moveTo(.75*n, .4*n);
		c.bezierCurveTo(.75*n, 	.37*n, 	.7*n, 	.25*n, 		.5*n, 	.25*n);
		c.bezierCurveTo(.2*n, 	.25*n, 	.2*n, 	.62.5*n, 	.2*n, 	.625*n);
		c.bezierCurveTo(.2*n, 	.8*n, 	.4*n, 	1.02*n, 	.75*n, 	1.2*n);
		c.bezierCurveTo(1.1*n, 	1.02*n, 1.3*n, 	.8*n, 		1.3*n, 	.625*n);
		c.bezierCurveTo(1.3*n, 	.625*n, 1.3*n, 	.25*n, 		n, 		.25*n);
		c.bezierCurveTo(.85*n, 	.25*n, 	.75*n, 	.37*n, 		.75*n, 	.4*n);
		c.fill();
		return this;
	}

	Canvas.prototype.arcs = function()
	{
		var c = this.context;
		for (i = 0; i < 4; i++)
		{
			for(j = 0; j < 3; j++)
			{
				c.beginPath()
				var x          	= 25 + j * 50
				var y          	= 25 + i * 50
				var r     		= 20
				var startAngle 	= 0
				var endAngle   	= Math.PI + (Math.PI*j)/2
				var clockwise  	= i % 2 == 0 ? false : true

				c.arc(x, y, r, startAngle, endAngle, clockwise)

				if (i > 1)	{c.fill()}
				else 		{c.stroke()}
			}
		}
		return this;
	}

	Canvas.prototype.bowtie = function(x, y, d, color)
	{
		var c = this.context;
		c.save();
		c.translate(x, y);
		c.rotate(d * Math.PI / 180);

		c.fillStyle = "rgba(200, 200, 200, 0.3)";
		c.fillRect(-30, -30, 60, 60);

		c.fillStyle = color;
		c.globalAlpha = 1.0;
		c.beginPath();
		c.moveTo(25, 25);
		c.lineTo(-25, -25);
		c.lineTo(25, -25);
		c.lineTo(-25, 25);
		c.closePath();
		c.fill();

		dot(c);
		c.restore();
		return this;
	}

	Canvas.prototype.pretty = function(x, y)
	{
		var origin = this.origin();
		if (!x) {x = origin.hx;}
		if (!y) {y = origin.hy;}

		this.circle(x-100, y, 100, 5, '', 'rgba(250, 0, 0, 0.5)');
		this.circle(x, y-100, 100, 5, '', 'rgba(0, 0, 0, 0.5)');
		this.circle(x, y+100, 100, 5, '', 'rgba(0, 250, 0, 0.5)');
		this.circle(x+100, y, 100, 5, '', 'rgba(0, 0, 250, 0.5)');
		this.circle(x-70, y-70, 100, 5, '', 'rgba(250, 0, 250, 0.5)');
		this.circle(x+70, y+70, 100, 5, '', 'rgba(250, 250, 0, 0.5)');
		this.circle(x-70, y+70, 100, 5, '', 'rgba(0, 250, 250, 0.5)');
		this.circle(x+70, y-70, 100, 5, '', 'rgba(250, 250, 250, 0.5)');

		this.circle(x-100, y, 100, 5, 'black');
		this.circle(x, y-100, 100, 5, 'black');
		this.circle(x, y+100, 100, 5, 'black');
		this.circle(x+100, y, 100, 5, 'black');
		this.circle(x-70, y-70, 100, 5, 'black');
		this.circle(x-70, y+70, 100, 5, 'black');
		this.circle(x+70, y-70, 100, 5, 'black');
		this.circle(x+70, y+70, 100, 5, 'black');
	}

	Canvas.prototype.point = function(p)
	{
		var x = p[0];
		var y = p[1];
		var ctx = this.context;
		ctx.beginPath();
		ctx.arc(x, y, 5, 0, 2*Math.PI);
		ctx.fill();
		ctx.closePath();
		return this
	}
	Canvas.prototype.triangle = function(side, c, f)
	{
		side = side || 100;
		var ctx = this.context;
		var origin = this.origin();

		var h = side * (Math.sqrt(3)/2);
		var cx = origin.hx;
		var cy = origin.hy - (h/8);

		if (!cx || !cy) {return;}

		ctx.beginPath();
		ctx.moveTo(cx,              cy-(h/2));
		ctx.lineTo(cx-(side/2),     cy+(h/2));
		ctx.lineTo(cx+(side/2),     cy+(h/2));
		ctx.lineTo(cx,              cy-(h/2));
		ctx.strokeStyle = c || "black";
		ctx.stroke();
		if (f) {
			ctx.fillStyle = fill;
			ctx.fill();
		}
		ctx.closePath();
		return this;
	}

	Canvas.prototype.curvedTriangle = function(side, c, f)
	{
		side = side || 100;
		var ctx = this.context;
		var origin = this.origin();

		var h = side * (Math.sqrt(3)/2);
		var cx = origin.hx;
		var cy = origin.hy - (h/8);

		if (!cx || !cy) {return;}

		var t = [[cx, cy-(h/2)], [cx-(side/2), cy+(h/2)], [cx+(side/2), cy+(h/2)]];

		ctx.beginPath();
		ctx.moveTo(t[1][0], t[1][1]);
		ctx.quadraticCurveTo(cx, cy, t[2][0], t[2][1]);
		ctx.quadraticCurveTo(cx, cy, t[3][0], t[3][1]);
		ctx.quadraticCurveTo(cx, cy, t[1][0], t[1][1]);

		ctx.strokeStyle = c || "black";
		ctx.stroke();

		if (f) {
			ctx.fillStyle = f;
			ctx.fill();
		}
		ctx.closePath();

		return this;
	}

	Canvas.prototype.pacman = function()
	{
		var c = this.context;

		this.roundedRect(12, 12, 150, 150, 15);
		this.roundedRect(19, 19, 150, 150, 9);
		this.roundedRect(53, 53, 49, 33, 10);
		this.roundedRect(53, 119, 49, 16, 6);
		this.roundedRect(135, 53, 49, 33, 10);
		this.roundedRect(135, 119, 25, 49, 10);
		c.beginPath();
		c.arc(37, 37, 13, Math.PI/7, -Math.PI/7, false);
		c.fillStyle = "gold";
		c.lineTo(34, 37);
		c.fill();
		c.fillStyle = "black";
		for(var i = 0; i < 8; i++) {c.fillRect(51+i*16, 35, 4, 4);}
		for(var i = 0; i < 6; i++) {c.fillRect(115, 51+i*16, 4, 4);}
		for(var i = 0; i < 8; i++) {c.fillRect(51+i*16, 99, 4, 4);}
		c.beginPath();
		c.moveTo(83, 116);
		c.lineTo(83, 102);
		c.fillStyle = "green";
		c.bezierCurveTo(83, 94, 89, 88, 97, 88);
		c.bezierCurveTo(105, 88, 111, 94, 111, 102);
		c.lineTo(111, 116);
		c.lineTo(106.333, 111.333);
		c.lineTo(101.666, 116);
		c.lineTo(97, 111.333);
		c.lineTo(92.333, 116);
		c.lineTo(87.666, 111.333);
		c.lineTo(83, 116);
		c.fill();
		c.closePath();

		c.beginPath();
		c.fillStyle = "white";
		c.moveTo(91, 96);
		c.bezierCurveTo(88, 96, 87, 99, 87, 101);
		c.bezierCurveTo(87, 103, 88, 106, 91, 106);
		c.bezierCurveTo(94, 106, 95, 103, 95, 101);
		c.bezierCurveTo(95, 99, 94, 96, 91, 96);
		c.moveTo(103, 96);
		c.bezierCurveTo(100, 96, 99, 99, 99, 101);
		c.bezierCurveTo(99, 103, 100, 106, 103, 106);
		c.bezierCurveTo(106, 106, 107, 103, 107, 101);
		c.bezierCurveTo(107, 99, 106, 96, 103, 96);
		c.fill();
		c.fillStyle = "blue";
		c.closePath();

		c.beginPath();
		c.arc(101, 102, 2, 0, Math.PI*2, true);
		c.fill();
		c.closePath();

		c.beginPath();
		c.arc(89, 102, 2, 0, Math.PI*2, true);
		c.fill();
		c.closePath();
		return this;
	}

	return Canvas;
})
()





function animation(c)
{
	var points = []
	var go = true

	var tick = function()
	{
		c.clearRect(0, 0, 512, 512)
		for(var i = 0; i < points.length; i++)
		{
			points[i].tick()
			points[i].display(c)
		}
		if (go == true) {setTimeout(tick, 15)}
	}
	var addBalls = function(){
		var color = {red:Math.floor(Math.random()*255), green:Math.floor(Math.random()*255), blue:Math.floor(Math.random()*255) }
		var velocity = { 'x':Math.floor(Math.random()*400)-200, 'y':Math.floor(Math.random()*100)}
		var r = Math.floor(Math.random()*30+10);
		var randomnumber=Math.floor(Math.random()*450)
		points.push(new Point(randomnumber+50, 512, color, velocity, r ))
		setTimeout(addBalls, 300)
		if (go == true) {}
	}
	addBalls()
	$("body").keydown(function(e)
	{
		if		(e.which == 37){for(var i = 0; i < points.length; i++){points[i].applyForce(-Math.random()*150-100, 0)}}
		else if	(e.which == 38){for(var i = 0; i < points.length; i++){points[i].applyForce(0, Math.random()*150+100)}}
		else if	(e.which == 39){for(var i = 0; i < points.length; i++){points[i].applyForce(Math.random()*150+100, 0)}}
		else if	(e.which == 40){for(var i = 0; i < points.length; i++){points[i].applyForce(0, -Math.random()*150-100)}}
		else if	(e.which == 32){points = []}
	})
	$("canvas").eq(8).toggle(function(e){go = false}, function(e){go = true; tick()})
	tick()
}

(function(global){
	var	proto		=
		bindings	= [];

	function getData(canvas){
		var i, l = bindings.length, data;
		for (i=0; i<l; i++){
			if (bindings[i].c === canvas){
				return bindings[i];
			}
		}
		data = {
			c: canvas,	// canvas
			h: [],		// History
			f: [],		// Future
			s: 10		// Size
		};
		bindings.push(data);
		return data;
	}

	function clearHistory(data){
			while(data.h.length > data.s + 1){
				data.h.shift();
			}
			while(data.f.length > data.s){
				data.f.pop();
			}
	}

	function canvasHistory(context){

		context.undo = function(){
			var	context		= this,
				historyObj	= getData(context.canvas),
				imgdata;
			if (historyObj.h.length < 2){
				return;
			}
			historyObj.f.unshift(historyObj.h.pop());
			imgdata = historyObj.h[historyObj.h.length-1];
			context.putImageData(imgdata, 0, 0);
			clearHistory(historyObj);
			return true;
		};

		context.redo = function(){
			var	context		= this,
				historyObj	= getData(context.canvas),
				imgdata;
			if (!historyObj.f.length){
				return;
			}
			imgdata = historyObj.f.shift();
			historyObj.h.push(imgdata);
			context.putImageData(imgdata, 0, 0);
			clearHistory(historyObj);
			return true;
		};

		context.saveHistory = function(){
		var	context		= this,
			canvas		= context.canvas,
			historyObj	= getData(context.canvas),
			imgdata;
			historyObj.h.push( context.getImageData(0, 0, canvas.width, canvas.height) );
			historyObj.f = [];
			clearHistory(historyObj);
		};

		context.getHistorySize = function(){
			return getData(this.canvas).s;
		};

		context.setHistorySize = function(val){
			getData(this.canvas).s = val;
		};
	}

	// Imply global
	global.canvasHistory = canvasHistory;

	/*
		This applies canvasHistory to all contexts, no harm exactly but you may consider it intruding.
		If that's the case, you can just remove this call from the code, and use the canvasHistory() on few and selected contexts instead.
		However, that is pretty much unrecommendable, as that means you will lose the bindings each time the context is destroyed (whenever you change width or height, or do something else to destroy it).
	*/
	canvasHistory(CanvasRenderingContext2D.prototype);
})(this);
