main( );

function NormalisedToDevice( coord, axisSize )
{
	var halfAxisSize = axisSize / 2;
	var deviceCoord = ( coord + 1 ) * halfAxisSize;
	return deviceCoord;
}

function DeviceToNormalised( coord, axisSize )
{
	var halfAxisSize = axisSize / 2;
	var normalisedCoord = ( coord / halfAxisSize ) - 1;
	return normalisedCoord;
}


function main( )
{
	let canvasElem = document.querySelector("canvas");
	// clear canvas
    var clearCanvas = document.getElementById("clearCanvas")
    clearCanvas.addEventListener("click", function () { location.reload() })
	canvasElem.addEventListener("mousedown", function(e)
	{
		var newPointPosition = getMousePosition(canvasElem, e);
		console.log(newPointPosition);
		const canvas = document.querySelector( "#glcanvas" );
		const gl = canvas.getContext( "webgl" );
	
		if ( !gl )
		{
			alert( "Unable to setup WebGL. Your browser or computer may not support it." );
	
			return;
		}
		//Line Default
		var lineVertices = [
			-0.5, 0.0, 0.0,
			0.5, 0.0, 0.0,
		];

		//Jarak dengan titik default 1
		var result1 = Math.sqrt((Math.pow(newPointPosition[0]-lineVertices[0],2)+Math.pow(newPointPosition[1]-lineVertices[1],2)));
		//Jarak dengan titik default 2
		var result2 = Math.sqrt((Math.pow(newPointPosition[0]-lineVertices[3],2)+Math.pow(newPointPosition[1]-lineVertices[4],2)));
		console.log(result1);
		console.log(result2);
		if (result1 < result2){
			lineVertices[0] = newPointPosition[0];
			lineVertices[1] = newPointPosition[1];
		} 
		else if (result1 > result2){
			lineVertices[3] = newPointPosition[0];
			lineVertices[4] = newPointPosition[1];
		}

		if(document.getElementById("scale").value.length > 0){
			for(let i = 0; i < lineVertices.length; i++){
				lineVertices[i] = lineVertices[i] * document.getElementById("scale").value;
			}
		}
		console.log(lineVertices);
		var vertex_buffer = gl.createBuffer( );
			gl.bindBuffer( gl.ARRAY_BUFFER, vertex_buffer );
			gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( lineVertices ), gl.STATIC_DRAW );

	
			gl.bindBuffer( gl.ARRAY_BUFFER, null );
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
		var coord = gl.getAttribLocation( shaderProgram, "coordinates" );
		gl.vertexAttribPointer( coord, 3, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( coord );
		gl.clearColor( 1.0, 1.0, 1.0, 0.0 );
		gl.enable( gl.DEPTH_TEST );
		gl.clear( gl.COLOR_BUFFER_BIT );
		gl.viewport( 0, 0, canvas.width, canvas.height );
		gl.drawArrays( gl.LINES, 0, 2 );
	});

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
  
}
