// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
'precision mediump float; attribute vec2 a_UV; varying vec2 v_UV; uniform mat4 u_ViewMatrix; uniform mat4 u_ProjectionMatrix; uniform mat4 u_ModelMatrix; attribute vec4 a_Position; uniform mat4 u_GlobalRotateMatrix; void main() {gl_Position = u_GlobalRotateMatrix*u_ModelMatrix*a_Position; v_UV=a_UV;}';

// Fragment shader program
var FSHADER_SOURCE ='precision mediump float;varying vec2 v_UV;uniform vec4 u_FragColor; uniform sampler2D u_Sampler0; void main() {gl_FragColor = u_FragColor; gl_FragColor=vec4(v_UV,1.0,1.0); gl_FragColor=texture2D(u_Sampler0,v_UV);}';
//global variables
let canvas;
let gl;
let a_UV;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;


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
  a_UV=gl.getAttribLocation(gl.program,'a_UV');
  if(a_UV<0){
    console.log('failed to get storage location of a_UV')
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
  var u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler');
    return false;
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
let g_leg1angle=0;
let g_leg2angle=0;
let g_yellowAnimation=true;
let g_magentaAnimation=true;
let g_globalXAngle=0;
let g_globalYAngle=0;
let g_globalZAngle=0;
let g_origin=[0,0];
let g_wing1angle=0;
let g_wing2angle=0;
let g_feet1angle=0;
let g_feet2angle=0;
let g_s1angle=0;
let g_s2angle=0;
let g_hatangle=0;
let g_hatanimation=true;
let g_wing1animation=false;
let g_wing2animation=false;
//set up actions for the html ui elements
function addActionForHtmlUI(){
  document.getElementById('animationMagentaOffButton').onclick=function(){g_magentaAnimation=false};
  document.getElementById('animationMagentaOnButton').onclick=function(){g_magentaAnimation=true};
  document.getElementById('animationYellowOffButton').onclick=function(){g_yellowAnimation=false};
  document.getElementById('animationYellowOnButton').onclick=function(){g_yellowAnimation=true};
  document.getElementById('animationwing1OnButton').onclick=function(){g_wing1animation=true};
  document.getElementById('animationwing1OffButton').onclick=function(){g_wing1animation=false};
  document.getElementById('animationwing2OnButton').onclick=function(){g_wing2animation=true};
  document.getElementById('animationwing2OffButton').onclick=function(){g_wing2animation=false};
  document.getElementById('animationhatOnButton').onclick=function(){g_hatanimation=true};
  document.getElementById('animationhatOffButton').onclick=function(){g_hatanimation=false};
  document.getElementById('magentaSlide').addEventListener('mousemove',function(){g_leg2angle=this.value; renderAllShapes();});
  document.getElementById('yellowSlide').addEventListener('mousemove',function(){g_leg1angle=this.value; renderAllShapes();});
  document.getElementById('wing1Slide').addEventListener('mousemove',function(){g_wing1angle=this.value; renderAllShapes();});
  document.getElementById('wing2Slide').addEventListener('mousemove',function(){g_wing2angle=this.value; renderAllShapes();});
  document.getElementById('feet1Slide').addEventListener('mousemove',function(){g_feet1angle=this.value; renderAllShapes();});
  document.getElementById('feet2Slide').addEventListener('mousemove',function(){g_feet2angle=this.value; renderAllShapes();});
  document.getElementById('s1Slide').addEventListener('mousemove',function(){g_s1angle=this.value; renderAllShapes();});
  document.getElementById('s2Slide').addEventListener('mousemove',function(){g_s2angle=this.value; renderAllShapes();});
  document.getElementById('hatSlide').addEventListener('mousemove',function(){g_hatangle=this.value; renderAllShapes();});
  document.getElementById('angleSlide').addEventListener('mousemove',function(){g_globalAngle=this.value; renderAllShapes();});
  //document.getElementById('segSlide').addEventListener('mouseup',function(){g_circlesSegmentCount=this.value});
} 
function initTextures() {

  // Get the storage location of u_Sampler
  var image = new Image();  // Create the image object
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image.onload = function(){ sendTextureToGLSL(image); };
  // Tell the browser to load an image
  image.src = '../sky.jpg';
  //add more textures here later
  return true;
}

function sendTextureToGLSL(image) {
  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler, 0);
  
  //gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
}

