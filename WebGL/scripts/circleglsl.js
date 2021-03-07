

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
var fragmentShaderSrc = `

// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

float plot(vec2 st, float pct) {    
return  smoothstep( pct-0.02, pct, st.x)-smoothstep( pct, pct+0.02, st.x);
}

void main() {

    //normalized coords
    vec2 st = gl_FragCoord.xy/u_resolution;

    float circleDot;

    float circleDotMain = distance(st,vec2(0.5));
    circleDot =  step(0.36,circleDotMain);
    circleDot -= step(0.4,circleDotMain);

    vec3 color = vec3(1.-circleDot);

    gl_FragColor = vec4(color,1.0);
}
`
var resolution = [640,640];
var MousePositionX;
var MousePositionY;

var timeShaderUniform;
var mousePosUniform;
var resolutionUniform;

const canvas = document.querySelector('#glCanvas');
canvas.addEventListener('mousemove', e => {
MousePositionX = e.pageX/resolution[0];
MousePositionY = e.pageY/resolution[1];
});

// Initialize the GL context
const gl = canvas.getContext('webgl');
var program;

main();

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

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}
//
// Start here
//
function main() {


// If we don't have a GL context, give up now
// Only continue if WebGL is available and working

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

// code above this line is initialization code.
// code below this line is rendering code.

// Tell WebGL how to convert from clip space to pixels
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
var size = 2;          // 2 components per iteration
var type = gl.FLOAT;   // the data is 32bit floats
var normalize = false; // don't normalize the data
var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
var offset = 0;        // start at the beginning of the buffer
gl.vertexAttribPointer(
positionAttributeLocation, size, type, normalize, stride, offset);

timeShaderUniform = gl.getUniformLocation(program, "u_time");
mousePosUniform = gl.getUniformLocation(program,"u_mouse");
resolutionUniform = gl.getUniformLocation(program,"u_resolution");

renderLoop(Date.now());
}

function renderLoop(timeStamp){
// set time uniform


gl.uniform1f(timeShaderUniform, timeStamp/1000.0);
gl.uniform2fv(mousePosUniform,[MousePositionX,MousePositionY]);
gl.uniform2fv(resolutionUniform,resolution);

gl.drawArrays(gl.TRIANGLES,0,6);

// recursive invocation
window.requestAnimationFrame(renderLoop);

}

