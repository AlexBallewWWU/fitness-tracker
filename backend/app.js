const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const port = 5500;

app.use(bodyParser.json());

// app.get("/", function (req, res) {
//   res.send("Hello World!");
// });

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});
