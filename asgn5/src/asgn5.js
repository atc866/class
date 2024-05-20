import * as THREE from 'three';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
function main() {

    const canvas = document.querySelector( '#c' );
    const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

    const fov = 75;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.x=0;
    camera.position.y=10;
    camera.position.z=20;
    class ColorGUIHelper {
      constructor(object, prop) {
        this.object = object;
        this.prop = prop;
      }
      get value() {
        return `#${this.object[this.prop].getHexString()}`;
      }
      set value(hexString) {
        this.object[this.prop].set(hexString);
      }
    }
    class MinMaxGUIHelper {
      constructor(obj, minProp, maxProp, minDif) {
        this.obj = obj;
        this.minProp = minProp;
        this.maxProp = maxProp;
        this.minDif = minDif;
      }
      get min() {
        return this.obj[this.minProp];
      }
      set min(v) {
        this.obj[this.minProp] = v;
        this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
      }
      get max() {
        return this.obj[this.maxProp];
      }
      set max(v) {
        this.obj[this.maxProp] = v;
        this.min = this.min;  // this will call the min setter
      }
    }

    function updateCamera() {
      camera.updateProjectionMatrix();
    }
     
    const gui = new GUI();
    gui.add(camera, 'fov', 1, 180).onChange(updateCamera);
    const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
    gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera);
    gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far').onChange(updateCamera);
    const controls = new OrbitControls( camera, canvas );
    controls.target.set(0,0,0);
    controls.update();
    const scene = new THREE.Scene();
    //scene.background=new THREE.Color('black');
    //cube texture stuff
    const loader=new THREE.TextureLoader();
    function loadColorTexture( path ) {
        const texture = loader.load( path );
        texture.colorSpace = THREE.SRGBColorSpace;
        return texture;
      }
    const materials = [
        new THREE.MeshBasicMaterial({map: loadColorTexture('../resources/1.jpg')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('../resources/2.jpg')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('../resources/3.jpg')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('../resources/4.jpg')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('../resources/5.jpg')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('../resources/6.jpg')}),
      ];
    //cube stuff
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );

    function makeInstance(geometry, materials, x,y,z) {

       
        const cube = new THREE.Mesh(geometry, materials);
        scene.add(cube);
       
        cube.position.x = x;
        cube.position.y=y;
        cube.position.z=z;

       
        return cube;
    }
    const cubes = [
        makeInstance(geometry, materials,  0,1,1),
    ];
    
    //sphere stuff
    const geometrysphere = new THREE.SphereGeometry( 1, 16, 32 ); 
    function makeInstanceSphere(geometry, color, x,y,z) {
        const material = new THREE.MeshPhongMaterial({color});
        
        const sphere= new THREE.Mesh(geometry, material);
        scene.add(sphere);
       
        sphere.position.x = x;
        sphere.position.y=y;
        sphere.position.z=z;
       
        return sphere;
    }
    const spheres=[makeInstanceSphere(geometrysphere,0xffff00,-3,1,1)];
    //cone stuff
    const geometrycone=new THREE.ConeGeometry(1,1,32,1);
    function makeInstanceCone(geometry, color, x,y,z) {
        const material = new THREE.MeshPhongMaterial({color});
        
        const cone= new THREE.Mesh(geometry, material);
        scene.add(cone);
       
        cone.position.x = x;
        cone.position.y=y;
        cone.position.z=z;
       
        return cone;
    }
    const cones=[makeInstanceCone(geometrycone,0xff00a4,3,1,1)];
//importing 3d model
const mtlLoader = new MTLLoader();
const objLoader= new OBJLoader();
mtlLoader.load('../resources/cup_of_tea.mtl', (mtl) => {
  mtl.preload();
  objLoader.setMaterials(mtl);
  objLoader.load('../resources/cup_of_tea.obj', (object) => {
    object.position.x=5;
    object.position.y=1;
    object.position.z=1
    scene.add(object);
  });
});
//build house thing?
var housething=
[[1,1,1,1,0],
[1,0,0,0,0],
[1,0,0,0,0],
[1,0,0,0,0],
[1,0,0,0,0],
[1,0,0,0,0],
[1,0,0,0,0],
[1,0,0,0,0],
[1,0,0,0,0],
[1,0,0,0,0],
[1,0,0,0,0],
[1,0,0,0,0],
[1,0,0,0,0],
[1,0,0,0,0],
[1,0,0,0,0],
[1,0,0,0,0],
[1,0,0,0,0],
[1,0,0,0,0],
[1,0,0,0,0],
[1,1,1,1,0]]

var musicmaterialthing=[new THREE.MeshPhongMaterial({map: loadColorTexture('../resources/music.jpg')}),
        new THREE.MeshPhongMaterial({map: loadColorTexture('../resources/music.jpg')}),
        new THREE.MeshPhongMaterial({map: loadColorTexture('../resources/music.jpg')}),
        new THREE.MeshPhongMaterial({map: loadColorTexture('../resources/music.jpg')}),
        new THREE.MeshPhongMaterial({map: loadColorTexture('../resources/music.jpg')}),
        new THREE.MeshPhongMaterial({map: loadColorTexture('../resources/music.jpg')}),];
