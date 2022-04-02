const express = require('express')
const app = new express

const port = 3000



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

//libraries
app.get('/lib/PointerLockControls.js',(req,res)=>{
    res.type('application/javascript')
    res.sendFile(__dirname+'/public/lib/PointerLockControls.js')
})
app.get('/lib/FBXLoader.js',(req,res)=>{
    res.type('application/javascript')
    res.sendFile(__dirname+'/public/lib/FBXLoader.js')
})
app.get('/lib/fflate.module.js',(req,res)=>{
    res.type('application/javascript')
    res.sendFile(__dirname+'/public/lib/fflate.module.js')
})
app.get('/lib/NURBScurve.js',(req,res)=>{
    res.type('application/javascript')
    res.sendFile(__dirname+'/public/lib/NURBScurve.js')
})
app.get('/lib/NURBSutils.js',(req,res)=>{
    res.type('application/javascript')
    res.sendFile(__dirname+'/public/lib/NURBSutils.js')
})

app.listen(port, ()=>{
    console.log(`listening on port ${port}`)
})


//websocket stuff
const WebSocket = require('ws')
const wss =  new WebSocket.Server({port:3001})

const clients = new Map();

wss.on('connection', (ws) => {
    var id = uuidv4();
    var metadata = { id };

    clients.set(ws, metadata);

    ws.on('message', (messageAsString) => {
        const message = JSON.parse(messageAsString);
        const metadata = clients.get(ws);

        message.sender = metadata.id;
        
        
        console.clear()
        console.table(clients)

        const outbound = JSON.stringify(message);

        [...clients.keys()].forEach((client) => {
        client.send(outbound);
        });
    });

    ws.on("close", () => {
        clients.delete(ws);
    });
});

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

function loop(){
    
    console.clear()
    console.table(clients)
    setTimeout(loop(),1000)
}

//loop()


