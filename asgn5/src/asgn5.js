import * as THREE from 'three';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
function main() {

    const canvas = document.querySelector( '#c' );
    const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

    const fov = 75;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 7;
    const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set(2,1,4);

    const scene = new THREE.Scene();
    const color = 0xFFFFFF;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 2, 4);
    scene.add(light);
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

    function makeInstance(geometry, materials, x) {

       
        const cube = new THREE.Mesh(geometry, materials);
        scene.add(cube);
       
        cube.position.x = x;
       
        return cube;
    }
    const cubes = [
        makeInstance(geometry, materials,  0),
    ];
    
    //sphere stuff
    const geometrysphere = new THREE.SphereGeometry( 1, 16, 32 ); 
    function makeInstanceSphere(geometry, color, x) {
        const material = new THREE.MeshPhongMaterial({color});
        
        const sphere= new THREE.Mesh(geometry, material);
        scene.add(sphere);
       
        sphere.position.x = x;
       
        return sphere;
    }
    const spheres=[makeInstanceSphere(geometrysphere,0xffff00,2)];
    //cone stuff
    const geometrycone=new THREE.ConeGeometry(1,1,32,1);
    function makeInstanceCone(geometry, color, x) {
        const material = new THREE.MeshPhongMaterial({color});
        
        const cone= new THREE.Mesh(geometry, material);
        scene.add(cone);
       
        cone.position.x = x;
       
        return cone;
    }
    const cones=[makeInstanceCone(geometrycone,0xff00a4,-2)];
    function render(time) {
        time *= 0.001;  // convert time to seconds
       
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
//importing 3d model
const mtlLoader = new MTLLoader();
const objLoader= new OBJLoader();
mtlLoader.load('../resources/cup_of_tea.mtl', (mtl) => {
  mtl.preload();
  objLoader.setMaterials(mtl);
  objLoader.load('../resources/cup_of_tea.obj', (object) => {
    object.position.x=5;
    object.position.y=-1;
    scene.add(object);
  });
});


    renderer.render(scene, camera);
    requestAnimationFrame(render);

    }
    requestAnimationFrame(render);
}



main();
