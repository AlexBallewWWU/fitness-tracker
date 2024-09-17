// import userRoutes from './routes/users.js'

const {
    createPool
} = require('mysql');

const mysql = require("mysql")
const dotenv = require("dotenv")

dotenv.config({ path: __dirname + '/.env' });

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    // connectionLimit: 10
})

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

let port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

pool.getConnection((err, conn) => {
    if(err){
        console.log(err);
    } else {
        console.log("connection successful");
    }
})
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
        return beginFillingData();
    }

    function beginFillingData(){
        pool.query('select * from sql3730463.Workout', (err, result, fields) => {
            if(err){
                return console.log(err);
            }
            return findWorkoutNames(JSON.parse(JSON.stringify(result)));
        });
    }

    function findWorkoutNames(workoutNames){

        // populate all the workout names in the array 
        for(var i = 0; i < workoutNames.length; i++){
            var arr = [];
            workouts[workoutNames[i].workout_num] = {workoutName: workoutNames[i].workout_name, arr};
            currentCount++;
        }

        if(currentCount == totalDataAmount){
            console.log("here1");
            res.send(workouts);
        } else {
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
        } else {
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
    }

    function findSets(completeTable){
        if(completeTable.length < 1){
            return;
        }

        for(var i = 0; i < completeTable.length; i++){
            workouts[completeTable[0].workout_num].arr[completeTable[i].exercise_num][completeTable[i].set_num + 1] = ([completeTable[i].lbs, completeTable[i].reps]);
            currentCount++;
        }
        
        if(currentCount == totalDataAmount){
            console.log("here3");
            res.send(workouts);
        }
    }
});

// post request to add a new workout
app.post('/AddWorkout', (req, res) => {

    addValuesServer(req.body.workoutName, req.body.workoutNum, req.body.exercises);

    const response = {
        statusCode: 200
    }
    res.send(response);
})

app.delete('/DeleteWorkout', (req, res) => {
    deleteValuesServer(req.body.workoutName);
});

// put request to update a workout (delete old data and add new data)
app.put('/ChangeWorkout', async (req, res) =>{

    console.log(req.body);
    let result = await deleteValuesServer(req.body.workoutName);
    // if(deleteValuesServer(req.body.workoutName) == true){
        // console.log("delete success");
        // addValuesServer(req.body.workoutName, req.body.workoutNum, req.body.exercises);
    // } else {
    //     // send error
    // }
    if(result == true){
        console.log("delete success");
        addValuesServer(req.body.workoutName, req.body.workoutNum, req.body.exercises);
    }
})

async function deleteValuesServer(workoutName){
    let deleteWorkoutTable = async() => {
        let results = await new Promise((resolve, reject)  => pool.query('delete from sql3730463.Workout where sql3730463.Workout.workout_name = "' + workoutName + '"', 
            (err, result, fields) => {

            if(err){
                return console.log(err);
            }
            resolve(result);
            // return updateTotalExercises(JSON.parse(JSON.stringify(result)));
            // return true;
        }));
        console.log(results);
        return true;
    }

    let deleteExerciseTable = async() => {
        let results = await new Promise((resolve, reject)  => pool.query('delete from sql3730463.Exercises where sql3730463.Exercises.workout_name = "' + workoutName + '"', 
            (err, result, fields) => {

            if(err){
                return console.log(err);
            }
            resolve(result);
            // return updateTotalExercises(JSON.parse(JSON.stringify(result)));
            // return true;
        }));
        console.log(results);
        return true;
    }

    let deleteSetsTable = async() => {
        let results = await new Promise((resolve, reject)  => pool.query('delete from sql3730463.Sets where sql3730463.Sets.workout_name = "' + workoutName + '"', 
            (err, result, fields) => {

            if(err){
                return console.log(err);
            }
            resolve(result);
            // return updateTotalExercises(JSON.parse(JSON.stringify(result)));
            // return true;
        }));
        console.log(results);
        return true;
    }

    let query1 = await deleteWorkoutTable();
    let query2 = await deleteExerciseTable();
    let query3 = await deleteSetsTable();

    
    if(query1 == true && query2 == true && query3 == true){
        console.log("delete success-1");
        return true;
    }

    // function deleteExerciseTable(){
    //     pool.query('delete from sql3730463.Exercises where sql3730463.Exercises.workout_name = "' + workoutName + '"', 
    //         (err, result, fields) => {

    //         if(err){
    //             return console.log(err);
    //         }
    //         return true;
    //     });
    // }

    // function deleteSetTable(){
    //     pool.query('delete from sql3730463.Sets where sql3730463.Sets.workout_name = "' + workoutName + '"', 
    //         (err, result, fields) => {

    //         if(err){
    //             return console.log(err);
    //         }
    //         return true;
    //     });
    // }
}

// check why made it to line 225 when no exercises
function addValuesServer(workoutName, workoutNum, exercises){
    console.log(exercises);
    // query to add the workoutname to server
    pool.query('insert into sql3730463.Workout (workout_name, workout_num) values ("'+ workoutName + '", ' + workoutNum 
        + ')', (err, result, fields) => {
        if(err){
            return console.log(err);
        }
    })

    // query to add all the exercises to sever
    for(var i = 0; i < exercises.length; i++){
        pool.query('insert into sql3730463.Exercises (workout_name, exercise_name, exercise_num) values ("' + 
            workoutName + '", "' + exercises[i][0] + '", "' + i + '")', (err, result, fields) => {
            if(err){
                return console.log(err);
            }
        })
    }

    // query to add all the sets to the server
    for(var i = 0; i < exercises.length; i++){
        for(var j = 1; j < exercises[i].length; j++){
            // console.log("adding sets");
            var temp = exercises[i][j];
            pool.query('insert into sql3730463.Sets (workout_name, exercise_name, set_num, lbs, reps) values ("' + 
                workoutName + '", "' + exercises[i][0] + '", "' + j + '", "' + temp[0] + '", "' + temp[1] +
                '")', (err, result, fields) => {
                if(err){
                    return console.log(err);
                }
            })
        }

    }
}

// Start the server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
