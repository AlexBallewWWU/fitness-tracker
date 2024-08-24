import React, { useEffect } from 'react'
import './AddWorkout.css'
import { useState, useContext } from 'react';
import { accessContext } from '../App'
export { CreateWorkout }

export default function AddWorkout({phase, phaseChange, name, location}) {

    var {workouts, changeWorkouts,workoutLastClicked, changeLastClicked} = useContext(accessContext);
    var justDeleted = false;

    console.log(workouts);

    function phaseNewWorkout(){
        // need to find our location in array and change context hook to be the new number and then pass it to the other div
        if(justDeleted == false){
            console.log(location);
            changeLastClicked(location);
            
            phaseChange("newWorkout");
        }
    }

    function deleteWorkout(){
        justDeleted = true;
        console.log(workouts);
        delete workouts[location];
        console.log(workouts);
        changeWorkouts([... workouts]);

    }

    return (
        <div className='addNewWorkout' onClick={phaseNewWorkout}>
            {name == "" ? "New Workout": name}
            {location == -1 ? <div></div>: <div className='deleteWorkout' style={{paddingLeft: '.64%', paddingRight: '.69%'}} onClick={deleteWorkout}><p style={{fontSize: '5.5vw'}}>X</p></div>}
        </div>
    )
}
 
function CreateWorkout({phaseChange}){
    // console.log("making new workout");
    var {workouts, changeWorkouts, workoutLastClicked} = useContext(accessContext);
    // console.log(workouts);
    var arr = Array.from(Array(0), () => new Array(0));  // 2d array sub, bc js is lame

    var [workout, changeWorkout] = useState({
        workoutName: "",
        arr
    });


    // console.log(workouts);
    useEffect(() =>{
        if(workoutLastClicked > -1){ // we prev set to -1 if it was a newworkout, else we load whatever one they clicked
            // console.log(workouts[0].workoutName);
            // console.log("clicked twice");
            changeWorkout({arr: structuredClone(workouts[workoutLastClicked].arr), workoutName: structuredClone(workouts[workoutLastClicked].workoutName)});
            
            // workout.arr = workouts.arr;
        }
    }, []);


    function backtoHome(){
        if(workoutLastClicked == -1){   
            changeWorkouts([... workouts, workout]);  // save the workout if clicked finish else don't
        } else {
            console.log(workout);
            console.log(workouts);
            workouts[workoutLastClicked].arr = workout.arr;
            workouts[workoutLastClicked].workoutName = workout.workoutName;
            changeWorkouts([... workouts]);
            console.log(workouts);
            // changeWorkouts({arr: workouts[workoutLastClicked].arr, workoutName: workouts[workoutLastClicked].workoutName});
        }
        phaseChange("Home");
    }

    function cancel(){
        // console.log(workout);
        phaseChange("Home");
    }

    function nameChange(event){
        // workoutRoutine.workoutName = event.target.value;
        // console.log(workout);
        console.log(workout);
        changeWorkout({... workout, workoutName: event.target.value}); // HERE!!
        // console.log(workout)
        // console.log(workoutRoutine);
    }

    return (
        <div style={{height: '100%', width: '100%'}}>
            <button className='finished' onClick={backtoHome}>Finish</button>
            <div className='newWorkout'>
                <input type='text' className='workoutName' placeholder='Workout Name' value={workout.workoutName} onChange={nameChange}></input>
                {workout.arr.map((item, index) => {
                    // console.log(item);
                    if (item[0] != null) {
                        // console.log("adding exercises???!!");
                        console.log(item);
                        return <Exercises exercise={item} changeWorkout={changeWorkout} workout={workout} exerciseIndex={index}></Exercises>
                    }
                })}
                <AddExerciseTab workout={workout} changeWorkout={changeWorkout}></AddExerciseTab>
                <button className='cancelLift' onClick={cancel}>Cancel</button>
            </div>
        </div>
    )
}

function AddExerciseTab({workout, changeWorkout}){
    // console.log("adding exercise");
    // console.log(workout);
        // test change
    // all this should do is add a value to map
    function addExercise(){

        var temp = workout.arr;
        temp.push([""]);
        changeWorkout({... workout, arr: temp})
    }

    return(
        <div className='addExercise' onClick={addExercise}> <p>Add Exercise</p></div>
    )
}

function Exercises({exercise, changeWorkout, workout, exerciseIndex}){
    // console.log("yep were here"); kkk
    console.log(exercise);
    var setNum = 0;

    function nameChange(event){
        var temp = workout.arr;
        // console.log(temp);  // need to change this to using array methods later
        temp[exerciseIndex][0] = event.target.value;  // [x][0] will be exercise name, [x][1...] will be sets 
        changeWorkout({... workout, arr: temp})
        // console.log(workout);
        // need to find a way to change exercise value across board
        // changeWorkout({... workout, w: event.target.value});
    }

    function addSet(){
        exercise.push(["", ""]);
        changeWorkout({... workout})
        console.log(exercise);
    }

    function removeExercise(){
        console.log(workout);
        console.log(exerciseIndex);
        delete workout.arr[exerciseIndex];
        // console.log(allSets);
        changeWorkout({... workout})
        console.log(workout);
    }

    return(
        // <div className='addExercise2'><p>Nerd</p></div>
        // same general logic of adding exercies will be added here for sets
        <div style={{width: '100%'}}>
            <div className='exercise-sets-container'>
                <input type='text' className='addExercise2' placeholder={"New Exercise"} value={exercise[0]} onChange={nameChange}></input>
                <div className='deleteExercise' onClick={removeExercise}><p style={{fontSize: "1.7vw"}}>delete</p></div>
            </div>
                <div className='exercise-sets-container' style={{flexDirection: 'column'}}>
                    {exercise.map((item, index) => {
                        if(item != null && index != 0){
                            setNum++;
                            console.log("here");
                            return <Sets setNum={index} exercise={item} workout={workout} changeWorkout={changeWorkout} allSets={exercise} setNUM={setNum}/>
                        }
                    })}
                    <div className='sets' onClick={addSet}><p>Add Set</p></div>
                </div>
        </div>

    )
}

function Sets({setNum, exercise, workout, changeWorkout, allSets, setNUM}){

    console.log(exercise);
    function lbsChange(event){
        exercise[0] = event.target.value;
        changeWorkout({... workout})
    }

    function repChange(event){
        exercise[1] = event.target.value;
        changeWorkout({... workout})
    }

    function removeSet(){
        console.log(allSets);
        delete allSets[setNum];
        console.log(allSets);
        changeWorkout({... workout})
    }

    return (
        <div className='sets-container'>
            <div className='sets2'>
                <p style={{marginLeft: "3%", marginRight: "0%"}}>Set: {setNUM}</p>
                <p style={{marginLeft: "3%", marginRight: "14%"}}>Prev:</p>
                <p style={{marginLeft: "3%", marginRight: "2%"}}>lbs:</p>
                <input className='sets-input' value={exercise[0]} onChange={lbsChange}></input>
                <p style={{marginLeft: "3%", marginRight: "2%"}}>reps:</p>
                <input className='sets-input' value={exercise[1]} onChange={repChange}></input>
            </div>
            <div className='deleteSet'><p style={{fontSize: "2.5vw"}} onClick={removeSet}>X</p></div>
        </div>
    )
}