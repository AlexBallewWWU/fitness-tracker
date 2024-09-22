const mysql = require("mysql")
const dotenv = require("dotenv")
const express = require('express');
const app = express();
const cors = require('cors');

//p
dotenv.config({ path: __dirname + '/.env' });

// // create mysql database connection
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
})

app.use(cors({
    origin: 'https://fitness-tracker-frontend-c27dcf177753.herokuapp.com',
    methods: ["GET", "POST", "DELETE", "PUT"]
}   
));

const headers = (req, res, next) => {
	const origin = (req.headers.origin == 'https://fitness-tracker-frontend-c27dcf177753.herokuapp.com') ? 'https://fitness-tracker-frontend-c27dcf177753.herokuapp.com' : 'https://fitness-tracker2024-8f04514422ed.herokuapp.com'
	res.setHeader('Access-Control-Allow-Origin', 'https://fitness-tracker-frontend-c27dcf177753.herokuapp.com')
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
	res.setHeader('Access-Control-Allow-Headers', 'content-type')
	// res.setHeader('Access-Control-Allow-Credentials', true)
	next()
}

// module.exports = headers;

let port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// pool.getConnection((err, conn) => {
//     if(err){
//         console.log(err);
//     } else {
//         console.log("connection successful");
//     }
// })
// ISSUES: we need to be able 


app.get('/contact', headers, (req, res) => {
	res.send("hi");
})

// get request to grab all data from server and put in formated storage to be displayed by front end
app.get('/Workouts', headers, (req, res) => { 

    console.log("getting workouts");
    var currentCount = 0;
    var totalDataAmount;
    var workouts = [];
    try {
        pool.query('select (select count(*) from sql3730463.Workout) + (select count(*) from sql3730463.Sets) + (select count(*) from sql3730463.Exercises) as totalCount', 
            (err, result, fields) => {

            if(err){
                return res.send(err);
            }
            return updateTotalExercises(JSON.parse(JSON.stringify(result)));
        });

        function updateTotalExercises(result){
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
            if(exerciseTable.length < 1){
                return;
            }
            var arr = workouts[exerciseTable[0].workout_num].arr;

            for(var i = 0; i < exerciseTable.length; i++){
                var temp = [];
                temp.push(exerciseTable[i].exercise_name);
                arr[exerciseTable[i].exercise_num] = temp;
                currentCount++;
            }

            if(currentCount == totalDataAmount){
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
    } catch (e) {
        console.log("error below");
        console.log(e);
    }
});

// post request to add a new workout
app.post('/addworkout', headers, (req, res) => {
    
    addValuesServer(req.body.workoutName, req.body.workoutNum, req.body.exercises);
    res.send("GOOD");

    // const response = {
    //     statusCode: 200
    // }
    // res.send(response);
})

app.delete('/DeleteWorkout', headers, async (req, res) => {
    let result = deleteValuesServer(req.body.workoutName);
    if(result == true){
        res.send("first done");
    }
});

// put request to update a workout (delete old data and add new data)
app.put('/ChangeWorkout', headers, async (req, res) =>{

    //

    console.log(req.body);
    let result = await deleteValuesServer(req.body.workoutName); // need queries to finish running
    if(result == true){ // we need to delete before adding or else we'll delete new data
        console.log("delete success");
        addValuesServer(req.body.workoutName, req.body.workoutNum, req.body.exercises);
        // await sleep(2000)
        // function sleep(ms) {
        //     return new Promise((resolve) => {
        //         setTimeout(resolve, ms);
        //     });
        // }
        res.send("Okay");
    }
})

async function deleteValuesServer(workoutName){
    // these aync functions are needed to determine when queires are done
    let deleteWorkoutTable = async() => {
        let results = await new Promise((resolve, reject)  => pool.query('delete from sql3730463.Workout where sql3730463.Workout.workout_name = "' + workoutName + '"', 
            (err, result, fields) => {

            if(err){
                return console.log(err);
            }
            resolve(result);
        }));
        return true;
    }

    let deleteExerciseTable = async() => {
        let results = await new Promise((resolve, reject)  => pool.query('delete from sql3730463.Exercises where sql3730463.Exercises.workout_name = "' + workoutName + '"', 
            (err, result, fields) => {

            if(err){
                return console.log(err);
            }
            resolve(result);
        }));
        return true;
    }

    let deleteSetsTable = async() => {
        let results = await new Promise((resolve, reject)  => pool.query('delete from sql3730463.Sets where sql3730463.Sets.workout_name = "' + workoutName + '"', 
            (err, result, fields) => {

            if(err){
                return console.log(err);
            }
            resolve(result);
        }));
        return true;
    }

    // make sure all queries executed correctly 
    let query1 = await deleteWorkoutTable();
    let query2 = await deleteExerciseTable();
    let query3 = await deleteSetsTable();
    
    if(query1 == true && query2 == true && query3 == true){
        console.log("delete success-1");
        return true;
    }
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
    for(var i = 0; exercises[i] != null; i++){
        pool.query('insert into sql3730463.Exercises (workout_name, exercise_name, exercise_num) values ("' + 
            workoutName + '", "' + exercises[i][0] + '", "' + i + '")', (err, result, fields) => {
            if(err){
                return console.log(err);
            }
        })
    }

    // query to add all the sets to the server
    for(var i = 0; exercises[i] != null; i++){
        for(var j = 1; exercises[i][j] != null; j++){
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

