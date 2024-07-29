import React, { useCallback } from 'react'
import './AddWorkout.css'
import { useState } from 'react';
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

    function backtoHome(){
        phaseChange("Home");
    }

    return (
        <div className='newWorkout'>
            <button onClick={backtoHome}></button>
        </div>
    )
}
