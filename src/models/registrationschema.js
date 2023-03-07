const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const registreSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true,
        min : 10,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    },
    tokens: [{
        token : {
            type: String,
            required: true
        }
    }]
})


// genrating tokens
registreSchema.methods.generateAuthTokens = async function(){
    try {
        const token = jwt.sign({_id : this._id.toString()}, process.env.SECRET_KEY)
        //console.log(token)
        this.tokens = this.tokens.concat({token:token})
        return token;
        await this.save()
    } catch (error) {
        res.send("The error is " +error)
        console.log("The error is " +error)
    }
}



// password converting into hash
registreSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        //const passwordHash = await bcrypt.hash(password, 10);
        
        this.password = await bcrypt.hash(this.password, 10)
        this.confirmpassword = await bcrypt.hash(this.password, 10)

        //this.confirmpassword = undefined;
    }
    next()
})



const Register = new mongoose.model("Register", registreSchema)

module.exports = Register