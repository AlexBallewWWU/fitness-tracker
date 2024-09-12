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
app.get('/Workouts', (req, res) => { 
    var exerciseNameQueryNum = 0;
        // 1 query to select all workoutnames
    // store in an array al write more queries for each one to get their data
    // var arr = Array.from(Array(0), () => new Array(0));
    var workouts = [];

    pool.query('select * from sql3730463.Workout', (err, result, fields) => {
        if(err){
            return console.log(err);
        }
        return findWorkoutNames(JSON.parse(JSON.stringify(result)));
    });

    function findWorkoutNames(workoutNames){

        // populate all the workout names in the array 
        for(var i = 0; i < workoutNames.length; i++){
            var arr = [];
            workouts.push({workoutName: workoutNames[i].workout_name, arr});
        }

        // populate all the exercise names in the array
        for(var i = 0; i < workoutNames.length; i++){
            pool.query('select * from sql3730463.Exercises where sql3730463.Exercises.workout_name = "' + workoutNames[i].workout_name + '"', (err, result, fields) => {
                if(err){
                    return console.log(err);
                }
                return findExerciseNames(JSON.parse(JSON.stringify(result)), i, workoutNames.length - 1);
            });
        }
    }

    function findExerciseNames(exerciseNames, currentQueryNum, maxQueries){
        var arr = workouts[exerciseNameQueryNum].arr;
        // console.log(exerciseNameQueryNum);
        // console.log(workouts);
        // arr.push("penis")
        // console.log(arr);


        for(var i = 0; i < exerciseNames.length; i++){
            var temp = [];
            temp.push(exerciseNames[i].exercise_name);
            arr.push(temp);
        }
        console.log(workouts[0].arr);
        // console.log("here");
        // console.log(arr);
        console.log(maxQueries + " " + exerciseNameQueryNum)
        if(maxQueries == exerciseNameQueryNum){
            console.log("here");
            findSets();
        }
        exerciseNameQueryNum++;
    }

    function findSets(){
        res.send(workouts);
    }


});

// post request to add a new workout
app.post('/AddWorkout', (req, res) => {

    // query to add the workoutname to server
    pool.query('insert into sql3730463.Workout (workout_name) values ("'+ req.body.workoutName + '")', (err, result, fields) => {
        if(err){
            return console.log(err);
        }
    })
    
    // query to add all the exercises to sever
    for(var i = 0; i < req.body.exercises.length; i++){
        pool.query('insert into sql3730463.Exercises (workout_name, exercise_name) values ("' + 
            req.body.workoutName + '", "' + req.body.exercises[i][0] + '")', (err, result, fields) => {
            if(err){
                return console.log(err);
            }
        })
    }

    // query to add all the sets to the server
    for(var i = 0; i < req.body.exercises.length; i++){
        for(var j = 1; j < req.body.exercises[i].length; j++){
            var temp = req.body.exercises[i][j];
            pool.query('insert into sql3730463.Sets (workout_name, exercise_name, set_num, lbs, reps) values ("' + 
                req.body.workoutName + '", "' + req.body.exercises[i][0] + '", "' + j + '", "' + temp[0] + '", "' + temp[1] +
                '")', (err, result, fields) => {
                if(err){
                    return console.log(err);
                }
            })
        }

    }

    // console.log(req.body);
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