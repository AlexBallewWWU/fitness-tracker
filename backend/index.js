// import userRoutes from './routes/users.js'


const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const app = express();
app.use(cors());
// const bodyParser = require('body-parser');

// Middleware
app.use(express.json());

// Process the form data

app.get('/hello', (req, res) => { 
    // res.json({"workouts": ["Monday"]});
    // const response = {
    //     statusCode: 200,
    //     headers: {
    //         "Access-Control-Allow-Headers" : "Content-Type",
    //         "Access-Control-Allow-Origin": "*",
    //         "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    //     },
    //     body: JSON.stringify('Hello from Lambda!'),
    // };
    // return response;
    var arr = Array.from(Array(0), () => new Array(0));
    res.json([{workoutName: "Monday", arr}]);
    // console.log("api called")
    // res.send(response);
});

// Start the server
// const port = 5000;
// app.listen(port, () => {
//     console.log(`Server started on port ${port}`);
// });

module.exports.handler = serverless(app);