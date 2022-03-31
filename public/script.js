import * as THREE from 'three'

const c = document.getElementById('c')

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({ canvas: c });
renderer.setSize( window.innerWidth/2, window.innerHeight/2 );
document.body.appendChild( renderer.domElement );

const light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

const geometry = new THREE.PlaneGeometry(10,10,20,20);
const material = new THREE.MeshBasicMaterial( { color:new THREE.Color('blue') } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

function animate() {
    requestAnimationFrame( animate );

    

    renderer.render( scene, camera );
};

animate();