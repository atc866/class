class Kobe{
    constructor(){
      this.type='kobe';
      this.position=[0.0,0.0,0.0];
      this.color=[0.5,0.5,0.5,1.0];
      this.size=5.0;
      this.segments=50;
    }
    render(){
    
      var xy = this.position;
      var rgba = this.color;
      var size=this.size;
  
      // Pass the position of a point to a_Position variable
      //gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, 90/255,34/255,139/255,1.0);

        drawTriangle([0.8,0.8,0.6,0.9,0.1,0.7]);
        gl.uniform4f(u_FragColor, 1,240/255,0,1.0);
        drawTriangle([-0.8,0.8,-0.6,0.9,-0.1,0.7]);
        gl.uniform4f(u_FragColor, 90/255,34/255,139/255,1.0);
        drawTriangle([0.8,0.8,0.1,0.6,0.1,0.7]);
        gl.uniform4f(u_FragColor, 1,240/255,0,1.0);
        drawTriangle([-0.8,0.8,-0.1,0.6,-0.1,0.7]);
        gl.uniform4f(u_FragColor, 90/255,34/255,139/255,1.0);
        drawTriangle([0.8,0.7,0.1,0.5,0.7,0.55]);
        gl.uniform4f(u_FragColor, 1,240/255,0,1.0);
        drawTriangle([-0.8,0.7,-0.1,0.5,-0.7,0.55]);
        gl.uniform4f(u_FragColor, 90/255,34/255,139/255,1.0);
        drawTriangle([0.7,0.55,0.1,0.5,0.4,0.3]);
        gl.uniform4f(u_FragColor, 1,240/255,0,1.0);
        drawTriangle([-0.7,0.55,-0.1,0.5,-0.4,0.3]);
        gl.uniform4f(u_FragColor, 90/255,34/255,139/255,1.0);
        drawTriangle([0.1,0.4,0.38,0.2,0.2,-0.55]);
        gl.uniform4f(u_FragColor, 1,240/255,0,1.0);
        drawTriangle([-0.1,0.4,-0.38,0.2,-0.2,-0.55]);
        gl.uniform4f(u_FragColor, 90/255,34/255,139/255,1.0);
        drawTriangle([0.1,0.4,0.2,-0.55,0.1,-0.7]);
        gl.uniform4f(u_FragColor, 1,240/255,0,1.0);
        drawTriangle([-0.1,0.4,-0.2,-0.55,-0.1,-0.7]);
        gl.uniform4f(u_FragColor, 90/255,34/255,139/255,1.0);
        drawTriangle([-0.8,-0.2,-0.7,-0.1,-0.4,-0.2]);
        drawTriangle([-0.45,-0.2,-0.4,-0.2,-0.6,-0.7]);
        drawTriangle([-0.4,-0.2,-0.8,-0.7,-0.6,-0.7]);
        drawTriangle([-0.6,-0.6,-0.6,-0.7,-0.4,-0.7]);
        gl.uniform4f(u_FragColor, 1,240/255,0,1.0);
        drawTriangle([0.4,-0.1,0.4,-0.45,0.5,-0.45]);
       drawTriangle([0.4,-0.1,0.5,-0.1,0.5,-0.45]);
        drawTriangle([0.4,-0.45,0.4,-0.4,0.7,-0.45]);
        drawTriangle([0.4,-0.4,0.7,-0.4,0.7,-0.45]);
        drawTriangle([0.7,-0.1,0.7,-0.7,0.8,-0.7]);
        drawTriangle([0.8,-0.1,0.7,-0.1,0.8,-0.7]);
    }
  }

  
  