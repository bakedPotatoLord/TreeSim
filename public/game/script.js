import * as THREE from 'three'
import {PointerLockControls} from 'PointerLockControls';
import { FBXLoader } from 'FBXLoader';

const canvas = document.querySelector('canvas')
const keyObject = {w:false,a:false,s:false,d:false};

var activePlayers = new Map()
var playerObjects = {}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.rotateX(Math.PI/2)
camera.position.xv = 0
camera.position.yv = 0
camera.position.zv = 0


const controls = new PointerLockControls(camera, canvas);
controls.connect()

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//add light
const light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

//add fog
scene.fog = new THREE.Fog(new THREE.Color('blue'))

//add background
scene.background = new THREE.Color('lightblue')

var geometry = new THREE.PlaneGeometry(15,15,10,10);
var material = new THREE.MeshStandardMaterial( { color:new THREE.Color('lime') } );
var plane = new THREE.Mesh( geometry, material );
scene.add( plane );
plane.position.set(0,0,0)
plane.rotateX(-Math.PI/2)

var geometry = new THREE.SphereGeometry(1,20,20);
var material = new THREE.MeshStandardMaterial( { color:new THREE.Color('brown') } );
var sphere = new THREE.Mesh( geometry, material );
scene.add( sphere );
sphere.position.set(0,0,0)

function drawplayers(){
    var geometry = new THREE.CylinderGeometry(0.5,0.5,2,50,10);
    var material = new THREE.MeshStandardMaterial( { color:new THREE.Color('pink') } );
    for( let i of activePlayers){
       
        /*
        
        activePlayers.get(i).shape = new THREE.Mesh( geometry, material );
        scene.add( activePlayers.get(i).shape );
        player.position.set(activePlayers.get(i).x,activePlayers.get(i).y,activePlayers.get(i).z)
        */
    }
}

camera.position.z = 2;
camera.position.y = 3;
camera.position.x = 2;

camera.lookAt(0,2,0)

function move(){
    if(keyObject.w && camera.position.xv < 0.1){
        camera.position.xv +=0.01
    }
    if(keyObject.a&& camera.position.zv < 0.1){
        camera.position.zv -= 0.01
    }
    if(keyObject.s&& camera.position.xv < 0.1){
        camera.position.xv -= 0.01
    }
    if(keyObject.d&& camera.position.zv < 0.1){
        camera.position.zv += 0.01
    }

    camera.position.xv *= (0.9)
    camera.position.zv *= (0.9)

    controls.moveForward(camera.position.xv)
    controls.moveRight(camera.position.zv)
}

(async function() {

    const ws = await connectToServer();
    
    ws.onmessage = (webSocketMessage) => {
        var parsedMessage = JSON.parse(webSocketMessage.data)
        activePlayers.set(parsedMessage.sender,[parsedMessage.x,parsedMessage.y,parsedMessage.z])

        console.log(activePlayers)

    };

    async function sendMSG(){
        ws.send(JSON.stringify({x:camera.position.x,y:camera.position.y,z:camera.position.z}))
    }

    async function connectToServer() {
        const ws = new WebSocket('ws://localhost:3001');
        return new Promise((resolve, reject) => {
            const timer = setInterval(() => {
                if(ws.readyState === 1) {
                    clearInterval(timer)
                    resolve(ws);
                }
            }, 10);
        });
    }

    setInterval(sendMSG,22)

})();

function animate() {
    requestAnimationFrame( animate );
    
    if(camera.position.y >= 1){
        camera.position.y -= 0.1
    }
    //draw other players
    drawplayers()
    //move
    move()
    //render scene locally
    renderer.render( scene, camera );
};

canvas.onclick =  function(e){

    console.log('click')
    if(controls.islocked){
        controls.unlock()
    }else{
        controls.lock()
    }
}
//document.addEventListener('keydown', logKey);
document.onkeydown = function(e){
    if(e.key == 'w'){
        keyObject.w = true;
    }else if(e.key == 'a'){
        keyObject.a = true;
    }else if(e.key == 's'){
        keyObject.s = true;
    }else if(e.key == 'd'){
        keyObject.d = true;
    }
}
document.onkeyup = function(e){
    if(e.key == 'w'){
        keyObject.w = false;
    }else if(e.key == 'a'){
        keyObject.a = false;
    }else if(e.key == 's'){
        keyObject.s = false;
    }else if(e.key == 'd'){
        keyObject.d = false;
    }
}

animate();