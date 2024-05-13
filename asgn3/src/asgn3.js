// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
'precision mediump float; attribute vec2 a_UV; varying vec2 v_UV; uniform mat4 u_ViewMatrix; uniform mat4 u_ProjectionMatrix; uniform mat4 u_ModelMatrix; attribute vec4 a_Position; uniform mat4 u_GlobalRotateMatrix; void main() {gl_Position = u_ProjectionMatrix*u_ViewMatrix*u_GlobalRotateMatrix*u_ModelMatrix*a_Position; v_UV=a_UV;}';

// Fragment shader program
var FSHADER_SOURCE ='precision mediump float;varying vec2 v_UV;uniform vec4 u_FragColor; uniform sampler2D u_Sampler0; uniform sampler2D u_Sampler1; uniform sampler2D u_Sampler2;uniform sampler2D u_Sampler3;uniform sampler2D u_Sampler4;uniform int u_whichTexture; void main() {if(u_whichTexture==-2){gl_FragColor=u_FragColor;}else if (u_whichTexture==-1){gl_FragColor=vec4(v_UV,1.0,1.0);}else if (u_whichTexture==0){gl_FragColor=texture2D(u_Sampler0,v_UV);}else if (u_whichTexture==1){gl_FragColor=texture2D(u_Sampler1,v_UV);}else if (u_whichTexture==2){gl_FragColor=texture2D(u_Sampler2,v_UV);}else if (u_whichTexture==3){gl_FragColor=texture2D(u_Sampler3,v_UV);}else if (u_whichTexture==4){gl_FragColor=texture2D(u_Sampler4,v_UV);} else{gl_FragColor=vec4(1,0.2,0.2,1);}}';
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
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;
let u_Sampler4;
let u_whichTexture;
let u_ProjectionMatrix;
let u_ViewMatrix;
let dlplaying=false;
let wlrplaying=false;
let yahplaying=false;
let mollyplaying=false;
let manyplaying=false;
let musicplaying=false;
let longtime=new Audio("../longtime.mp3");
let iluihu=new Audio("../iloveuihateu.mp3");
let yah=new Audio("../yahmean.mp3");
let molly=new Audio("../molly.mp3");
let many=new Audio("../2many.mp3")
let music=new Audio("../2024.mp3");
let globalaudio=0.3;


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
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler');
    return false;
  }
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler');
    return false;
  }
  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler');
    return false;
  }
  u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
  if (!u_Sampler3) {
    console.log('Failed to get the storage location of u_Sampler');
    return false;
  }
  u_Sampler4 = gl.getUniformLocation(gl.program, 'u_Sampler4');
  if (!u_Sampler4) {
    console.log('Failed to get the storage location of u_Sampler');
    return false;
  }
  u_whichTexture=gl.getUniformLocation(gl.program,'u_whichTexture');
  if(!u_whichTexture){
    console.log('failed to get storage location of whichtextre');
    return;
  }
  u_ViewMatrix=gl.getUniformLocation(gl.program,'u_ViewMatrix');
  if(!u_ViewMatrix){
    console.log('failed to get storage location of viewmatrix');
    return;
  }
  u_ProjectionMatrix=gl.getUniformLocation(gl.program,'u_ProjectionMatrix');
  if(!u_ProjectionMatrix){
    console.log('failed to get storage location of projectionmatrix');
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
  document.getElementById('sound').addEventListener('change',function(){globalaudio=this.value/100;
    longtime.volume=globalaudio;
    iluihu.volume=globalaudio;
    yah.volume=globalaudio;
    molly.volume=globalaudio;
    many.volume=globalaudio;
    music.volume=globalaudio;
    console.log(globalaudio);
  });
 
  //document.getElementById('segSlide').addEventListener('mouseup',function(){g_circlesSegmentCount=this.value});
} 
function initTextures() {

  // Get the storage location of u_Sampler
  var image = new Image();  // Create the image object
  var wlr=new Image();
  var dl=new Image();
  var st=new Image();
  var m=new Image();
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  if(!wlr){
    console.log("failed to create the image object");
    return false;
  }
  if (!dl) {
    console.log('Failed to create the image object');
    return false;
  }
  if(!st){
    console.log("failed to create the image object");
    return false;
  }
  if (!m) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image.onload = function(){ sendTextureToGLSL(image);};
  wlr.onload=function(){sendTextureToGLSL1(wlr);};
  dl.onload=function(){sendTextureToGLSL2(dl);};
  st.onload=function(){sendTextureToGLSL3(st);};
  m.onload=function(){sendTextureToGLSL4(m);};

  // Tell the browser to load an image
  image.src = '../sky.jpg';
  //add more textures here later
  wlr.src='../wlrcover.jpg';
  dl.src='../dielit.jpg';
  st.src='../selftitled.jpg';
  m.src='../music.jpg';
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
  gl.uniform1i(u_Sampler0, 0);
  
  //gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
}