//performancce optimization stuff taken from hall of fame
//https://people.ucsc.edu/~adion/Andre_Dion_Assignment_2/asg2.html
function setupBuffer(){
  vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
}

function setUpWebGL() {
    canvas = document.getElementById('webgl');
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}


function main() {

  setUpWebGL();
  setupBuffer();
  connectVariablesToGLSL();
  addActionForHtmlUI();
  initTextures();
  // Register function (event handler) to be called on a mouse press
  canvas.onclick=function(ev){if(ev.shiftKey){
    console.log("pressed shift")
    g_wing1animation=true;
    g_wing2animation=true;
  }};
  canvas.onmousedown = origin;
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
    g_leg1angle=(45*Math.sin(5*g_seconds));
  }
  if(g_magentaAnimation){
    g_leg2angle=(-45*Math.sin(5*g_seconds));
  }
  if(g_wing1animation){
    g_wing1angle=(25*Math.sin(5*g_seconds)+20);
  }
  if(g_wing2animation){
    g_wing2angle=(25*Math.sin(5*g_seconds)+20);
  }
  if(g_hatanimation){
    g_hatangle=(90*g_seconds);
  }
}

//var g_points = [];  // The array for the position of a mouse press
//var g_colors = [];  // The array to store the color of a point
//var g_sizes=[];


//var g_shapesList=[];\


//camaera stuff with mouse taken from https://people.ucsc.edu/~jrgu/asg2/blockyAnimal/BlockyAnimal.html in halloffame
function origin(ev) {
  var x = ev.clientX;
  var y = ev.clientY;
  g_origin = [x, y];
}

function click(ev) {
  
  // extract the event click and return webgl coordinates
  let [x,y]=convertCoordinatesEventToGL(ev);
  g_globalXAngle=g_globalXAngle-x*360
  g_globalYAngle=g_globalYAngle-y*360
  renderAllShapes();
  }
  


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
  //renderAllShapes();


//extract even click and return to webgl coordinates
function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  let temp = [x,y];
  x = (x - g_origin[0])/400;
  y = (y - g_origin[1])/400;
  g_origin = temp;
  return([x,y])
}

