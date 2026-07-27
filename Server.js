const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const nodemailer = require('nodemailer'); 
const multer = require('multer');
const { generateToken, verifyToken } = require('./jwtUtils');
const fs = require("fs");
const { Mistral } = require("@mistralai/mistralai");


const port = 3001;

const apiKey = "DZoxwosVl78QTPUqTKkYP82oQufmyQYG";
const client = new Mistral({ apiKey: apiKey });

// Read content from content.txt synchronously at startup
const systemContent = fs.readFileSync("./content.txt", "utf-8");


mongoose.connect('mongodb+srv://kanuparthikrishnakasyap:ozDbnBKDB8kWA7Pb@portfoliocluster.vr50ewx.mongodb.net/?retryWrites=true&w=majority&appName=PortfolioCluster')
.then(() => {
    console.log('Mongoose is connected');
}).catch((err) => {
    console.error('Mongoose connection error:', err);
});

const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service provider
    auth: {
        user: 'backup.kasyap@gmail.com', // Your email address
        pass: 'qnzbujsxiqtxihbd', // Your email password or app-specific password
    },
});

const model = require('./Schema1');
const model2 = require('./Schema2');
const model3 = require('./Schema3');
const model4 = require('./Schema4');
const app = express();


app.use(express.json());
const allowedOrigins = ['https://kasyap.netlify.app', 'http://localhost:3000','https://www.iamkrishna.info','https://iamkrishna.info'];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};


app.use(cors(corsOptions));
app.use(bodyParser.json());

// Use memory storage to store file in buffer
const upload = multer({ storage: multer.memoryStorage() });

// CRUD for projects...
app.post('/addproject', verifyToken,(req, res) => {
    const data = new model(req.body);
    data.save()
        .then(() => {
            res.json({"status": "success"});
        })
        .catch((err) => {
            console.error(err); // Log the error for debugging
            res.json({"status": "Failed"});
        });
});

app.post('/addAchivement',verifyToken, (req, res) => {
    const data = new model4(req.body);
    data.save()
        .then(() => {
            res.json({"status": "success"});
        })
        .catch((err) => {
            console.error(err); // Log the error for debugging
            res.json({"status": "Failed"});
        });
});

app.get('/getall', async (req, res) => {
    await model.find().then(data=>{
        res.send(data);
    }).catch((err)=>{
        res.send(err)});
});

app.get('/getTop10Achievements', async (req, res) => {
    await model4.find().then(data=>{
        res.send(data.reverse().slice(0,10));
    }).catch((err)=>{
        res.send(err)});
});

// .reverse

app.get('/getallAchievements', async (req, res) => {
    await model4.find().then(data=>{
        res.send(data);
    }).catch((err)=>{
        res.send(err)});
});

app.post('/deleteProject', verifyToken,(req, res) => {
    const ObjectId = mongoose.Types.ObjectId;
    model.deleteOne({_id: new ObjectId(req.body._id)})
        .then(() => {
            res.json({"status": "Success"});
        })
        .catch((err) => {
            console.error(err); // Log the error for debugging
            res.json({"status": "Failed"});
        });
});

app.post("/updateproject",verifyToken,(req,res)=>{
    model.findByIdAndUpdate( req.body._id, req.body, { new: true }).then(()=>{
        res.json({"Status":"Success"})
    }).catch(()=>{
        res.json({
            "status":"Failed"
        })
    })
})


// CRUD for constact us
app.get("/getallcontacts",(req,res)=>{
    const data = model3.find().then((data)=>{
        res.json(data)
    }).catch(()=>{
        res.send("Error")
    });
})

app.post('/contactUs', async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Email details
    const mailOptions = {
        from: "backup.kasyap@gmail.com", // Sender's email address
        to: "kanuparthikasyap95@gmail.com", // Recipient's email address
        subject: `New Contact Request: ${subject}`,
        text: `You have a new contact request:\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        const data = new model3(req.body)
            data.save().then(()=>{
                res.json({
                    "status":"Success"
                })
            }).catch(()=>{
                res.json({
                    "status":"Failed"
                })
            })
        res.json({ status: 'Success', message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ status: 'Failed', message: 'Failed to send email', error: error.message });
    }
});

app.post('/deletecontact', (req, res) => {
    const ObjectId = mongoose.Types.ObjectId;
    model.deleteOne({_id: new ObjectId(req.body._id)})
        .then(() => {
            res.json({"status": "Success"});
        })
        .catch((err) => {
            console.error(err); // Log the error for debugging
            res.json({"status": "Failed"});
        });
});

app.get('/performTask', async (req, res) => {
    try {
        console.log('Periodic task is being executed');
        // Add your logic here (e.g., update database, fetch data, etc.)
        res.json({ status: 'Periodic task executed successfully' });
    } catch (err) {
        console.error('Error executing periodic task:', err);
        res.status(500).json({ status: 'Failed', error: err.message });
    }
});


setInterval(() => {
    axios.get(`https://portfolio-server-91pj.onrender.com/performTask`)
        .then(response => {
            console.log('Self-request response:', response.data);
        })
        .catch(error => {
            console.error('Error in self-request:', error.message);
        });
}, 1 * 60 * 1000); // 10 minutes in milliseconds



app.post('/login',(req,res)=>{
    try {
    if(req.body.UserName=="Kasyap2003" && req.body.Password == "Kasyap@2003"){
    const data = new model2({UserName:req.body.UserName,Time:Date()})
        data.save().then(() => {
            const token = generateToken({ username:data.UserName });
            res.json({ token });
        })
        .catch((err) => {
            console.error(err); // Log the error for debugging
            res.json({"status": "Failed"});
        });
    }
        else{
            res.status(401).json({ status: "Something went wrong" });
        }
    } catch (err) {
        console.error('Error executing periodic task:', err);
        res.status(500).json({ status: 'Failed', error: err.message });
    }
})

app.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;

    const chatResponse = await client.chat.complete({
      model: "mistral-tiny-latest",
      messages: [
        {
          role: "system",
          content: systemContent,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    res.json({ response: chatResponse.choices[0].message.content });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Start server
app.listen(port, () => {
    console.log("Server Started on port", port);
});

