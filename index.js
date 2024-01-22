const express = require('express');
const users = require('./MOCK_DATA.json')
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({extended:false}));

app.use((req,res,next)=>{
    fs.appendFile('log.txt',`\n${Date.now()}: ${req.method}: ${req.path}`,(err,data)=>{
        next();
    })
})

app.get('/api/user',function(req,res){
    res.json(users);
})

app.get('/users',function(req,res){
    const html = `<ul>
        ${users.map((user)=>{
             return `<li>${user.first_name}</li>`
        }).join("")}
    </ul>`;
    res.send(html);
})

app.post('/api/user',function(req,res){
    const body = req.body;
    users.push({...body, id:users.length+1});
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users),(err,data)=>{
        return res.json({status:"success",id:users.length});
    });
});

app.get('/api/user/:id',function(req,res){
    const userData = Number(req.params.id);
    const data = users.find((user)=>{
        return user.id === userData;
    })

    return res.json(data);
})

app.listen(PORT,()=>{
    console.log(`Server is listening on PORT ${PORT}`);
})
