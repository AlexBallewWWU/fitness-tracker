import React from 'react'
import './AddWorkout.css'
import { useState, useContext } from 'react';
import { accessContext } from '../App'
export { CreateWorkout }

export default function AddWorkout({phase, phaseChange}) {

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
                New Workout
        </div>
    )
}

function CreateWorkout({phaseChange}){
    console.log("making new workout");
    var {workouts, changeWorkouts} = useContext(accessContext);


    function backtoHome(){
    changeWorkouts([... workouts, "test"]);
        phaseChange("Home");
    }

    function cancel(){
        phaseChange("Home");
    }

    return (
        <div style={{height: '100%', width: '100%'}}>
            <button className='finished' onClick={backtoHome}>Finish</button>
            <div className='newWorkout'>
                {/* <div className='newWorkout'></div> */}
                <input type='text' className='workoutName' placeholder='Workout Name'></input>
                <button className='cancelLift' onClick={cancel}>Cancel</button>
            </div>
        </div>
    )
}
