var width						= 640;
var height						= 480;
var gl 							= null;
var canvas 						= null;
var vertexShader				= null;
var fragmentShader				= null;
var shaderProgram				= null;
var vertexBuffer				= null;
var projection					= mat4.create();
var modelview					= mat4.create();
var vertexPositionAttribute 	= 0;

function getShaderContents (id) {
	var shaderContents = $('#' + id);
	
	if (!shaderContents) {
		return null;
	}

	return shaderContents.html();
}

function creatVertexShader (id) {
	var source = getShaderContents(id);

	if(!source) {
		console.error("Unable to get Vertex Shader source");
		return false;
	}

	vertexShader = gl.createShader(gl.VERTEX_SHADER);

	gl.shaderSource(vertexShader, source);
	gl.compileShader(vertexShader);

	if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error("Warning: Unable to compile shader - " + gl.getShaderInfoLog(vertexShader));
		return false;
	}
} 

function createFragmentShader (id) {
	var source = getShaderContents(id);

	if(!source) {
		console.error("Unable to get Vertex Shader source");
		return false;
	}

	fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(fragmentShader, source);
	gl.compileShader(fragmentShader);

	if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error("Warning: Unable to compile shader - " + gl.getShaderInfoLog(fragmentShader));
		return false;
	}
}

function createShaderProgram () {
	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		console.error("Unable to initialize the shader program.");
	}

	gl.useProgram(shaderProgram);

	vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(vertexPositionAttribute);
}

function initShaders () {
	creatVertexShader("shader-vs");
	createFragmentShader("shader-fs");
	createShaderProgram();
}

function createObject () {
	vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

	var vertices = [
		100.0, 100.0, 0.0,
		-100.0, 100.0, 0.0,
		100.0, -100.0, 0.0,
		-100.0, -100.0, 0.0
	];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

function setMatrixUniforms () {
	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	gl.uniformMatrix4fv(pUniform, false, projection);

	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	gl.uniformMatrix4fv(mvUniform, false, modelview);
}

function initContext () {
	canvas = $('#game-canvas')[0];

	if (!canvas) {
		console.error("Unable to locate canvas");
		return false;
	}

	gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

	if (!gl) {
		console.error("Your browser does not support WebGL");
		return false;
	}

	return true;
}

function initGl () {
	canvas.width = width;
	canvas.height = height;
	gl.clearColor(0.2, 0.2, 0.2, 1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	gl.viewport(0, 0, width, height);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function update() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	mat4.identity(projection);
	mat4.ortho(0, width, 0, height, 0.1, 100.0, projection);
	mat4.identity(modelview);
	mat4.translate(modelview, [(width / 2), (height / 2), -5.0]);

	setMatrixUniforms();

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

	requestAnimationFrame(update);
}

function initGame () {
	if (initContext()) {
		initGl();
		initShaders();

		createObject();

		requestAnimationFrame(update);
	} else {
		console.error("Unable to create WebGL Context");
	}
}

$(function () {
	initGame();
});