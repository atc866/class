class Cube {
  constructor() {
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
  }

  render() {
    var rgba = this.color;

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Pass the matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    //front/back
    drawTriangle3d([0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0]);
    drawTriangle3d([0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0]);
    drawTriangle3d([0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0]);
    drawTriangle3d([0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0]);
    gl.uniform4f(u_FragColor,rgba[0] - 0.15,rgba[1] - 0.15,rgba[2] - 0.15,rgba[3]);
    // Top/bottom
    drawTriangle3d([0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0]);
    drawTriangle3d([0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0]);
    drawTriangle3d([0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0]);
    drawTriangle3d([1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0]);
    gl.uniform4f(u_FragColor,rgba[0] - 0.075,rgba[1] - 0.075,rgba[2] - 0.075,rgba[3]);
    // Left/right
    drawTriangle3d([0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0]);
    drawTriangle3d([0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0]);
    drawTriangle3d([1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0]);
    drawTriangle3d([1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0]);
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
  }
}