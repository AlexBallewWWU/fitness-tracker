// import userRoutes from './routes/users.js'

const {
    createPool
} = require('mysql');

const pool = createPool({
    host:"sql3.freesqldatabase.com",
    user:"sql3730463",
    password:"INqXtqtUM9",
    connectionLimit: 10
})

const express = require("express");
// const serverless = require("serverless-http");
// const cors = require("cors");
const app = express();
// app.use(cors());
// const bodyParser = require('body-parser');

// Middleware
app.use(express.json());


// get request to grab all data from server and put in formated storage to be displayed by front end
app.get('/hello', (req, res) => { 
        // 1 query to select all workoutnames
    // store in an array al write more queries for each one to get their data
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
    // pool.query('select * from sql3730463.LastWorkout', (err, result, fields) =>{
    //     if(err){
    //         return console.log(err);
    //     } 
    //     return console.log(result);
    // })
    var arr = Array.from(Array(0), () => new Array(0));
    res.json([{workoutName: "Monday", arr}]);
    // console.log("api called")
    // res.send(response);
});

// post request to add a new workout
app.post('/AddWorkout', (req, res) => {
    pool.query('insert into sql3730463.Workout (workout_name) values ("'+ req.body.workoutName + '")', (err, result, fields) =>{
        if(err){
            return console.log(err);
        }
    })
    console.log(req.body);
    const response = {
        statusCode: 200
    }
    res.send(response);
})

// put request to update a workout (delete old data and add new data)
app.put('/ChangeWorkouts', (req, res) =>{
    
})
// Start the server
const port = 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

// module.exports.handler = serverless(app);