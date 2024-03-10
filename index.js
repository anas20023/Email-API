const express = require("express");

const app = express();
app.use(express.static("public"));
const port = 3000;
app.get("/", (req, res) => {
  res.set({
    "Allow-access-Allow-Origin": "*",
  });
  return res.redirect("index.html");
});

app.listen(port, () => {
  console.log(`server running on ${port}`);
});
