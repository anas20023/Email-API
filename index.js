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
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: user,
          to: Email ,
          subject: "Ramadan Mubarak and Eid Mubarak!",
          html: ` <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Ramadan Greetings and Eid Wishes</title>
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
              <h1>Warm Ramadan Greetings and Joyous Eid Wishes!</h1>
              <p>Dear ${Fname},</p>
              <p>As the holy month of Ramadan approaches, we extend our heartfelt wishes to you and your loved ones. Ramadan is a time of reflection, devotion, and spiritual growth, and we hope it brings you peace, joy, and blessings in abundance.</p>
              <p>During this sacred month, Muslims around the world fast from dawn to sunset, engaging in prayer, self-reflection, and acts of charity. It is a time of heightened spirituality and an opportunity for personal growth and renewal.</p>
              <p>In the spirit of Ramadan, let us remember to be compassionate towards others, show kindness to those in need, and strive for unity and understanding within our communities.</p>
              <p>As Ramadan draws to a close, we eagerly anticipate the joyous celebration of Eid al-Fitr, a time of feasting, festivity, and gratitude. May this special occasion bring you closer to your family and friends, and may your homes be filled with laughter, love, and blessings.</p>
              <p>I extend my warmest wishes to you and your family for a blessed Ramadan and a joyous Eid. May this holy month bring you closer to your faith and may you emerge from it renewed in spirit and filled with hope for the future.</p>
              <p><strong>Ramadan Mubarak and Eid Mubarak!</strong></p>
              <div class="signature">
                <p>Warm regards,</p>
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
