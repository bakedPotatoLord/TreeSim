const express = require('express')

const app = new express

const port = 3000

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/public/index.html')
})

app.get('/script.js',(req,res)=>{
    res.sendFile(__dirname+'/public/script.js')
})

app.get('/style.css',(req,res)=>{
    res.sendFile(__dirname+'/public/style.css')
})

app.listen(port, ()=>{
    console.log(`listening on port ${port}`)
})