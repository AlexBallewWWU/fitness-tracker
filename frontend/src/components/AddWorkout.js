import React, { useEffect } from 'react'
import './AddWorkout.css'
import { useState, useContext } from 'react';
import { accessContext } from '../App'
export { CreateWorkout }

var numExercises = 0;

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
    console.log(workouts);
    var arr = Array.from(Array(15), () => new Array(15));  // 2d array sub, bc js is lame
    
    var [workout, changeWorkout] = useState({
        workoutName: "",
        arr
    });


    console.log(workouts);
    useEffect(() =>{
        if(workouts.length > 0 && workouts.workoutName != ""){
            console.log(workouts[0].workoutName);
            console.log("clicked twice");
            changeWorkout({arr: workouts[0].arr, workoutName: workouts[0].workoutName});
            // workout.arr = workouts.arr;
        }
    }, []);


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
        console.log(workout);
        changeWorkout({... workout, workoutName: event.target.value}); // HERE!!
        console.log(workout)
        // console.log(workoutRoutine);
    }

    return (
        <div style={{height: '100%', width: '100%'}}>
            <button className='finished' onClick={backtoHome}>Finish</button>
            <div className='newWorkout'>
                <input type='text' className='workoutName' placeholder='Workout Name' value={workout.workoutName} onChange={nameChange}></input>
                {workout.arr.map((item, index) => {
                    console.log(item);
                    if (item[0] != null) {
                        console.log("adding exercises???!!");
                        console.log(index);
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
    console.log("adding exercise");
    console.log(workout);

    // all this should do is add a value to map
    function addExercise(){
        var temp = workout.arr;
        temp[numExercises][0] = "";  // [x][0] will be exercise name, [x][1...] will be sets 
        console.log(temp);
        numExercises++;
        changeWorkout({... workout, arr: temp})
    }

    return(
        <div className='addExercise' onClick={addExercise}> <p>Add Exercise</p></div>
    )
}

function Exercises({exercise, changeWorkout, workout, exerciseIndex}){
    console.log("yep were here");
    console.log(exercise);

    function nameChange(event){
        var temp = workout.arr;
        console.log(temp);
        temp[exerciseIndex][0] = event.target.value;  // [x][0] will be exercise name, [x][1...] will be sets 
        changeWorkout({... workout, arr: temp})
        console.log(workout);
        // need to find a way to change exercise value across board
        // changeWorkout({... workout, w: event.target.value});
    }

    return(
        // <div className='addExercise2'><p>Nerd</p></div>
        <input type='text' className='addExercise2' placeholder={"New Exercise"} value={exercise[0]} onChange={nameChange}></input>
    )
}