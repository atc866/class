//mainly taken from circle.js
class Cone {
    constructor() {
      this.type='cone';
      this.color=[1.0, 1.0, 1.0, 1.0];
      this.segments=12;
      this.matrix=new Matrix4();
    }
  
    render() {
        var rgba=this.color;
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        let angleStep=360/this.segments;
        for (var angle=0; angle<360; angle=angle+angleStep) {
            let centerPt=[0,0,0];
            let angle1=angle;
            let angle2=angle+angleStep;
            let vec1=[Math.cos(angle1*Math.PI/180)*.5, Math.sin(angle1*Math.PI/180)*.5];
            let vec2=[Math.cos(angle2*Math.PI/180)*.5, Math.sin(angle2*Math.PI/180)*.5];
            let pt1=[centerPt[0]+vec1[0], centerPt[1]+vec1[1]];
            let pt2=[centerPt[0]+vec2[0], centerPt[1]+vec2[1]];
            gl.uniform4f(u_FragColor, rgba[0]-angle/900, rgba[1]-angle/900, rgba[2]-angle/900, rgba[3]-angle/900);
            drawTriangle3d([0,0,0,pt1[0],pt1[1],0,pt2[0],pt2[1],0]);
            drawTriangle3d([pt2[0],pt2[1],0, pt1[0],pt1[1],0, 0,0,1]);
        }
    } 
}