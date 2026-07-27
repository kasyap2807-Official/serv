const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    Image:String,
    subject:String,
    Title:String,
    FindAt:String,
    FindURL:String
})

const model = mongoose.model("Achivements",schema);

module.exports = model;