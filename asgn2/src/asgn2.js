// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE ='uniform mat4 u_ModelMatrix; attribute vec4 a_Position; uniform mat4 u_GlobalRotateMatrix; void main() {gl_Position = u_GlobalRotateMatrix*u_ModelMatrix*a_Position;}';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;uniform vec4 u_FragColor;void main() {gl_FragColor = u_FragColor;}';

//global variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;


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
  gl.enable(gl.DEPTH_TEST);
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
  u_ModelMatrix=gl.getUniformLocation(gl.program,'u_ModelMatrix');
  if(!u_ModelMatrix){
    console.log('failed to get the storage location of u_modelmatrix');
    return;
  }

  u_GlobalRotateMatrix=gl.getUniformLocation(gl.program,'u_GlobalRotateMatrix');
  if(!u_ModelMatrix){
    console.log('failed to get the storage location of u_globalrotatematrix');
    return;
  }

  var identityM=new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix,false,identityM.elements);
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
let g_globalAngle=0;
let g_yellowAngle=0;
let g_magentaAngle=0;
let g_yellowAnimation=false;
let g_magentaAnimation=false;
//set up actions for the html ui elements
function addActionForHtmlUI(){
  document.getElementById('animationMagentaOffButton').onclick=function(){g_magentaAnimation=false};
  document.getElementById('animationMagentaOnButton').onclick=function(){g_magentaAnimation=true};
  document.getElementById('animationYellowOffButton').onclick=function(){g_yellowAnimation=false};
  document.getElementById('animationYellowOnButton').onclick=function(){g_yellowAnimation=true};
  document.getElementById('magentaSlide').addEventListener('mousemove',function(){g_magentaAngle=this.value; renderAllShapes();});
  document.getElementById('yellowSlide').addEventListener('mousemove',function(){g_yellowAngle=this.value; renderAllShapes();});
  document.getElementById('angleSlide').addEventListener('mousemove',function(){g_globalAngle=this.value; renderAllShapes();});
  //document.getElementById('segSlide').addEventListener('mouseup',function(){g_circlesSegmentCount=this.value});
} 



function main() {

  setupWebGL();
  connectVariablesToGLSL();
  addActionForHtmlUI();
  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove=function(ev){if(ev.buttons==1)click(ev)};

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1.0);

  // Clear <canvas>
  //gl.clear(gl.COLOR_BUFFER_BIT); 
  requestAnimationFrame(tick);
  //renderAllShapes();
}
var g_startTime=performance.now()/1000.0;
var g_seconds=performance.now()/1000.0-g_startTime;
function tick(){
  g_seconds=performance.now()/1000.0-g_startTime;
  updateAnimationAngles();
  renderAllShapes();
  requestAnimationFrame(tick);
}

function updateAnimationAngles(){
  if(g_yellowAnimation){
    g_yellowAngle=(45*Math.sin(g_seconds));
  }
  if(g_magentaAnimation){
    g_magentaAngle=(45*Math.sin(3*g_seconds));
  }
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
  var globalRotMat=new Matrix4().rotate(g_globalAngle,0,1,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix,false,globalRotMat.elements);

  // var len = g_shapesList.length;
  // for(var i = 0; i < len; i++) {
  //   g_shapesList[i].render();
  // }

  

  var body=new Cube();
  body.color=[1.0,0.0,0.0,1.0];
  body.matrix.translate(-.25,-0.755,0.0);
  body.matrix.rotate(-5,1,0,0);
  body.matrix.scale(0.5,0.3,0.5);
  body.render();

  var leftArm=new Cube();
  leftArm.color=[1,1,0,1];
  leftArm.matrix.setTranslate(0,-0.5,0.0);
  leftArm.matrix.rotate(-5,1,0,0);
  leftArm.matrix.rotate(-g_yellowAngle,0,0,1);
  // if(g_yellowAnimation){
  //   leftArm.matrix.rotate(45*Math.sin(g_seconds),0,0,1);
  // }
  // else{
  //   leftArm.matrix.rotate(g_yellowAngle,0,0,1);
  // }
  var yellowCoordinatesMat=new Matrix4(leftArm.matrix);
  leftArm.matrix.scale(0.25,0.7,0.5);
  leftArm.matrix.translate(-0.5,0,0);
  leftArm.render();

  //test box
  var box= new Cube();
  box.color=[1,0,1,1];
  box.matrix=yellowCoordinatesMat;
  box.matrix.translate(0,0.65,0.0);
  box.matrix.rotate(g_magentaAngle,0,0,1);
  box.matrix.scale(0.3,0.3,0.3);
  box.matrix.translate(-0.5,0,-0.001);
  box.render();


  

}