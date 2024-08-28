import React, { useEffect } from 'react'
import './AddWorkout.css'
import { useState, useContext } from 'react';
import { accessContext } from '../App'
export { CreateWorkout }

export default function AddWorkout({phaseChange, name, location}) {

    var {workouts, changeWorkouts, changeLastClicked} = useContext(accessContext);
    var justDeleted = false;  // need this to make sure we don't save a deleted workout

    function phaseNewWorkout(){
        // need to find our location in array and change context hook to be the new number and then pass it to the other div
        if(justDeleted == false){
            changeLastClicked(location);
            phaseChange("newWorkout");
        }
    }

    function deleteWorkout(){
        justDeleted = true;
        delete workouts[location];
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

    var {workouts, changeWorkouts, workoutLastClicked} = useContext(accessContext);
    var arr = Array.from(Array(0), () => new Array(0));  // 2d array

    // use this for saving a current workout
    var [workout, changeWorkout] = useState({
        workoutName: "",
        arr
    });

    useEffect(() =>{
        if(workoutLastClicked > -1){ // we prev set to -1 if it was a newworkout, else we load whatever one they clicked
            changeWorkout({arr: structuredClone(workouts[workoutLastClicked].arr),  // save a clone as to not automatically update changes
                workoutName: structuredClone(workouts[workoutLastClicked].workoutName)});
        }
    }, []);

    // function to return to home screen
    function backtoHome(){
        if(workoutLastClicked == -1){  // -1 means first time saving workout
            changeWorkouts([... workouts, workout]);  // save the workout if clicked finish else don't
        } else {   // update changes
            workouts[workoutLastClicked].arr = workout.arr;
            workouts[workoutLastClicked].workoutName = workout.workoutName;
            changeWorkouts([... workouts]);
        }
        phaseChange("Home");
    }

    // cancel workout and dont't update changes
    function cancel(){
        phaseChange("Home");
    }

    function nameChange(event){
        changeWorkout({... workout, workoutName: event.target.value});
    }

    return (
        <div style={{height: '100%', width: '100%'}}>
            <button className='finished' onClick={backtoHome}>Finish</button>
            <div className='newWorkout'>
                <input type='text' className='workoutName' placeholder='Workout Name' value={workout.workoutName} onChange={nameChange}></input>
                {workout.arr.map((item, index) => {
                    if (item[0] != null) {
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

    // all this does is add a value to the array to later map
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
    
    var setNum = 0;  // need this later for tracking what set num we are on

    function nameChange(event){
        var temp = workout.arr;
        temp[exerciseIndex][0] = event.target.value;  // [x][0] will be exercise name, [x][1...] will be sets 
        changeWorkout({... workout, arr: temp})
    }

    // add another value to array to map
    function addSet(){
        exercise.push(["", ""]);
        changeWorkout({... workout})
    }

    // remove array value and update state
    function removeExercise(){
        delete workout.arr[exerciseIndex];
        changeWorkout({... workout})
    }

    return(
        <div style={{width: '100%'}}>
            <div className='exercise-sets-container'>
                <input type='text' className='addExercise2' placeholder={"New Exercise"} value={exercise[0]} onChange={nameChange}></input>
                <div className='deleteExercise' onClick={removeExercise}><p style={{fontSize: "1.5vw"}}>delete</p></div>
            </div>
                <div className='exercise-sets-container' style={{flexDirection: 'column'}}>
                    {exercise.map((item, index) => {
                        if(item != null && index != 0){
                            setNum++;
                            return <Sets setNum={index} exercise={item} workout={workout} changeWorkout={changeWorkout} allSets={exercise} setNUM={setNum}/>
                        }
                    })}
                    <div className='sets' onClick={addSet}><p>Add Set</p></div>
                </div>
        </div>

    )
}

function Sets({setNum, exercise, workout, changeWorkout, allSets, setNUM}){

    function lbsChange(event){
        exercise[0] = event.target.value;
        changeWorkout({... workout})
    }

    function repChange(event){
        exercise[1] = event.target.value;
        changeWorkout({... workout})
    }

    function removeSet(){
        delete allSets[setNum];
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