import * as THREE from 'three'
import {PointerLockControls} from 'PointerLockControls';

const c = document.getElementById('c')

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.rotateX(Math.PI/2)

const controls = new PointerLockControls(camera, c);
controls.connect()

const renderer = new THREE.WebGLRenderer({ canvas: c });
renderer.setSize( window.innerWidth/2, window.innerHeight/2 );
document.body.appendChild( renderer.domElement );

//add light
const light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

//add fog
scene.fog = new THREE.Fog(new THREE.Color('blue'))


const geometry = new THREE.PlaneGeometry(5,5,1,1);
const material = new THREE.MeshStandardMaterial( { color:new THREE.Color('blue') } );
const plane = new THREE.Mesh( geometry, material );
scene.add( plane );
plane.position.set(0,0,0)
plane.rotateX(Math.PI/4)

camera.position.z = 2;
camera.lookAt(0,0,0)

function animate() {
    requestAnimationFrame( animate );
    /*
    if(camera.position.z >= 1){
        camera.position.z -= 0.1
    }
    */

    renderer.render( scene, camera );
};

c.onclick =  function(e){

    console.log('click')
    if(controls.islocked){
        controls.unlock()
    }else{
        controls.lock()
    }
}

c.onkeydown=(e)=>{
    if(e.key == 'w'){
        controls.moveForward(0.1)
    }else if(e.key == 'a'){
        controls.moveRight(-0.1)
    }else if(e.key == 's'){
        controls.moveForward(-0.1)
    }else if(e.key == 'd'){
        controls.moveRight(0.1)
    }

}

animate();