const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const registerSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    email: {
        type:String,
        required: true,
        index: {
            unique: true
        }
    },
    password: {
        type:String,
        required: true,
    },
    phone: {
        type:Number,
        required: true,
        unique: true,
        minlength: 10
    },
    tokens:{
        type:String
    }

})

registerSchema.methods.generateAuthToken = async function(req,res){
    try {
        const token = jwt.sign({ _id: this._id.toString() },process.env.SECRECT_KEY);
        this.tokens = token
        await this.save();
        console.log(token)
        return token;

    } catch (error) {
        // res.status(401).send(`the error part ${error}`)
        console.log('the error part' + error)
    }
}



const registerModel = new mongoose.model('register', registerSchema)
module.exports = registerModel