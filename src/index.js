require('dotenv').config();
const express = require("express");
const { Collection } = require("mongoose");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const collection = require('./mongodb.js')

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.render('login')
})

app.get('/signup', (req, res) => {
    res.render('signup')
})


app.post('/signup', async (req, res) => {
    const data = {
        name: req.body.username,
        email: req.body.email,
        password: req.body.password
    }

    // to check if the user already exist or not
    const existinguser = await collection.findOne({ name: data.name });
    if (existinguser) {
        res.send("User Already Exist.Please choose the different username");
    } else {
        await collection.insertMany([data])
        res.render("home")
    }
})

// login user
app.post('/login',async (req,res)=>{
    try{
        const check = await collection.findOne({name:req.body.username});
        if(!check){
            res.send("The Username Cannot Find!!")
        }else{

            const pass = await collection.findOne({password:req.body.password});
            if(pass){
                res.render("home");
            }else{
                res.send("password is not correct");
            }

        }

    }catch{
        res.send("Wrong Details");
    }
})

app.listen(port, () => {
    console.log(`server is running in ${port}`);

})
