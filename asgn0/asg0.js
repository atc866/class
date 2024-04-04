    // DrawRectangle.js
var ctx;
    function main() {
     // Retrieve <canvas> element                                  <- (1)
      var canvas = document.getElementById('example');
      if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
      }
 
   // Get the rendering context for 2DCG                          <- (2)
   ctx = canvas.getContext('2d');

   // Draw a blue rectangle                                       <- (3)
   ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a blue color
   ctx.fillRect(0, 0, 400, 400); // Fill a rectangle with the color
    handleDrawEvent();
   }
function handleDrawEvent(){
    ctx.clearRect(0,0,400,400);
    ctx.fillRect(0, 0, 400, 400);
    let v1x=Number(document.getElementById("v1x").value);
    let v1y=Number(document.getElementById("v1y").value);
    v1=new Vector3([v1x,v1y,0]);
    drawVector(v1,"red");
    //v2 vector
    let v2x=Number(document.getElementById("v2x").value);
    let v2y=Number(document.getElementById("v2y").value);
    v2=new Vector3([v2x,v2y,0]);
    drawVector(v2,"blue");
    //op
    let op=document.getElementById("op").value;
    let scalar=Number(document.getElementById("scalar").value);
    if(op==="add"){
        console.log("add");
        v3=new Vector3();
        v3.set(v1.add(v2));
        drawVector(v3,"green");
    }
    else if(op==="sub"){
        v3=new Vector3();
        v3.set(v1.sub(v2));
        drawVector(v3,"green");
    }
    else if(op==="div"){
        v3=new Vector3();
        v4=new Vector3();
        v3.set(v1.div(scalar));
        v4.set(v2.div(scalar));
        drawVector(v3,"green");
        drawVector(v4,"green");
    }
    else if(op==="mul"){
        v3=new Vector3();
        v4=new Vector3();
        v3.set(v1.mul(scalar));
        v4.set(v2.mul(scalar));
        drawVector(v3,"green");
        drawVector(v4,"green");
        
    }
    else if (op==="mag"){
        console.log("v1 magnitude:"+v1.magnitude());
        console.log("v2 magnitude:"+v2.magnitude());
    }
    else if(op==="norm"){
        drawVector(v1.normalize(),"green");
        drawVector(v2.normalize(),"green");
    }
    else if(op=="angbtwn"){
        console.log("Angle:"+angleBetween(v1,v2));
    }
}
function drawVector(v,color){
    ctx.strokeStyle=color;
    ctx.beginPath();
    ctx.moveTo(200,200);
    ctx.lineTo(200+v.elements[0]*20,200-v.elements[1]*20);
    ctx.stroke();
}
function angleBetween(vec1,vec2){
    //get angle between from formula then convert to raddians
    return (Math.acos(Vector3.dot(vec1,vec2)/(vec1.magnitude()*vec2.magnitude()))*(180/Math.PI));
}