function sendTextureToGLSL1(image) {
  var texture1 = gl.createTexture();   // Create a texture object
  if (!texture1) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE1);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture1);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler1, 1);
  console.log("texture1");
  
  //gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
}
function sendTextureToGLSL2(image) {
  var texture2 = gl.createTexture();   // Create a texture object
  if (!texture2) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE2);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture2);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler2, 2);
  console.log("texture2");
  
  //gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
}
function sendTextureToGLSL3(image) {
  var texture3 = gl.createTexture();   // Create a texture object
  if (!texture3) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE3);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture3);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler3, 3);
  console.log("texture3");
  
  //gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
}
function sendTextureToGLSL4(image) {
  var texture4 = gl.createTexture();   // Create a texture object
  if (!texture4) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE4);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture4);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler4, 4);
  console.log("texture4");
  
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
function mouseclick(ev){
  var x = Math.round(camera.eye.elements[0]);
  var y = Math.round(camera.eye.elements[1]);
  var z = Math.round(camera.eye.elements[2]);
  //console.log(x);
  //console.log(y);
  //console.log(z);
  if(ev.buttons==1){
    console.log(x,y,z);
      if(x < 16 && x >= -16  &&y==0&& z < 4 && z >= -28) {
        //console.log("existing block: " + this.blocks[x][y][z]);
        g_map[x+16][z+27]=0;
        console.log("delete");
        if(x+16==16 && z+27==3 && y==0){
          if(dlplaying==false){
            longtime.play();
            longtime.volume=globalaudio;
            dlplaying=true;
          }
        }
        if(x+16==26 && z+27==3 && y==0){
          if(wlrplaying==false){
            iluihu.volume=globalaudio;
            iluihu.play();
            wlrplaying=true;
          }
        }
        if(x+16==5 && z+27==3&& y==0){
          if(yahplaying==false){
            yah.volume=globalaudio;
            yah.play();
            yahplaying=true;
          }
        }

        if(x+16==4 && z+27==8&& y==0){
          if(mollyplaying==false){
            molly.volume=globalaudio;
            molly.play();
            mollyplaying=true;
          }
        }
        if(x+16==12 && z+27==6&& y==0){
          if(manyplaying==false){
            many.volume=globalaudio;
            many.play();
            manyplaying=true;
          }
        }
        if(x+16==25 && z+27==15&& y==0){
          if(musicplaying==false){
            music.volume=globalaudio;
            music.play();
            musicplaying=true;
          }
        }
       
        
        //console.log("after block: " + this.blocks[x][y][z]);
      }  
      if(x < 16 && x >= -16 &&y!=0&& z < 4 && z >= -28){
        console.log(g_builtblocks);
        console.log('delete please');
        g_builtblocks.splice(g_builtblocks.indexOf([x,y,z],1));
      }
      console.log(g_builtblocks);
  }  
  if(ev.buttons==2){
    console.log("rightlcick")
    console.log(x,y,z);
      if(x < 16 && x >= -16 &&y==0&& z < 4 && z >= -28) {
        //console.log("existing block: " + this.blocks[x][y][z]);
        g_map[x+16][z+27]=1;
        if(x+16==16 && z+27==3&& y==0){
          if(dlplaying==true){
            longtime.volume=globalaudio;
            longtime.pause();
            dlplaying=false;
          }
        }
        if(x+16==26 && z+27==3&& y==0){
          if(wlrplaying==true){
            iluihu.volume=globalaudio;
            iluihu.pause();
            wlrplaying=false;
          }
        }
        if(x+16==5 && z+27==3&& y==0){
          if(yahplaying==true){
            yah.volume=globalaudio;
            yah.pause();
            yahplaying=false;
          }
        }
        if(x+16==4 && z+27==8&& y==0){
          if(mollyplaying==true){
            molly.volume=globalaudio;
            molly.pause();
            mollyplaying=false;
          }
        }
        if(x+16==12 && z+27==6&& y==0){
          if(manyplaying==true){
            many.volume=globalaudio;
            many.pause();
            manyplaying=false;
          }
        }
        if(x+16==25 && z+27==15&& y==0){
          if(musicplaying==true){
            music.volume=globalaudio;
            music.pause();
            musicplaying=false;
          }
        }
        //console.log("after block: " + this.blocks[x][y][z]);
      }    
      if(x < 16 && x >= -16 &&y!=0&& z < 4 && z >= -28){
        g_builtblocks.push([x,y,z]);
      }
      console.log(g_builtblocks);
      console.log("BUILD");
}
};

