const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
require("dotenv").config();
//-------------------------------
let Email_API = process.env.API_KEY;
const { MailerSend, Recipient, EmailParams } = require("mailersend");
const mailersend = new MailerSend({
  api_key: Email_API,
});
const recipients = [
  new Recipient("anasibnebelal400@mail.com", "Anas Ibn Belal"),
];
//console.log(Email_API);
//-------------------------------
const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
const port = 3000;
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
    const recipients = [new Recipient(Email, Fname)];
    const emailParams = new EmailParams()
      .setFrom("info@trial-3vz9dle5px7lkj50.mlsender.net")
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject("This is a Subject")
      .setHtml("<strong>This is the HTML content</strong>")
      .setText("This is the text content");

    await mailersend.email.send(emailParams);

    await db.collection("infos").insertOne(data, function (err, result) {
      if (err) {
        console.error("Error inserting user:", err);
        return res.status(500).send("An error occurred.");
      }
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
