class Cube {
  constructor() {
    this.type='cube';
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
    this.textureNum=-2;
    this.cubeVerts = new Float32Array([
    0,0,0, 1,1,0, 1,0,0,
    0,0,0, 0,1,0, 1,1,0,
    0,0,1, 1,1,1, 1,0,1,
    0,0,1, 0,1,1, 1,1,1,
    0,1,0, 0,1,1, 1,1,1,
    0,1,0, 1,1,1, 1,1,0,
    0,0,0, 0,0,1, 1,0,1,
    0,0,0, 1,0,1, 1,0,0,
    0,0,0, 0,1,0, 0,1,1,
    0,0,0, 0,1,1, 0,0,1,
    1,0,0, 1,1,0, 1,1,1,
    1,0,0, 1,1,1, 1,0,1
    ]);
    this.uvVerts = new Float32Array([
    0,0, 1,1, 1,0,  
    0,0, 0,1, 1,1,
    1,0, 0,1, 0,0,  
    1,0, 1,1, 0,1,
    0,0, 0,1, 1,1,  
    0,0, 1,1, 1,0,
    0,1, 0,0, 1,0,  
    0,1, 1,0, 1,1,
    1,0, 1,1, 0,1,  
    1,0, 0,1, 0,0,
    0,0, 0,1, 1,1,  
    0,0, 1,1, 1,0,
    ]);
    this.norms= [
      0,0,-1, 0,0,-1, 0,0,-1,
      0,0,-1, 0,0,-1, 0,0,-1,
      0,1,0, 0,1,0, 0,1,0,
      0,1,0, 0,1,0, 0,1,0,
      1,0,0, 1,0,0, 1,0,0,
      1,0,0, 1,0,0, 1,0,0,
      -1,0,0, -1,0,0, -1,0,0,
      -1,0,0, -1,0,0, -1,0,0,
      0,-1,0, 0,-1,0, 0,-1,0,
      0,-1,0, 0,-1,0, 0,-1,0,
      0,0,1, 0,0,1, 0,0,1,
      0,0,1, 0,0,1, 0,0,1
     ];
  }

  render() {
    var rgba = this.color;
    gl.uniform1i(u_whichTexture,this.textureNum);
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Pass the matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    //front/back
    drawTriangle3DUVNormal([0,0,0 , 1,1,0, 1,0,0],[1,0 , 0,1, 0,0],[0,0,-1 ,0,0,-1, 0,0,-1]);
    drawTriangle3DUVNormal([0,0,0, 0,1,0, 1,1,0], [1,0, 1,1, 0,1], [0,0, -1,0,0, -1, 0,0, -1]);
    drawTriangle3DUVNormal([0,1,0, 0,1,1, 1,1,1], [0,0, 0,1, 1,1], [0,1,0, 0,1,0, 0,1,0]);
    drawTriangle3DUVNormal([0,1,0, 1,1,1, 1,1,0], [0,0, 1,1, 1,0], [0,1,0, 0,1,0, 0,1,0]);

    drawTriangle3DUVNormal( [1,0,0, 1,1,1, 1,1,0], [1,0, 0,1, 1,1], [1,0,0, 1,0,0, 1,0,0] );
    drawTriangle3DUVNormal( [1,0,0, 1,1,1, 1,0,1], [1,0, 0,1, 0,0], [1,0,0, 1,0,0, 1,0,0] );
    drawTriangle3DUVNormal( [0,0,0, 0,1,0, 0,0,1], [0,0, 0,1, 1,0], [-1,0,0, -1,0,0, -1,0,0] );
    drawTriangle3DUVNormal( [0,1,1, 0,1,0, 0,0,1], [1,1, 0,1, 1,0], [-1,0,0, -1,0,0, -1,0,0] );

    drawTriangle3DUVNormal([0,0,0, 0,0,1, 1,0,1], [0,0, 0,1, 1,1], [0,-1,0, 0,-1,0, 0,-1,0]);
    drawTriangle3DUVNormal([0,0,0, 1,0,1, 1,0,0], [0,0, 1,1, 1,0], [0,-1,0, 0,-1,0, 0,-1,0]);
    drawTriangle3DUVNormal( [0,0,1, 1,1,1, 1,0,1], [0,0, 1,1, 1,0], [0,0,1, 0,0,1, 0,0,1] );
    drawTriangle3DUVNormal( [0,0,1, 0,1,1, 1,1,1], [0,0, 0,1, 1,1], [0,0,1, 0,0,1, 0,0,1] );
  }
  renderfastuv() {
    var rgba = this.color;
    gl.uniform1i(u_whichTexture,this.textureNum);
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Pass the matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    //front/back
    drawTriangle3DUVNormal(this.cubeVerts, this.uvVerts,this.norms);
  }
}