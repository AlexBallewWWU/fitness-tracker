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


// ISSUES: we need to be able 

// get request to grab all data from server and put in formated storage to be displayed by front end
app.get('/Workouts', (req, res) => { 
    var currentCount = 0;
    var totalDataAmount;
        // 1 query to select all workoutnames
    // store in an array al write more queries for each one to get their data
    // var arr = Array.from(Array(0), () => new Array(0));
    var workouts = [];

    pool.query('select (select count(*) from sql3730463.Workout) + (select count(*) from sql3730463.Sets) + (select count(*) from sql3730463.Exercises) as totalCount', 
        (err, result, fields) => {

        if(err){
            return console.log(err);
        }
        return updateTotalExercises(JSON.parse(JSON.stringify(result)));
    });

    function updateTotalExercises(result){
        // console.log("start");
        // console.log(result);
        totalDataAmount = result[0].totalCount;
    }


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
            workouts[workoutNames[i].workout_num] = {workoutName: workoutNames[i].workout_name, arr};
            currentCount++;
        }

        if(currentCount == totalDataAmount){
            // console.log("here1");
            res.send(workouts);
        }

        // console.log(workoutNames.length)
        // populate all the exercise names in the array
        for(var i = 0; i < workoutNames.length; i++){
            pool.query('select * from sql3730463.Exercises natural join sql3730463.Workout where workout_name = "' + workoutNames[i].workout_name + '"', (err, result, fields) => {
                if(err){
                    return console.log(err);
                }
                const temp = JSON.parse(JSON.stringify(result));
                return findExerciseNames(JSON.parse(JSON.stringify(result)), workoutNames);
            });
        }
    }

    // fill in the exercises for a workout
    function findExerciseNames(exerciseTable, workoutTable){
        // console.log(exerciseTable.we)
        var arr = workouts[exerciseTable[0].workout_num].arr;

        for(var i = 0; i < exerciseTable.length; i++){
            var temp = [];
            temp.push(exerciseTable[i].exercise_name);
            arr[exerciseTable[i].exercise_num] = temp;
            currentCount++;
        }

        if(currentCount == totalDataAmount){
            // console.log("here2");
            res.send(workouts);
        }
        
        // loop through all exercises finding the set amounts for each one
        for(var i = 0; i < exerciseTable.length; i++){
            pool.query('select * from sql3730463.Sets natural join sql3730463.Exercises natural join sql3730463.Workout where sql3730463.Sets.workout_name = "' + 
                exerciseTable[0].workout_name + '" and sql3730463.Sets.exercise_name = "' + exerciseTable[i].exercise_name + '"', (err, result, fields) => {
                if(err){
                    return console.log(err);
                }
                return findSets(JSON.parse(JSON.stringify(result)));
                // return console.log(JSON.parse(JSON.stringify(result)));
            });
        }
    }

    function findSets(completeTable){
        if(completeTable.length < 1){
            return;
        }
        // console.log("SETS");
        for(var i = 0; i < completeTable.length; i++){
            workouts[completeTable[0].workout_num].arr[completeTable[i].exercise_num][completeTable[i].set_num + 1] = ([completeTable[i].lbs, completeTable[i].reps]);
            currentCount++;
        }
        // console.log(workouts);

        // console.log(currentCount);
        // console.log(totalDataAmount);
        if(currentCount == totalDataAmount){
            console.log("here3");
            res.send(workouts);
        }
    }

    // NOTE: could better runtime by having functions execute concurrently, try later
    // function findExerciseNames(exerciseNames, workoutNames){
    //     var arr = workouts[workoutNameQueryNum].arr;

    //     for(var i = 0; i < exerciseNames.length; i++){
    //         var temp = [];
    //         temp.push(exerciseNames[i].exercise_name);
    //         arr.push(temp);
    //     }
    //     // write a query to find sets for exercise, need a loop for workout
    //     for(var i = 0; i < exerciseNames.length; i++){
            // pool.query('select lbs, reps from sql3730463.Sets where sql3730463.Sets.workout_name = "' + 
            //     workoutNames[workoutNameQueryNum].workout_name + '" and sql3730463.Sets.exercise_name = "' + exerciseNames[i].exercise_name + '"', (err, result, fields) => {
            //     if(err){
            //         return console.log(err);
            //     }
            //     // return findSets(JSON.parse(JSON.stringify(result)), exerciseNames, workoutNames);
            //     return upt();
            // });
    //     }

    // }






    // fill in values for sets
    // function findSets(sets, exerciseNames, workoutNames){
    //     for(var i = 1; i < sets.length + 1; i++){
    //         // console.log(workoutNameQueryNum2);
    //         // console.log(exerciseNameQueryNum);
    //         workouts[workoutNameQueryNum2].arr[exerciseNameQueryNum][i] = [sets[i - 1].lbs, sets[i - 1].reps];
    //     }
    //     exerciseNameQueryNum++;
    //     if(exerciseNameQueryNum == exerciseNames.length){
    //         exerciseNameQueryNum = 0;
    //         workoutNameQueryNum2++;
    //     }
    //     if(workoutNameQueryNum2 == workoutNames.length){
    //         res.send(workouts);
    //     }
    // }
});

// post request to add a new workout
app.post('/AddWorkout', (req, res) => {

    // query to add the workoutname to server
    pool.query('insert into sql3730463.Workout (workout_name, workout_num) values ("'+ req.body.workoutName + '", ' + req.body.workoutNum 
        + ')', (err, result, fields) => {
        if(err){
            return console.log(err);
        }
    })
    
    // query to add all the exercises to sever
    for(var i = 0; i < req.body.exercises.length; i++){
        pool.query('insert into sql3730463.Exercises (workout_name, exercise_name, exercise_num) values ("' + 
            req.body.workoutName + '", "' + req.body.exercises[i][0] + '", "' + i + '")', (err, result, fields) => {
            if(err){
                return console.log(err);
            }
        })
    }

    // query to add all the sets to the server
    for(var i = 0; i < req.body.exercises.length; i++){
        for(var j = 1; j < req.body.exercises[i].length; j++){
            // console.log("adding sets");
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

app.delete('/DeleteWorkout', (req, res) =>{
    console.log(req.body);
    pool.query('delete from sql3730463.Workout where sql3730463.Workout.workout_name = "' + req.body.workoutName + '"', 
        (err, result, fields) => {

        if(err){
            return console.log(err);
        }
        // return updateTotalExercises(JSON.parse(JSON.stringify(result)));
    });

    pool.query('delete from sql3730463.Exercises where sql3730463.Exercises.workout_name = "' + req.body.workoutName + '"', 
        (err, result, fields) => {

        if(err){
            return console.log(err);
        }
        // return updateTotalExercises(JSON.parse(JSON.stringify(result)));
    });

    pool.query('delete from sql3730463.Sets where sql3730463.Sets.workout_name = "' + req.body.workoutName + '"', 
        (err, result, fields) => {

        if(err){
            return console.log(err);
        }
        // return updateTotalExercises(JSON.parse(JSON.stringify(result)));
    });

});

// put request to update a workout (delete old data and add new data)
app.put('/ChangeWorkouts', (req, res) =>{
    
})
// Start the server
const port = 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

// module.exports.handler = serverless(app);