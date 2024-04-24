const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
var bodyParser = require("body-parser");
require("dotenv").config();
//-------------------------------
var user = process.env.EMAIL;
var pw = process.env.PASSWORD;
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: user,
    pass: pw,
  },
});
//-------------------------------
const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
const port = process.env.PORT || 3000;
mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log(error));
//-------------------------------
const db = mongoose.connection;

app.post("/getmail", async (req, res) => {
  try {
    let Fname = req.body.fname;
    let lname = req.body.lname;
    let Email = req.body.email;
    let messege = req.body.Messege;
    const data = {
      First_Name: Fname,
      Last_Name: lname,
      Email: Email,
      messege: messege,
    };
    await db.collection("senders").insertOne(data, function (err, result) {
      if (err) {
        console.error("Error inserting user:", err);
        return res.status(500).send("An error occurred.");
      }
      //---------------------------
      async function main() {
        const info = await transporter.sendMail({
          from: "Anas Ibn Belal <${Email}>", 
          to: Email,
          subject: "Best Wishes from Anas Ibn Belal",
          html: ` <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Warm Greetings</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                background-color: #f5f5f5;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              h1 {
                color: #333333;
                text-align: center;
              }
              p {
                color: #555555;
                text-align: justify;
              }
              .signature {
                margin-top: 20px;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Warm Greetings!</h1>
              <p>Dear ${Fname},</p>
              <p>As we embark on another day, I wanted to take a moment to extend my warmest wishes to you. May this day be filled with joy, positivity, and countless blessings for you and your loved ones.</p>
              <p>Life is a journey filled with ups and downs, and amidst it all, I hope you find moments of peace, love, and fulfillment. Remember to cherish the simple joys, embrace the challenges, and celebrate your achievements along the way.</p>
              <p>May you always find the strength to pursue your dreams, the courage to overcome obstacles, and the wisdom to navigate life's twists and turns with grace.</p>
              <p>Wishing you a day filled with smiles, laughter, and countless reasons to be grateful. Here's to you, ${Fname}, and all the wonderful adventures that lie ahead!</p>
              <p>Warm regards,</p>
              <div class="signature">
                <p>Anas Ibn Belal</p>
              </div>
            </div>
          </body>
          </html>
          
          `,
        });

        console.log("Message sent: %s", info.messageId);
      }
      main().catch(console.error);
      //---------------------------
      return res.redirect("done.html");
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

//-------------------------------
app.get("/", (req, res) => {
  res.set({
    "Allow-access-Allow-Origin": "*",
  });
  return res.redirect("index.html");
});

app.listen(port, () => {
  console.log(`server running on ${port}`);
});

//-------------
