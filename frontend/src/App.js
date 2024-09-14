import SpotifyTab from './components/SpotifyTab';
import { requestAuth } from './components/Auth';
import React, { useEffect, useState } from 'react';
import AddWorkout from './components/AddWorkout';
import { CreateWorkout, Ad } from './components/AddWorkout';

// we create a context so that all components can access spotify token
var access = '';

export var accessContext = React.createContext();

// How workouts are stored:

//  workouts[
//    {
//      "workoutName", 
//      exercises[
//        "exerciseName", sets[
//          [lbs, reps], . . . ]
//    }
//  , . . . ] 

// English: An array which holds all workouts stored as objects
// each object contains a workoutname and an array of exercises
// each exercise first value is its name (should've proably been an object) the other value is a 2 value array
// the 2 value array holds lbs and reps

function App() {

  const [hasLoaded, setHasLoaded] = useState(false);
  const [phase, phaseChange] = useState("Home");
  const [workouts, changeWorkouts] = useState([]);
  const [workoutLastClicked, changeLastClicked] = useState(0);

  console.log(workouts);

  // include useEffect for efficiency as we only need this run once on first load
  useEffect(() => {
    fetch("https://iz0auu3tbh.execute-api.us-east-2.amazonaws.com/prod/Workouts").then(
      response => response.json()
    ).then(
      // fetch("/Workouts").then(
      //   response => response.json()
      // ).then(
      data => {
        // setBackendData(data)
        console.log(workouts);
        console.log(data);
        changeWorkouts(data);
      }
    )
//
    document.body.style.backgroundColor = 'black';
    requestAuth(access).then( (res) => {
      access = res;
      setHasLoaded(true);  // state changes cause page rerender, just a note
    });
  }, []);

  if(hasLoaded == true){  // need auth to finish before proceeding to here
    return(
      <accessContext.Provider value={{access, workouts, changeWorkouts, workoutLastClicked, changeLastClicked}}>
        {phase == "Home" && <SpotifyTab/>}
        {

        workouts.map((item, index) => {
          if(phase == "Home" && workouts[index] != null){
            return <AddWorkout phase={phase} phaseChange={phaseChange} name={item.workoutName} key={index} location={index}></AddWorkout>
          }
        })}

        {phase == "Home" && <AddWorkout phase={phase} phaseChange={phaseChange} name={""} location={-1}/>}
        {phase == "newWorkout" && <CreateWorkout phaseChange={phaseChange} workouts={workouts}/>}
      </accessContext.Provider>
    )
  }
}









// function App() {

//   const [backendData, setBackendData] = useState([{}])

//   useEffect(() => {
    // fetch("/api").then(
    //   response => response.json()
    // ).then(
    //   data => {
    //     setBackendData(data)
    //     console.log(data);
    //   }
    // )

//   }, [])

//   return (
//     <div>

//     </div>
//   )
// }

export default App
