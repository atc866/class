class Camera{
    constructor(){
       this.fov = 60;
       this.eye = new Vector3([0,0,0]);
       this.at  = new Vector3([0,0,-1]);
       this.up  = new Vector3([0,1,0]);
       this.viewMat = new Matrix4();
       this.viewMat.setLookAt(
          this.eye.elements[0], this.eye.elements[1],  this.eye.elements[2],
          this.at.elements[0],  this.at.elements[1],   this.at.elements[2],
          this.up.elements[0],  this.up.elements[1],   this.up.elements[2]);
       this.projMat = new Matrix4();
       this.projMat.setPerspective(this.fov, canvas.width/canvas.height, 0.1, 1000);
    }
 
    moveForward(){
       var f = new Vector3([0,0,0]);
       f.set(this.at);
       f.sub(this.eye);
       f = f.normalize();
       f.mul(0.25); //speed
       this.at = this.at.add(f);
       this.eye = this.eye.add(f);
    }
 
    moveBack(){
       var f = new Vector3([0,0,0]);
       f.set(this.at);
       f.sub(this.eye);
       f.normalize();
       f.mul(0.25);
       this.at = this.at.sub(f);
       this.eye = this.eye.sub(f);
    }
 
    moveLeft(){
       var f = new Vector3([0,0,0]);
       f.set(this.at)
       f.sub(this.eye);
       f.normalize();
       f.mul(0.25);
       var s = Vector3.cross(this.up,f);
       this.at.add(s);
       this.eye.add(s);
    }
 
    moveRight(){
       var f = new Vector3([0,0,0]);
       f.set(this.at)
       f.sub(this.eye);
       f.normalize();
       f.mul(0.25);
       var s=Vector3.cross(f, this.up);
       this.at.add(s);
       this.eye.add(s);
    }
 
    panLeft(deg){
        var f = new Vector3([0,0,0]);
        f.set(this.at);
        f.sub(this.eye);
        var rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(deg, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        var f_prime = new Vector3([0,0,0]);
        f_prime.set(rotationMatrix.multiplyVector3(f));
        var eyecopy=new Vector3([0,0,0]);
        eyecopy.set(this.eye);
        this.at.set(eyecopy.add(f_prime));
    }
 
    panRight(deg){
       var f = new Vector3([0,0,0]);
       f.set(this.at);
       f.sub(this.eye);
       var rotationMatrix = new Matrix4();
       rotationMatrix.setRotate(-deg, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
       var f_prime = new Vector3([0,0,0]);
       f_prime.set(rotationMatrix.multiplyVector3(f));
       var eyecopy=new Vector3([0,0,0]);
       eyecopy.set(this.eye);
       this.at.set(eyecopy.add(f_prime));
    }
 }