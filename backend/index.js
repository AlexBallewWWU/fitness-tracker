// import userRoutes from './routes/users.js'


const express = require("express");
const serverless = require("serverless-http");
const app = express();
// const bodyParser = require('body-parser');

// Middleware
app.use(express.json());

// Process the form data

app.get('/hello', (req, res) => { 
    // res.json({"workouts": ["Monday"]});
    var arr = Array.from(Array(0), () => new Array(0));
    res.json([{workoutName: "Monday", arr}]);
    console.log("api called")
    // res.send("Hello World!");
});

// Start the server
// const port = 5000;
// app.listen(port, () => {
//     console.log(`Server started on port ${port}`);
// });

module.exports.handler = serverless(app);