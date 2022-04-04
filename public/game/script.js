import * as THREE from 'three'
import {PointerLockControls} from 'PointerLockControls';
import { FBXLoader } from 'FBXLoader';

let canvas = document.querySelector('canvas')
let gui1 = document.getElementById('playersOnline')
const keyObject = {w:false,a:false,s:false,d:false};

var activePlayers = new Map()
var playerObjects = new Map()

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

//loader = new FBXLoader()

/*
loader.load( 'models/fbx/myModel.fbx', function ( object ) {

    scene.add( object );

}, undefined, function ( e ) {

  console.error( e );

} );
*/

function drawplayers(){
    var geometry = new THREE.CylinderGeometry(0.5,0.5,2,50,10);
    var material = new THREE.MeshStandardMaterial( { color:new THREE.Color('pink') } );
    for( let i of activePlayers){
        if(!playerObjects.has(i[0])){
            //if not in objectMap yet
            playerObjects.set(i[0],new THREE.Mesh( geometry, material ))
            scene.add(playerObjects.get(i[0]))
        }else{
            //if both exist then update
            playerObjects.get(i[0]).position.set(i[1][0],i[1][1],i[1][2])
        }
        
    }
    for(let j of playerObjects){
        if(!activePlayers.has(j[0])){
            //if not in server Map
            scene.remove(j[1])
            playerObjects.delete(j[0])
        }
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

    //apply drag
    camera.position.xv *= (0.9)
    camera.position.zv *= (0.9)

    //apply gravity
    if(camera.position.y >= 1){
        camera.position.yv -= 0.01
    }else{
        camera.position.yv = 0
    }


    camera.position.y += camera.position.yv
    controls.moveForward(camera.position.xv)
    controls.moveRight(camera.position.zv)
}

(async function() {

    const ws = await connectToServer();
    
    ws.onmessage = (webSocketMessage) => {
        var parsedMessage = JSON.parse(webSocketMessage.data)
        if(parsedMessage.active){
            activePlayers.set(parsedMessage.sender,[parsedMessage.x,parsedMessage.y,parsedMessage.z])
        }else{
            activePlayers.delete(parsedMessage.sender)
        }
        

        //console.log(activePlayers)
        //console.log(parsedMessage)

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
    
    //draw other players
    drawplayers()
    //move
    move()
    //render scene locally
    renderer.render( scene, camera );

    var tempTable = '<table>'
    for(let i of activePlayers){
        tempTable +=`
            <tr>
                <td>${i[0]}</td>

            </tr>
        `
    }
    gui1.innerHTML = tempTable+'</table>'
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