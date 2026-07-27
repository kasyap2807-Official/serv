const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    UserName:String,
    Date:String
})

const model = mongoose.model("Contactme",schema);

module.exports = model