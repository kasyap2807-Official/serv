const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name:String,
    email:String,
    subject:String,
    message:String,
})

const model = mongoose.model("Contact",schema);

module.exports = model;