for(let height=0;height<5;height++){
  for(let x=0;x<20;x++){
    for(let y=0;y<5;y++){
      if(housething[x][y]==1){
        makeInstance(geometry,musicmaterialthing,x-8,height,y-3);
      }
    }
  }
}

//plane thing?
  {

    const planeSize = 40;
    const loaderplane = new THREE.TextureLoader();
    const textureplane = loaderplane.load('../resources/checker.png');
    textureplane.wrapS = THREE.RepeatWrapping;
    textureplane.wrapT = THREE.RepeatWrapping;
    textureplane.magFilter = THREE.NearestFilter;
    textureplane.colorSpace = THREE.SRGBColorSpace;
    const repeats = planeSize / 2;
    textureplane.repeat.set(repeats, repeats);
    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      map: textureplane,
      side: THREE.DoubleSide,
    });
    const meshplane = new THREE.Mesh(planeGeo, planeMat);
    meshplane.rotation.x = Math.PI * -.5;
    scene.add(meshplane);
  };
  //lightingambient
  const color = 0x231F1F;
  const intensity = 0.5;
  const light = new THREE.AmbientLight(color, intensity);
  scene.add(light);
  gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
  gui.add(light, 'intensity', 0, 5, 0.01);
  //directional light
  function makeXYZGUI(gui, vector3, name, onChangeFn) {
    const folder = gui.addFolder(name);
    folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
    folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
    folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
    folder.open();
  }
  const dircolor = 0xFB0404;
  const dirintensity = 3.5;
  const dirlight = new THREE.DirectionalLight(dircolor, dirintensity);
  dirlight.position.set(-7.7,6.8,2.14);
  dirlight.target.position.set(8.28,0,1.64);
  scene.add(dirlight);
  scene.add(dirlight.target);
  const dirhelper = new THREE.DirectionalLightHelper(dirlight);
  scene.add(dirhelper);
  function updateLight(){
    dirlight.target.updateMatrixWorld();
    dirhelper.update();
  }
  updateLight();
  gui.addColor(new ColorGUIHelper(dirlight,'color'),'value').name('color');
  gui.add(dirlight,'intensity',0,5,0.01);
  makeXYZGUI(gui, dirlight.position, 'position', updateLight);
  makeXYZGUI(gui, dirlight.target.position, 'target', updateLight);

  //pointlight
  const pointcolor=0x23F207;
  const pointintensity=150;
  const pointlight=new THREE.PointLight(pointcolor, pointintensity);
  pointlight.position.set(4.1,6.93,0);
  scene.add(pointlight);
  const pointhelper = new THREE.PointLightHelper(pointlight);
  scene.add(pointhelper);
  function updatepointlight(){
    pointhelper.update();
  }
    gui.addColor(new ColorGUIHelper(pointlight, 'color'), 'value').name('color');
    gui.add(pointlight, 'intensity', 0, 150, 1);
    gui.add(pointlight, 'distance', 0, 40).onChange(updatepointlight);
    makeXYZGUI(gui, pointlight.position, 'position', updatepointlight);
    //background thing
  const backgroundloader = new THREE.TextureLoader();
  const backgroundtexture = backgroundloader.load(
    '../resources/background.jpg',
    () => {
      backgroundtexture.mapping = THREE.EquirectangularReflectionMapping;
      backgroundtexture.colorSpace = THREE.SRGBColorSpace;
      scene.background = backgroundtexture;
    });
    function resizeRendererToDisplaySize( renderer ) {

      const canvas = renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      if ( needResize ) {
  
        renderer.setSize( width, height, false );
  
      }
  
      return needResize;
  
    }
  
    function render(time) {
        time *= 0.001;  // convert time to seconds
    
        if(resizeRendererToDisplaySize(renderer)){
          const canvas=renderer.domElement;
          camera.aspect=canvas.clientWidth/canvas.clientHeight;
          camera.updateProjectionMatrix();
        }
        cubes.forEach((cube, ndx) => {
          const speed = 1 + ndx * .1;
          const rot = time * speed;
          cube.rotation.x = rot;
          cube.rotation.y = rot;
    });
        spheres.forEach((sphere, ndx) => {
            const speed = 1 + ndx * .1;
            const rot = time * speed;
            sphere.rotation.x = rot;
            sphere.rotation.y = rot;
    });
    cones.forEach((cone, ndx) => {
        const speed = 1 + ndx * .1;
        const rot = time * speed;
        cone.rotation.x = rot;
        cone.rotation.y = rot;
    });
    renderer.render(scene, camera);
    requestAnimationFrame(render);

    }
    requestAnimationFrame(render);
  }
main();
