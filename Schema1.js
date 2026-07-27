const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    imgPath:String,
    isBlog:Boolean,
    title:String,
    description:String,
    ghLink:String,
    demoLink:String
});

const model = mongoose.model("Newmod",schema);

module.exports = model;


// {
//     "imgPath": "",
//     "isBlog": false,
//     "title": "Bits-0f-C0de",
//     "description": "My personal blog page build with Next.js and Tailwind Css which takes the content from markdown files and renders it using Next.js. Supports dark mode and easy to write blogs using markdown.",
//     "ghLink": "https://github.com/soumyajit4419/Bits-0f-C0de",
//     "demoLink": "https://blogs.soumya-jit.tech/"
//   }