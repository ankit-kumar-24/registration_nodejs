require("dotenv").config()
const express = require("express")
const app = express()
const path = require("path")
const hbs = require("hbs")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const port = process.env.Port || 3000

require("./db/conn")
const Register = require("./models/registrationschema")

const templatepath = path.join(__dirname, "../template/views")

app.set("view engine", "hbs")
app.set("views", templatepath )

app.use(express.json())
app.use(express.urlencoded({extended : false}))


console.log(process.env.SECRET_KEY)

app.get("/registers", async (req, res) => {
    res.render("index")
})

app.get("/login", async (req, res) => {
    res.render("login")
})

app.get("/home", async (req, res) => {
    res.render("home")
})
// post register

app.post("/registers", async(req, res) => {
    try {
      const password = req.body.password;
      const cpassword = req.body.confirmpassword;
      if(password === cpassword){
        const user = new Register({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone,
            age: req.body.age,
            password: req.body.password,
            confirmpassword: req.body.confirmpassword 
        })

        const token = await user.generateAuthTokens();
        console.log("The token is " +token);

        console.log(user)
        const postData = await user.save();
        
        res.render("home"); 
      }else{
        res.status(404).send("Invalid wrong details")
      }
    } catch (error) {
        console.log(error)
       res.status(500).send(error)
       
    }
})

// Post login

app.post("/login", async(req,res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({email:email});
        const isMatch = bcrypt.compare(password, useremail.password)

        const token = await useremail.generateAuthTokens();
        console.log("The token is " +token)


       // if(useremail.password === password){
        if(isMatch){
            res.status(200).render("home")
        }else{
            res.send("password not matching")
        }

    } catch (error) {
        console.log(error)
       res.status(400).send("Invalid password")
    }
})



app.listen(port, () => {
    console.log(`Listing on port number ${port}`)
})