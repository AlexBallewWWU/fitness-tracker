import React from 'react'
import './AddWorkout.css'
import { useState, useContext } from 'react';
import { accessContext } from '../App'
export { CreateWorkout }

export default function AddWorkout({phase, phaseChange, name}) {

    function changeBackground(e) {
        e.target.style.background = 'green';
    }

    function changeBackgroundBack(e) {
        e.target.style.background = 'black';
        e.target.style.color = 'white';
    }

    function phaseNewWorkout(){
        phaseChange("newWorkout");
    }

    return (
        <div className='addNewWorkout' onMouseOver={changeBackground} onMouseLeave={changeBackgroundBack}
            onClick={phaseNewWorkout}>
                {name == "" ? "New Workout": name}
        </div>
    )
}

function CreateWorkout({phaseChange}){
    console.log("making new workout");
    var {workouts, changeWorkouts} = useContext(accessContext);
    var arr = Array.from(Array(15), () => new Array(15));  // 2d array sub, bc js is lame
    // arr[0][0] = "potato";

    var [workout, changeWorkout] = useState({
        workoutName: "monday",
        arr
    });

    function backtoHome(){
        changeWorkouts([... workouts, workout]);  // save the workout if clicked finish else don't
        phaseChange("Home");
    }

    function cancel(){
        console.log(workout);
        phaseChange("Home");
    }

    function nameChange(event){
        // workoutRoutine.workoutName = event.target.value;
        changeWorkout({workoutName: event.target.value, arr});
        // console.log(workoutRoutine);
    }

    return (
        <div style={{height: '100%', width: '100%'}}>
            <button className='finished' onClick={backtoHome}>Finish</button>
            <div className='newWorkout'>
                {/* <div className='newWorkout'></div> */}
                <input type='text' className='workoutName' placeholder='Workout Name' onChange={nameChange}></input>
                <button className='cancelLift' onClick={cancel}>Cancel</button>
                {/* <Exercises workout={workout}></Exercises> */}
                {workout.arr.map((item) => {
                    console.log(item);
                    if(item[0] != null){
                        return <Exercises workout={item}></Exercises>
                    }
                })}
                <AddExerciseTab workout={workout} changeWorkout={changeWorkout}></AddExerciseTab>
            </div>
        </div>
    )
}

function AddExerciseTab({workout, changeWorkout}){
    console.log("adding exercise");

    // all this should do is add a value to map
    function addExercise(){
        // workoutRoutine.arr[0][0] = 'foo';
        var temp = workout.arr;
        temp[0][0] = "nice";
        // workout.arr[0][0] = "nice";
        console.log(temp);
        // temp[0][0] = "pepe";
        // changeWorkout(workout);
        changeWorkout({... workout, 
            arr: temp})
        // console.log(temp);
    }

    return(
        <div style={{height: "100%", width: "100%"}}>
            <div className='addExercise' onClick={addExercise}> <p>Add Exercise</p></div>
        </div>
    )
}

function Exercises({workout}){
    console.log("yep were here");
    console.log(workout);
    // console.log("in exercises");
    return(
        <div className='addExercise2'><p>Nerd</p></div>
    )
}