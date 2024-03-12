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
  secure: true, // upgrade later with ST
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
  .connect("mongodb://localhost:27017/mydb", {
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
    await db.collection("infos").insertOne(data, function (err, result) {
      if (err) {
        console.error("Error inserting user:", err);
        return res.status(500).send("An error occurred.");
      }
      //---------------------------
      async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: "Anas Ibn Belal",
          to: Email,
          subject: "Welcome to my Email API",
          html: ` <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333333;">Ramadan Mubarak!</h1>
          <p style="color: #555555;">As the month of Ramadan begins, I extend my warmest wishes to you and your loved ones.</p>
          <p style="color: #555555;">May this holy month be filled with peace, reflection, and spiritual growth. Let us cherish the blessings of Ramadan and strive to strengthen our faith, compassion, and community ties.</p>
          <p style="color: #555555;">In the spirit of generosity and kindness that defines Ramadan, let us also remember those less fortunate and extend a helping hand wherever we can.</p>
          <p style="color: #555555;">Wishing you and your family a blessed Ramadan filled with joy, harmony, and countless blessings.</p>
          <p style="color: #555555;">Ramadan Mubarak!</p>
          <p style="color: #555555;">Warm regards,</p>
          <p style="color: #555555;">[Anas Ibn Belal]</p>
      </div>`,
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
