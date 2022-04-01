const express = require('express')
const app = new express

const port = 3000
var users =  new Map()

function addUser(){

}


//game
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/public/game/index.html')
})

app.get('/script.js',(req,res)=>{
    res.sendFile(__dirname+'/public/game/script.js')
})

app.get('/style.css',(req,res)=>{
    res.sendFile(__dirname+'/public/game/style.css')
})


//leaderboard
app.get('/leaderBoard',(req,res)=>{
    res.sendFile(__dirname+'/public/leaderboard/index.html')
})

app.get('/leaderBoard/script.js',(req,res)=>{
    res.sendFile(__dirname+'/public/leaderboard/script.js')
})

app.get('/leaderBoard/style.css',(req,res)=>{
    res.sendFile(__dirname+'/public/leaderboard/style.css')
})

//create acc
app.get('/account/create',(req,res)=>{
    res.sendFile(__dirname+'/public/account/create/index.html')
})

app.get('/account/create/script.js',(req,res)=>{
    res.sendFile(__dirname+'/public/account/create/script.js')
})

app.get('/account/create/style.css',(req,res)=>{
    res.sendFile(__dirname+'/public/account/create/style.css')
})

app.get('/lib/PointerLockControls.js',(req,res)=>{
    res.type('application/javascript')
    res.sendFile(__dirname+'/public/lib/PointerLockControls.js')
})

app.listen(port, ()=>{
    console.log(`listening on port ${port}`)
})


//websocket stuff
const WebSocket = require('WS')
const wss = WebSocket.Server({port:3001})

const clients = new Map();

wss.on('connection', (ws) => {
    var id = uuidv4();
    var metadata = { id };

    clients.set(ws, metadata);

    ws.on('message', (messageAsString) => {
        const message = JSON.parse(messageAsString);
        const metadata = clients.get(ws);

        message.sender = metadata.id;
        message.color = metadata.color;
        const outbound = JSON.stringify(message);

        [...clients.keys()].forEach((client) => {
        client.send(outbound);
        });
    });

    ws.on("close", () => {
        clients.delete(ws);
    });
});
