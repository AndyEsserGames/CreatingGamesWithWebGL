var gl 				= null;
var canvas 			= null;

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

function initGame () {
	if (initContext()) {

	} else {
		console.error("Unable to create WebGL Context");
	}
}

$(function () {
	initGame();
});