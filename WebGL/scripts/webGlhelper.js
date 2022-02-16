
var vertexShaderSrc = `

// an attribute will receive data from a buffer
attribute vec4 a_position;

// all shaders have a main function
void main() {

  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  gl_Position = a_position;
}
`
var innerResolution;
var MousePositionX;
var MousePositionY;
var innerFragmentShader;

var timeShaderUniform;
var mousePosUniform;
var resolutionUniform;

const canvas = document.querySelector('#glCanvas');

innerResolution = [canvas.width,canvas.height];
canvas.addEventListener('mousemove', e => {
MousePositionX = e.pageX/innerResolution[0];
MousePositionY = e.pageY/innerResolution[1];
});

// Initialize the GL context
const gl = canvas.getContext('webgl');
var program;

function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, innerFragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, innerFragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function showCanvas() {

if (!gl) {
  alert('Unable to initialize WebGL. Your browser or machine may not support it.');
  return;
}

// create GLSL shaders, upload the GLSL source, compile the shaders
var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);

// Link the two shaders into a program
program = createProgram(gl, vertexShader, fragmentShader);

// look up where the vertex data needs to go.
var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

// Create a buffer and put three 2d clip space points in it
var positionBuffer = gl.createBuffer();

// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

var positions = [
  -1, -1,
  1, -1,
  -1, 1,
 -1, 1,
 1,-1,
 1,1
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

// Clear the canvas
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Tell it to use our program (pair of shaders)
gl.useProgram(program);

// Turn on the attribute
gl.enableVertexAttribArray(positionAttributeLocation);

// Bind the position buffer.
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
var size = 2;
var type = gl.FLOAT;
var normalize = false;
var stride = 0;
var offset = 0;
gl.vertexAttribPointer(
positionAttributeLocation, size, type, normalize, stride, offset);

timeShaderUniform = gl.getUniformLocation(program, "u_time");
mousePosUniform = gl.getUniformLocation(program,"u_mouse");
resolutionUniform = gl.getUniformLocation(program,"u_resolution");

renderLoop(Date.now());
}

function renderLoop(timeStamp){
gl.uniform1f(timeShaderUniform, timeStamp/1000.0);
gl.uniform2fv(mousePosUniform,[MousePositionX,MousePositionY]);
gl.uniform2fv(resolutionUniform,innerResolution);

gl.drawArrays(gl.TRIANGLES,0,6);

window.requestAnimationFrame(renderLoop);

}

function createCanvas(fragmentShader ){
    innerFragmentShader = fragmentShader;
    showCanvas();
};