function main() {

  setUpWebGL();
  setupBuffer();
  connectVariablesToGLSL();
  addActionForHtmlUI();
  camera=new Camera();
  document.onkeydown = keydown;
  document.onkeyup = keyup;
  initTextures();
  //document.addEventListener('mousedown', mouseclick);
  // Register function (event handler) to be called on a mouse press
  canvas.addEventListener('mousedown',mouseclick);
  //canvas.addEventListener('contextmenu', mouseclick);
  canvas.onmousemove = function (ev) { 
    if (ev.buttons == 1) {
      freecam(ev, 1);
      console.log(1);
    }
    else {
      if (firstCoords[0] != 2) {
        prevCords = [0, 0];
        firstCoords = [2, 2];
      }
    }
  };
  window.oncontextmenu = function () {return false; }
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
  updateCameraPositon();
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


var firstCoords = [2, 2];
var prevCords = [0, 0];
//from hall of fame https://people.ucsc.edu/~jkohls/pa3/virtualWorld.html
function freecam(ev) {
  let [x, y] = CoordinatesEconvertventToGL(ev);

  if (firstCoords[0] == 2) {
    firstCoords = [x, y];
    prevCords[0] = x;
    prevCords[1] = y;
  }

  if (prevCords[0] < x) {
    //console.log("x increase");
    camera.panRight(Math.abs(prevCords[0] - x) * 60);
    current_dir_x = 1;
  } else if (prevCords[0] > x) {
    current_dir_x = 2;
    camera.panLeft(Math.abs(prevCords[0] - x) * 60);
    //console.log("x decrease");
  }

  if (prevCords[1] < y) {
    camera.panUp(Math.abs(prevCords[1] - y));
    current_dir_y = 1;
  } else if (prevCords[1] > y) {
    current_dir_y = 2;
    //console.log("y decrease");
    camera.panDown(Math.abs(prevCords[1] - y));
  }
  prevCords[0] = x;
  prevCords[1] = y;

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
function CoordinatesEconvertventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
  return([x,y])
}

//smooth camera movement from hall of fame
//https://people.ucsc.edu/~jkohls/pa3/virtualWorld.html
let g_key_w = 0;
let g_key_s = 0;
let g_key_a = 0;
let g_key_d = 0;
let g_key_up = 0;
let g_key_down = 0;
let g_key_left = 0;
let g_key_right = 0;
let g_key_q = 0;
let g_key_e = 0;

function keydown(ev) {

  if (ev.keyCode == 87) { g_key_w = 1; }      // w
  if (ev.keyCode == 83) { g_key_s = 1; }      // s
  if (ev.keyCode == 65) { g_key_a = 1; }      // a
  if (ev.keyCode == 68) { g_key_d = 1; }      // d

  if (ev.keyCode == 38) { g_key_up = 1; }     // uparrow
  if (ev.keyCode == 40) { g_key_down = 1; }   // down arrow
  if (ev.keyCode == 37) { g_key_left = 1; }   // left arrow
  if (ev.keyCode == 39) { g_key_right = 1; }  // right arrow

  if (ev.keyCode == 81) { g_key_q = 1; }      // q
  if (ev.keyCode == 69) { g_key_e = 1; }      // e
}

function keyup(ev) {

  if (ev.keyCode == 87) { g_key_w = 0; }
  if (ev.keyCode == 83) { g_key_s = 0; }
  if (ev.keyCode == 65) { g_key_a = 0; }
  if (ev.keyCode == 68) { g_key_d = 0; }

  if (ev.keyCode == 38) { g_key_up = 0; }
  if (ev.keyCode == 40) { g_key_down = 0; }
  if (ev.keyCode == 37) { g_key_left = 0; }
  if (ev.keyCode == 39) { g_key_right = 0; }

  if (ev.keyCode == 81) { g_key_q = 0; }      // q
  if (ev.keyCode == 69) { g_key_e = 0; }      // e

}
function updateCameraPositon() {
    if (g_key_w == 1) { camera.moveForward(); }
    if (g_key_s == 1) { camera.moveBack(); }
    if (g_key_a == 1) { camera.moveLeft(); }
    if (g_key_d == 1) { camera.moveRight(); }
    if (g_key_up == 1) { camera.moveForward(); }
    if (g_key_down == 1) { camera.moveBack(); }
    if (g_key_left == 1) { camera.moveLeft(); }
    if (g_key_right == 1) { camera.moveRight(); }
    if (g_key_q == 1) { camera.panLeft(5); }
    if (g_key_e == 1) { camera.panRight(5); }
}
var g_eye=[0,0,3];
var g_at=[0,0,-100];
var g_up=[0,1,0];
var camera;
//idea of having array of builtblocks form https://people.ucsc.edu/~jwdicker/Asgn3/BlockyWorld.html
var g_builtblocks=[];
var g_map=[
   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]
function drawMap(){
  //var map=new Cube();
  for(i=0;i<2;i++){
    for(x=0;x<32;x++){
      for(y=0;y<32;y++){
        if(g_map[x][y]==1 && x==16 && y==3){
          var map=new Cube();
          map.color=[1.0,0.0,0.0,1.0];
          map.textureNum=2;
          map.matrix.translate(x-16.5,-0.5,y-28);
          map.renderfastuv();
        }
        else if(g_map[x][y]==1 && x==26 && y==3){
          var map=new Cube();
          map.color=[1.0,0.0,0.0,1.0];
          map.textureNum=1;
          map.matrix.translate(x-16.5,-0.5,y-28);
          map.renderfastuv();
        }
        else if(g_map[x][y]==1 && x==5 && y==3){
          var map=new Cube();
          map.color=[1.0,0.0,0.0,1.0];
          map.textureNum=3;
          map.matrix.translate(x-16.5,-0.5,y-28);
          map.renderfastuv();
        }
        else if(g_map[x][y]==1){
          var map=new Cube();
          map.color=[1.0,0.0,0.0,1.0];
          map.textureNum=4;
          map.matrix.translate(x-16.5,-0.5,y-28);
          map.renderfastuv();
        }
      }
    }
  }
  for(j=0;j<g_builtblocks.length;j++){
    var map=new Cube();
    map.color=[1.0,0.0,0.0,1.0];
    map.textureNum=4;
    //console.log(type(g_builtblocks[j].elements[1]));
    map.matrix.translate(g_builtblocks[j][0]-0.5,-0.5+g_builtblocks[j][1],g_builtblocks[j][2]-0.5);
    map.renderfastuv();
  }
}
function renderAllShapes(){
  var startTime = performance.now();
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  var globalRotMat=new Matrix4().rotate(g_globalAngle,0,1,0);
  globalRotMat.rotate(g_globalXAngle,0,1,0);
  globalRotMat.rotate(-g_globalYAngle,1,0,0);
  globalRotMat.rotate(g_globalZAngle,0,0,1);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix,false,globalRotMat.elements);

  var projMat=camera.projMat;
  gl.uniformMatrix4fv(u_ProjectionMatrix,false,projMat.elements);

  var viewMat=new Matrix4();
  viewMat.setLookAt(camera.eye.elements[0], camera.eye.elements[1], camera.eye.elements[2],
    camera.at.elements[0], camera.at.elements[1], camera.at.elements[2],
    camera.up.elements[0], camera.up.elements[1], camera.up.elements[2]);
  gl.uniformMatrix4fv(u_ViewMatrix,false,viewMat.elements);

  // var len = g_shapesList.length;
  // for(var i = 0; i < len; i++) {
  //   g_shapesList[i].render();
  // }

  
  var floor=new Cube();
  floor.color=[1.0,0.0,0.0,1.0];
  floor.textureNum=-1;
  floor.matrix.translate(-16,-0.5,-29);
  floor.matrix.scale(50,0,50);
  floor.render();

  var sky=new Cube();
  sky.color=[1.0,0.0,0.0,1.0];
  sky.textureNum=0;
  sky.matrix.translate(-16,-5,-29);
  sky.matrix.scale(50,50,50);
  sky.render();
  drawMap();
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