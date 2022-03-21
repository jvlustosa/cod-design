import * as THREE from "https://cdn.skypack.dev/three@0.126.1";

import { OrbitControls } from "https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
let canvas,camera, renderer, scene, controls;
let model,mixer;
let gridHelper;


let clock = new THREE.Clock();


let button = document.getElementById("btn");

init();
animate();
function init() {

    scene = new THREE.Scene();
    //scene.background = new THREE.Color( 0xf0f0f0 );
  
    //CAMERA
    camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
    camera.position.set(0, 15, 27);
    camera.lookAt(0, 0, 0);
  
    //Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.alpha = true;
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    document.body.appendChild(renderer.domElement);

    controls = addControls();
  
    const size = 100;
    const divisions = 10;
    gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);
    addFloor(size);
    addObject("https://raw.githubusercontent.com/baronwatts/models/master/robber.glb",0);
    addObject("https://assets.codepen.io/6116486/fighterjetavell.glb",0)
    addLights();
   
  
   
  }
  
  function addLights() {
    //LIGHT
    const light = new THREE.DirectionalLight(0xffffff, 0.7);
    light.position.set(1, 5, 1);
    light.castShadow = true;
    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 500; // default
  
    const helper = new THREE.CameraHelper(light.shadow.camera);
    //scene.add(helper);
    scene.add(light);
  
    const backlight = new THREE.DirectionalLight(0xffffff, 0.7);
    backlight.position.set(1, 1, -1);
    backlight.castShadow = true;
    scene.add(backlight);
  
    const ambientlight = new THREE.AmbientLight(0x404040, 0.8);
  
    backlight.shadow.mapSize.width = 512; // default
    backlight.shadow.mapSize.height = 512; // default
    backlight.shadow.camera.near = 0.5; // default
    backlight.shadow.camera.far = 500; // default
  
    scene.add(ambientlight);
  }
  
  function addControls() {
    let controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener("change", render);
    controls.minDistance = 20;
    controls.maxDistance = 400;
    //controls.maxPolarAngle = Math.PI / 2
    //controls.minAzimuthAngle = [0, Math.PI / 4];
    controls.enableDamping = true;
    return controls;
  }

  function addObject(url,y){
    var loader = new GLTFLoader();
    loader.load(
      url, function(gltf) {
  
         gltf.scene.traverse( function( node ) {
            if ( node instanceof THREE.Mesh ) { 
              node.castShadow = true; 
              node.material.side = THREE.DoubleSide;
            }
          });
  
         
        model = gltf.scene;
        model.position.y+=y;
        let scale = 3;
        model.scale.set(scale,scale,scale);
        scene.add(model);
  
        console.log(gltf.animations); //shows all animations imported into the dopesheet in blender
  
        mixer = new THREE.AnimationMixer(model);
        //mixer.clipAction(gltf.animations[1]).play();
        /*
        button.addEventListener("click", kill);
        function kill() {
          console.log('Animation started')
          mixer.clipAction(gltf.animations[1]).stop();
          mixer.clipAction(gltf.animations[0]).play();
          setTimeout(function() {
            mixer.clipAction(gltf.animations[0]).stop();
            mixer.clipAction(gltf.animations[1]).play();
          }, 1500);
        }
        */
   
    });
  }

  function addFloor(size){
    const geometry = new THREE.PlaneGeometry( size, size );
    const material = new THREE.MeshBasicMaterial( {color: 0xb3b3b3, side: THREE.DoubleSide} );
    const plane = new THREE.Mesh( geometry, material );
    plane.rotation.x += Math.PI/2
    scene.add( plane );
  }








window.addEventListener("resize", onWindowResize);

window.addEventListener('dblclick',()=>{
  const fullscreenElement = document.fullscreenEelement || document.webkitFullscreenElement;
  if(!fullscreenElement){
    document.body.requestFullscreen();
  } else {
    document.exitFullscreen();
  }

})

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));

  render();
}
function render() {
  renderer.render(scene, camera);  
}


function animate() {
    controls.update();
    requestAnimationFrame(animate);

    var delta = clock.getDelta();
    if (mixer != null) mixer.update(delta);
    render();
  }
  
  