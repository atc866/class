import * as THREE from 'three';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
function main() {

    const canvas = document.querySelector( '#c' );
    const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

    const fov = 45;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 500;
    const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.x=-35;
    camera.position.y=3;
    camera.position.z=15;
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
        new THREE.MeshBasicMaterial({map: loadColorTexture('../resources/mariokartcube.png')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('../resources/mariokartcube.png')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('../resources/mariokartcube.png')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('../resources/mariokartcube.png')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('../resources/mariokartcube.png')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('../resources/mariokartcube.png')}),
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
        cube.scale.x=0.6
        cube.scale.y=0.6
        cube.scale.z=0.6
     
        
       
        return cube;
    }
    const cubes = [
        makeInstance(geometry, materials,  5,0.5,9.5),
        makeInstance(geometry, materials,  5,0.5,10.5),
        makeInstance(geometry, materials,  5,0.5,11.5),
        makeInstance(geometry, materials,  -8,0.5,-12),
        makeInstance(geometry, materials,  -8,0.5,-13),
        makeInstance(geometry, materials,  -8,0.5,-14),
        makeInstance(geometry, materials,  -75,2,0),
        makeInstance(geometry, materials,  -76,2,0),
        makeInstance(geometry, materials,  -77,2,0),
        makeInstance(geometry, materials,  80,2,0),
        makeInstance(geometry, materials, 81,2,0),
        makeInstance(geometry, materials,  82,2,0),
    ];
    
    let height=0;
    for (let i = 0; i < 6; i++) {
      height+=0.6;
      if(i%2==0){
        makeInstance(geometry,new THREE.MeshBasicMaterial( {color: 0xffffff} ),-11,height,7);
      }
      else{
        makeInstance(geometry,new THREE.MeshBasicMaterial( {color: 0x000000} ),-11,height,7);
      }
      
    }
    let length=7;
    for (let i = 0; i < 12; i++) {
      length+=0.6;
      if(i%2==0){
        makeInstance(geometry,new THREE.MeshBasicMaterial( {color: 0xffffff} ),-11,height,length);
      }
      else{
        makeInstance(geometry,new THREE.MeshBasicMaterial( {color: 0x000000} ),-11,height,length);
      }
      
    }
    for (let i = 0; i < 6; i++) {
      height-=0.6;
      if(i%2==0){
        makeInstance(geometry,new THREE.MeshBasicMaterial( {color: 0xffffff} ),-11,height,length);
      }
      else{
        makeInstance(geometry,new THREE.MeshBasicMaterial( {color: 0x000000} ),-11,height,length);
      }
      
    }

    
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

