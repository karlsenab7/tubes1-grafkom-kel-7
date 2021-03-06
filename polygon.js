"use strict";

var canvas;
var gl;
var maxNumVertices = 200;
var index = 0;

canvas = document.getElementById("glcanvas");
gl = WebGLUtils.setupWebGL(canvas);
var bufferId = gl.createBuffer();
var cBufferId = gl.createBuffer();

var colors = [
    // vec4()
    vec4(0.0, 0.0, 0.0, 1.0),  // black
    vec4(1.0, 0.0, 0.0, 0.0),  // red
    vec4(1.0, 1.0, 0.0, 0.0),  // yellow
    vec4(0.0, 1.0, 0.0, 0.0),  // green
    vec4(0.0, 0.0, 1.0, 0.0),  // blue
    vec4(1.0, 0.0, 1.0, 0.0),  // purple
    vec4(0.0, 1.0, 1.0, 0.0)   // lightblue
];
var cindex = 0; // default : black

var t2; // store position (vec2)
var t4; // store color (vec4)
var arrOfT2 = [];
var arrOfT4 = [];
var t2zero = [];
var t4zero = [];
arrOfT2[0] = t2zero;
arrOfT4[0] = t4zero;


var numPolygons = 0;
var numIndices = [];
numIndices[0] = 0;
var start = [0];

// download to file
const downloadToFile = (
    content,
    filename = "data_kel7.json",
    contentType = "json"
) => {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
};

// save to file
const saveProgress = () => {
    const data = {
        index,
        cindex,
        arrOfT2,
        arrOfT4,
        numPolygons,
        numIndices,
        start,
    };
    downloadToFile(JSON.stringify(data));
};

// load external file
const loadProgress = (e) => {
    const file = e.target.files[0];
    var reader = new FileReader();
    reader.addEventListener("load", function (e) {
        let data = e.target.result;
        data = JSON.parse(data);
        index = data.index;
        cindex = data.cindex;
        arrOfT2 = data.arrOfT2,
        arrOfT4 = data.arrOfT4,
        numPolygons = data.numPolygons;
        numIndices = data.numIndices;
        start = data.start;
        renderLoad();
        console.log("load progress works to the end")
    });
    reader.readAsBinaryString(file);
};

window.onload = function init() {
    canvas = document.getElementById("glcanvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("Unable to setup WebGL. Your browser or computer may not support it."); }

    // Menu Color
    var colorMenu = document.getElementById("colorMenu");
    colorMenu.addEventListener("click", function () {
        cindex = colorMenu.selectedIndex;
    });

    // Save
    let saveButton = document.getElementById("save");
    saveButton.addEventListener("click", saveProgress);

    // Load
    let loadButton = document.getElementById("load");
    loadButton.addEventListener("change", loadProgress);

    // POLYGON
    var createPolygon = document.getElementById("createPolygon")
    createPolygon.addEventListener("click", function () {
        numPolygons++;
        numIndices[numPolygons] = 0;
        start[numPolygons] = index;
        renderPolygon();
    });

    // clear canvas
    var clearCanvas = document.getElementById("clearCanvas")
    clearCanvas.addEventListener("click", function () { location.reload() })

    canvas.addEventListener("mousedown", function (event) {
        t2 = vec2(2 * event.clientX / canvas.width - 1,
            2 * (canvas.height - event.clientY) / canvas.height - 1);
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * index, flatten(t2));

        t4 = vec4(colors[cindex]);

        gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * index, flatten(t4));

        t2zero.push(t2[0]);
        t2zero.push(t2[1]);

        t4zero.push(t4);

        numIndices[numPolygons]++;
        index++;
        console.log(arrOfT2);
        console.log(arrOfT4);
    });


    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.8, 0.8, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);


    // Program
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * maxNumVertices, gl.STATIC_DRAW);
    var vPos = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPos, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPos);

    // var cBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 16 * maxNumVertices, gl.STATIC_DRAW);
    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);
}

function renderPolygon() {

    gl.clear(gl.COLOR_BUFFER_BIT);

    for (var i = 0; i < numPolygons; i++) {
        gl.drawArrays(gl.TRIANGLE_FAN, start[i], numIndices[i]);
    }
}

function renderLoad() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    console.log(arrOfT2);
    console.log(arrOfT4);
    // bufferId = gl.createBuffer();
    // cBufferId = gl.createBuffer();
    for (let i = 0; i < arrOfT2.length; i++) {
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(arrOfT2[i]));

        gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(arrOfT4[i]));
    }

    for (var i = 0; i < numPolygons; i++) {
        gl.drawArrays(gl.TRIANGLE_FAN, start[i], numIndices[i]);
    }
    console.log("renderLoad works to the end");
}