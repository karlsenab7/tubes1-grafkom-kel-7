"use strict";

var canvas;
var gl;
var Position = false;

window.onload = function init() {
    canvas = document.getElementById( "glcanvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "Unable to setup WebGL. Your browser or computer may not support it." ); }

    var square = document.getElementById("createSquare")
    square.addEventListener("click", function(){
    renderSquare(0.4);
    });

	var clearCanvas = document.getElementById("clearCanvas")
    clearCanvas.addEventListener("click", function () { location.reload() })
	
	let canvasElem = document.querySelector("canvas");
	canvasElem.addEventListener("mousedown", function(e)
	{
		var newPointPosition = getMousePosition(canvasElem, e);
		console.log(newPointPosition);
		var vertices = [
			-0.5, 0.5, 0.0, // 1st - 0
			-0.5, -0.5, 0.0, // 2nd - 1
			0.5, -0.5, 0.0, // 3rd - 2
			0.5, 0.5, 0.0 // 4th - 3
		 ];
		var indices = [3, 2, 1, 3, 1, 0];
		if(document.getElementById("scale").value.length > 0){
			for(let i = 0; i < vertices.length; i++){
				vertices[i] = vertices[i] * document.getElementById("scale").value;
			}
		}

		if(Position){
			//Jarak dengan titik default 1
		var jarak = vertices[1];
		var result1 = Math.sqrt((Math.pow(newPointPosition[0]-vertices[0],2)+Math.pow(newPointPosition[1]-vertices[1],2)));
		//Jarak dengan titik default 2
		var result2 = Math.sqrt((Math.pow(newPointPosition[0]-vertices[3],2)+Math.pow(newPointPosition[1]-vertices[4],2)));
		//Jarak dengan titik default 1
		var result3 = Math.sqrt((Math.pow(newPointPosition[0]-vertices[6],2)+Math.pow(newPointPosition[1]-vertices[7],2)));
		//Jarak dengan titik default 2
		var result4 = Math.sqrt((Math.pow(newPointPosition[0]-vertices[9],2)+Math.pow(newPointPosition[1]-vertices[10],2)));
		console.log(result1);
		console.log(result2);
		console.log(result3);
		console.log(result4);

		vertices[0] = newPointPosition[0];
		vertices[1] = newPointPosition[1];
		vertices[3] = vertices[0];
		vertices[4] = vertices[1]-2*jarak;
		vertices[6] = vertices[3]+2*jarak;
		vertices[7] = vertices[4];
		vertices[9] = vertices[6];
		vertices[10] = vertices[7]+2*jarak;
		}

		var vertex_buffer = gl.createBuffer( );
		gl.bindBuffer( gl.ARRAY_BUFFER, vertex_buffer );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );
		gl.bindBuffer( gl.ARRAY_BUFFER, null );
		var Index_Buffer = gl.createBuffer( );
		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, Index_Buffer );
		gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array (indices ), gl.STATIC_DRAW );
		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null );
	
		var vertCode = 
			'attribute vec3 coordinates;' +
			'void main(void)' +
			'{' +
				' gl_Position = vec4(coordinates, 1.0);' +
			'}';
	
		var vertShader = gl.createShader( gl.VERTEX_SHADER );
	
		gl.shaderSource( vertShader, vertCode );
		gl.compileShader( vertShader );
		var fragCode = 
			'void main(void)' +
			'{' +
				' gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);' +
			'}';
		var fragShader = gl.createShader( gl.FRAGMENT_SHADER );
		gl.shaderSource( fragShader, fragCode );
		gl.compileShader( fragShader );
		var shaderProgram = gl.createProgram( );
		gl.attachShader( shaderProgram, vertShader );
		gl.attachShader( shaderProgram, fragShader );
		gl.linkProgram( shaderProgram );
		gl.useProgram( shaderProgram );
		gl.bindBuffer( gl.ARRAY_BUFFER, vertex_buffer );
		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, Index_Buffer );
		var coord = gl.getAttribLocation( shaderProgram, "coordinates" );
		gl.vertexAttribPointer( coord, 3, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( coord );
		gl.clearColor( 1.0, 0.0, 0.0, 1.0 );
		gl.enable( gl.DEPTH_TEST );
		gl.clear( gl.COLOR_BUFFER_BIT );
		gl.viewport( 0, 0, canvas.width, canvas.height );
		gl.drawElements( gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0 );
		
	});
}

function renderSquare(n) {
    var vertices = [
    	-n, n, 0.0, // 1st - 0
    	-n, -n, 0.0, // 2nd - 1
    	n, -n, 0.0, // 3rd - 2
    	n, n, 0.0 // 4th - 3
     ];
    var indices = [3, 2, 1, 3, 1, 0];
    var vertex_buffer = gl.createBuffer( );
	gl.bindBuffer( gl.ARRAY_BUFFER, vertex_buffer );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );
	gl.bindBuffer( gl.ARRAY_BUFFER, null );
    var Index_Buffer = gl.createBuffer( );
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, Index_Buffer );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array (indices ), gl.STATIC_DRAW );
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null );

	var vertCode = 
		'attribute vec3 coordinates;' +
		'void main(void)' +
		'{' +
			' gl_Position = vec4(coordinates, 1.0);' +
		'}';

	var vertShader = gl.createShader( gl.VERTEX_SHADER );

	gl.shaderSource( vertShader, vertCode );
	gl.compileShader( vertShader );
	var fragCode = 
		'void main(void)' +
		'{' +
			' gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);' +
		'}';
	var fragShader = gl.createShader( gl.FRAGMENT_SHADER );
	gl.shaderSource( fragShader, fragCode );
	gl.compileShader( fragShader );
	var shaderProgram = gl.createProgram( );
	gl.attachShader( shaderProgram, vertShader );
	gl.attachShader( shaderProgram, fragShader );
	gl.linkProgram( shaderProgram );
	gl.useProgram( shaderProgram );
	gl.bindBuffer( gl.ARRAY_BUFFER, vertex_buffer );
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, Index_Buffer );
	var coord = gl.getAttribLocation( shaderProgram, "coordinates" );
	gl.vertexAttribPointer( coord, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( coord );
	gl.clearColor( 1.0, 0.0, 0.0, 1.0 );
	gl.enable( gl.DEPTH_TEST );
	gl.clear( gl.COLOR_BUFFER_BIT );
	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.drawElements( gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0 );
}


function getMousePosition(canvas, event) {
	let x = (2 * event.clientX) / canvas.width - 1;
	let y = (2 * (canvas.height - event.clientY)) / canvas.height - 1;
	var arr = new Array();
	arr.push(x);
	arr.push(y);
	console.log("Coordinate x: " + x, 
				"Coordinate y: " + y);
	return arr;
}


function toTrue(){
	Position = true;
	alert('Mode pergeseran diaktifkan');
}

function toFalse(){
	Position = false;
	alert('Mode pergeseran dinonaktifkan');
}