const glbloader = new GLTFLoader();
  glbloader.load( '../resources/race_track_south_loop.glb', function ( gltf ) {
    const model=gltf.scene;
    model.position.x = 0
    model.position.y = 0
    model.position.z=0
    model.rotation.y=55;
    model.scale.x=0.25
    model.scale.y=0.25
    model.scale.z=0.25

    
    scene.add(model);
  }, 
  function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  
  },undefined, function ( error ) {
  
    console.error( error );
  
  } );
  const carglbloader = new GLTFLoader();
  carglbloader.load( '../resources/ferrari_f40.glb', function ( gltf ) {
    const model=gltf.scene;
    model.scale.x=0.5;
    model.scale.y=0.5;
    model.scale.z=0.6;
    model.rotation.y=Math.PI/2;
    model.position.x=-20;
    model.position.y=0.55;
    model.position.z=11;
    scene.add(model);
  }, 
  
  function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  
  },undefined, function ( error ) {
  
    console.error( error );
  
  } );

  carglbloader.load( '../resources/redshell.glb', function ( gltf ) {
    const model=gltf.scene;
    model.scale.x=0.0015;
    model.scale.y=0.0015;
    model.scale.z=0.0015;
    model.rotation.y=Math.PI/2;
    model.position.x=-23;
    model.position.y=1;
    model.position.z=13;
    scene.add(model);
  }, 
  
  function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  
  },undefined, function ( error ) {
  
    console.error( error );
  
  } );
  carglbloader.load( '../resources/greenshell.glb', function ( gltf ) {
    const model=gltf.scene;
    model.scale.x=0.002;
    model.scale.y=0.002;
    model.scale.z=0.002;
    model.rotation.y=Math.PI/2;
    model.position.x=-27;
    model.position.y=1;
    model.position.z=12;
    scene.add(model);
  }, 
  
  function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  
  },undefined, function ( error ) {
  
    console.error( error );
  
  } );
  carglbloader.load( '../resources/bulletbill.glb', function ( gltf ) {
    const model=gltf.scene;
    model.scale.x=0.001;
    model.scale.y=0.001;
    model.scale.z=0.001;
    model.position.x=-15;
    model.position.y=1;
    model.position.z=-15;
    scene.add(model);
  }, 
  
  function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  
  },undefined, function ( error ) {
  
    console.error( error );
  
  } );

  carglbloader.load( '../resources/mclaren.glb', function ( gltf ) {
    const model=gltf.scene;
    model.scale.x=0.35;
    model.scale.y=0.35;
    model.scale.z=0.45;
    model.rotation.y=Math.PI/2;
    model.position.x=-15;
    model.position.y=0.25;
    model.position.z=12;
    scene.add(model);
  }, 
  
  function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  
  },undefined, function ( error ) {
  
    console.error( error );
  
  } );
  carglbloader.load( '../resources/sonic.glb', function ( gltf ) {
    const model=gltf.scene;
    model.scale.x=0.025;
    model.scale.y=0.025;
    model.scale.z=0.025;
    model.rotation.y=Math.PI/2;
    model.position.x=-20.5;
    model.position.y=0.55;
    model.position.z=13;
    scene.add(model);
  }, 
  
  function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  
  },undefined, function ( error ) {
  
    console.error( error );
  
  } );
  carglbloader.load( '../resources/porsche.glb', function ( gltf ) {
    const model=gltf.scene;
    model.scale.x=0.25;
    model.scale.y=0.25;
    model.scale.z=0.25;
    model.rotation.y=Math.PI/2;
    model.position.x=-30;
    model.position.y=1.25;
    model.position.z=13;
    scene.add(model);
  }, 
  
  function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  
  },undefined, function ( error ) {
  
    console.error( error );
  
  } );
  carglbloader.load( '../resources/revuelto_3.0tm.glb', function ( gltf ) {
    const model=gltf.scene;
    model.scale.x=0.5;
    model.scale.y=0.4;
    model.scale.z=0.6;
    model.rotation.y=Math.PI*4/5
    model.position.x=-17;
    model.position.y=0.45;
    model.position.z=10;
    scene.add(model);
  }, 
  function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  
  },undefined, function ( error ) {
  
    console.error( error );
  
  } );
  carglbloader.load( '../resources/batmobil_car.glb', function ( gltf ) {
    const model=gltf.scene;
    model.scale.x=0.08;
    model.scale.y=0.07;
    model.scale.z=0.1;
    model.rotation.y=Math.PI
    model.position.x=-30;
    model.position.y=1.25;
    model.position.z=10;
    scene.add(model);
  }, 
  function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  
  },undefined, function ( error ) {
  
    console.error( error );
  
  } );
  carglbloader.load( '../resources/milenium_falcon.glb', function ( gltf ) {
    const model=gltf.scene;
    model.scale.x=10;
    model.rotation.y=Math.PI
    model.position.x=-30;
    model.position.y=3;
    model.position.z=10;
    scene.add(model);
  }, 
  function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  
  },undefined, function ( error ) {
  
    console.error( error );
  
  } );

  carglbloader.load( '../resources/mario_kart.glb', function ( gltf ) {
    const model=gltf.scene;
    model.scale.x=0.5;
    model.scale.y=0.5;
    model.scale.z=0.5;
    model.rotation.y=Math.PI/2;
    model.position.x=-25;
    model.position.y=1;
    model.position.z=9;
    scene.add(model);
  }, 
  function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  
  },undefined, function ( error ) {
  
    console.error( error );
  
  } );
  carglbloader.load( '../resources/huracan.glb', function ( gltf ) {
    const model=gltf.scene;
    model.scale.x=0.3;
    model.scale.y=0.3;
    model.scale.z=0.4;
    model.rotation.y=Math.PI/-2;
    model.position.x=-27;
    model.position.y=1.25;
    model.position.z=10.5;
    scene.add(model);
  }, 
  function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  
  },undefined, function ( error ) {
  
    console.error( error );
  
  } );
  const bsglbloader = new GLTFLoader();
  bsglbloader.load( '../resources/blue_shell_mario_kart.glb', function ( gltf ) {
    const model=gltf.scene;
    model.position.x=-15;
    model.position.y=3;
    model.position.z=12;
    model.scale.x=0.005
    model.scale.y=0.005
    model.scale.z=0.005
    scene.add(model);
  }, 
  function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  
  },undefined, function ( error ) {
  
    console.error( error );
  
  } );
  const bpglbloader = new GLTFLoader();
  bpglbloader.load( '../resources/peel.glb', function ( gltf ) {
    const model=gltf.scene;
    model.position.x=-15;
    model.position.y=0.5;
    model.position.z=10;
    model.scale.x=0.001
    model.scale.y=0.001
    model.scale.z=0.001
    scene.add(model);
  }, 
  function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  
  },undefined, function ( error ) {
  
    console.error( error );
  
  } );
  
  bpglbloader.load( '../resources/bobomb.glb', function ( gltf ) {
    const model=gltf.scene;
    model.position.x=-17.5;
    model.position.y=1.75;
    model.position.z=10;
    scene.add(model);
  }, 
  function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  
  },undefined, function ( error ) {
  
    console.error( error );
  
  } );
//build house thing?




  //lightingambient
  const color = 0xf5ed0f;
  const intensity = 1;
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
  const dircolor = 0xffffff;
  const dirintensity = 3.5;
  const dirlight = new THREE.DirectionalLight(dircolor, dirintensity);
  dirlight.position.set(-7.7,6.8,2.14);
  dirlight.target.position.set(-5,0,9.02);
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
  const pointcolor=0x0000ff;
  const pointintensity=1000;
  const pointlight=new THREE.PointLight(pointcolor, pointintensity);
  pointlight.position.set(-15,3,12);
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
    '../resources/desert.jpg',
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