function renderAllShapes(){
  var startTime = performance.now();
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  var globalRotMat=new Matrix4().rotate(g_globalAngle,0,1,0);
  globalRotMat.rotate(g_globalXAngle,0,1,0);
  globalRotMat.rotate(-g_globalYAngle,1,0,0);
  globalRotMat.rotate(g_globalZAngle,0,0,1);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix,false,globalRotMat.elements);

  // var len = g_shapesList.length;
  // for(var i = 0; i < len; i++) {
  //   g_shapesList[i].render();
  // }

  

  var body=new Cube();
  body.color=[1,1,1,1.0];
  body.matrix.translate(-.25,-0.4,0.0);
  //body.matrix.rotate(-5,1,0,0);
  body.matrix.scale(0.5,0.4,0.4);
  body.render();

  var head=new Cube();
  head.color=[1,1,1,1.0];
  head.matrix.translate(-0.35,-0.15,0.08);
  head.matrix.scale(0.2,0.4,0.25);
  head.render();

  var eye1=new Cube();
  eye1.color=[0,0,0,1]
  eye1.matrix.translate(-0.353,0.1,0.07);
  eye1.matrix.scale(0.105,0.1,0.1);
  eye1.render();

  var eye2=new Cube();
  eye2.color=[0,0,0,1]
  eye2.matrix.translate(-0.353,0.1,0.25);
  eye2.matrix.scale(0.105,0.1,0.1);
  eye2.render();

  var beak=new Cube();
  beak.color=[238/255,210/255,2/255,1]
  beak.matrix.translate(-0.45,-0.05,0.08);
  beak.matrix.scale(0.1,0.15,0.25);
  beak.render();

  var redthing=new Cube();
  redthing.color=[1,0,0,1];
  redthing.matrix.translate(-0.45,-0.15,0.15);
  redthing.matrix.scale(0.1,0.1,0.1);
  redthing.render();

  var wing1=new Cube();
  wing1.color=[1,1,1,1.0];
  wing1.matrix.rotate(180,1,0,0);
  wing1.matrix.translate(-.2,0,0);
  wing1.matrix.rotate(g_wing1angle,1,0,0);
  wing1.matrix.scale(0.4,0.3,0.05);
  wing1.render();
  var wing2=new Cube();
  wing2.color=[1,1,1,1.0];
  wing2.matrix.rotate(180,1,0,0);
  wing2.matrix.rotate(180,0,1,0);
  wing2.matrix.translate(-.2,0,0.4);
  wing2.matrix.rotate(g_wing2angle,1,0,0);
  wing2.matrix.scale(0.4,0.3,0.05);
  wing2.render();

  var leg1=new Cube();
  leg1.color=[241/255,235/255,156/255,1];
  leg1.matrix.translate(0.05,-0.4,0.05);
  leg1.matrix.rotate(180,0,0,1);
  leg1.matrix.rotate(-g_leg1angle,0,0,1);
  var leg1mat=new Matrix4(leg1.matrix);
  leg1.matrix.scale(0.05,0.25,0.04);
  leg1.render();
  var leg2=new Cube();
  leg2.color=[241/255,235/255,156/255,1];
  leg2.matrix.translate(0.05,-0.4,0.3);
  leg2.matrix.rotate(180,0,0,1);
  leg2.matrix.rotate(-g_leg2angle,0,0,1);
  var leg2mat=new Matrix4(leg2.matrix);
  leg2.matrix.scale(0.05,0.25,0.04);
  leg2.render();

  var feet1=new Cube();
  feet1.color=[241/255,235/255,156/255,1];
  feet1.matrix=leg1mat;
  feet1.matrix.translate(0,0.25,-0.02);
  feet1.matrix.rotate(-g_feet1angle,0,0,1);
  //body.matrix.rotate(-5,1,0,0);
  var feet1mat=new Matrix4(feet1.matrix);
  feet1.matrix.scale(0.1,0.01,0.1);
  feet1.render();
  var feet2=new Cube();
  feet2.color=[241/255,235/255,156/255,1];
  feet2.matrix=leg2mat;
  feet2.matrix.translate(0,0.25,-0.02);
  feet2.matrix.rotate(-g_feet2angle,0,0,1);
  var feet2mat=new Matrix4(feet2.matrix);
  //body.matrix.rotate(-5,1,0,0);
  feet2.matrix.scale(0.1,0.01,0.1);
  feet2.render();
  
  var hat=new Cone();
  hat.color = [228/255,211/255,46/255,1];
  hat.matrix.translate(-0.25, 0.25, 0.2);
  hat.matrix.scale(0.6,0.2,0.6);
  hat.matrix.rotate(270,1,0,0);
  hat.matrix.rotate(g_hatangle,0,0,1);
  hat.render();


  var heelthing=new Cone();
  heelthing.color=[0.5,0.5,0.5,1];
  heelthing.matrix=feet2mat;
  heelthing.matrix.translate(0.05, 0.01, 0.05);
  heelthing.matrix.scale(0.05,0.25,0.05);
  heelthing.matrix.rotate(270,1,0,0);
  heelthing.matrix.rotate(g_s1angle,0,1,0);
  heelthing.render();

  var h=new Cone();
  h.color=[0.5,0.5,0.5,1];
  h.matrix=feet1mat;
  h.matrix.translate(0.05, 0.01, 0.05);
  h.matrix.scale(0.05,0.25,0.05);
  h.matrix.rotate(270,1,0,0);
  h.matrix.rotate(g_s2angle,0,1,0);
  h.render();


  var duration = performance.now() - startTime;
  sentTextToHTML("ms: " + Math.floor(duration) + " fps: " + Math.floor(1000/duration), "numdot");


  

}
//source from https://people.ucsc.edu/~adion/Andre_Dion_Assignment_2/asg2.html
function sentTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if(!htmlElm) {
      console.log("Failed to get " + htmlID + "from HTML");
      return;
  }
  htmlElm.innerHTML = text;
}