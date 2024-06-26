// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE ='uniform float u_Size; attribute vec4 a_Position; void main() {gl_Position = a_Position; gl_PointSize = u_Size;}';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;uniform vec4 u_FragColor;void main() {gl_FragColor = u_FragColor;}';

//global variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = getWebGLContext(canvas,{preserveDrawingBuffer: true});
  gl.globalAlpha=0.5;
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}
function connectVariablesToGLSL(){
   // Initialize shaders
   if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  u_Size=gl.getUniformLocation(gl.program,'u_Size');
  if(!u_Size){
    console.log('Failed to get storage location of u_Size');
    return;
  }
}
const POINT=0;
const TRIANGLE=1;
const CIRCLE=2;
const KOBE=3;
//global related to UI
let g_selectedColor=[0,0,0,1.0];
let g_selectedSize=5;
let g_selectedType=POINT;
let g_circlesSegmentCount=10;
var fileuploaded;
//set up actions for the html ui elements
function addActionForHtmlUI(){
  
  document.getElementById('green').onclick=function(){g_selectedColor=[0.0,1.0,0.0,1.0]};
  document.getElementById('red').onclick=function(){g_selectedColor=[1.0,0.0,0.0,1.0]};
  document.getElementById('clearButton').onclick=function(){g_shapesList=[]; renderAllShapes();}
  document.getElementById('pointButton').onclick=function(){g_selectedType=POINT};
  document.getElementById('triButton').onclick=function(){g_selectedType=TRIANGLE};
  document.getElementById('circleButton').onclick=function(){g_selectedType=CIRCLE};
  document.getElementById('kobeButton').onclick=function(){g_selectedType=KOBE};
  document.getElementById('redSlide').addEventListener('mouseup',function(){g_selectedColor[0]=this.value/100});
  document.getElementById('greenSlide').addEventListener('mouseup',function(){g_selectedColor[1]=this.value/100});
  document.getElementById('blueSlide').addEventListener('mouseup',function(){g_selectedColor[2]=this.value/100});
  document.getElementById('sizeSlide').addEventListener('mouseup',function(){g_selectedSize=this.value;});
  document.getElementById('segSlide').addEventListener('mouseup',function(){g_circlesSegmentCount=this.value});
} 



function main() {

  setupWebGL();
  connectVariablesToGLSL();
  addActionForHtmlUI();
  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove=function(ev){if(ev.buttons==1)click(ev)};

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 0.05);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

//var g_points = [];  // The array for the position of a mouse press
//var g_colors = [];  // The array to store the color of a point
//var g_sizes=[];


var g_shapesList=[];
function click(ev) {

  // extract the event click and return webgl coordinates
  let [x,y]=convertCoordinatesEventToGL(ev);

  //store coordinates to array
  let point;
  if(g_selectedType==POINT){
    point=new Point();
  }
  else if (g_selectedType==TRIANGLE){
    point=new Triangle();
  }
  else if(g_selectedType==CIRCLE){
    point=new Circle();
    point.segments=g_circlesSegmentCount;

  }
  else{
    point=new Kobe();
  }
  point.position=[x,y];
  point.color=g_selectedColor.slice();
  point.size=g_selectedSize;
  g_shapesList.push(point);


  //g_colors.push(g_selectedColor.slice());
  //g_sizes.push(g_selectedSize);
  // Store the coordinates to g_points array
  //if (x >= 0.0 && y >= 0.0) {      // First quadrant
    //g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
 //} else if (x < 0.0 && y < 0.0) { // Third quadrant
    //g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
  //} else {                         // Others
  //  g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
 // }
  
  //draw every shape that is supposed to be on canvas
  renderAllShapes();
  
}


//extract even click and return to webgl coordinates
function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  return ([x,y]);
}

function renderAllShapes(){
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;
  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }
}