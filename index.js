const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
var bodyParser = require("body-parser");
require("dotenv").config();
//-------------------------------
const user = process.env.EMAIL;
const pw = process.env.PASSWORD;
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // upgrade later with ST
  auth: {
    user: "anasibnebelal45@gmail.com",
    pass: "ovuyipfkipvgetpb",
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
          from: "anasibnebelal45@gmail.com",
          to: Email,
          subject: "Welcome",
          text: "Hello world?",
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
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
