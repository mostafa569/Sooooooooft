const mongoose = require("mongoose");



const adminSchema = new mongoose.Schema({
   
    username: {
        type: String,
        unique: true,
        required: true
    },
    password:  {
        type: String,
        required: true
    }
});


//create model
const Admin = mongoose.model("admins", adminSchema);



 
module.exports = Admin;