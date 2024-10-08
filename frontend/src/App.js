import SpotifyTab from './components/SpotifyTab';
import { HookToSpotify } from './components/SpotifyTab';
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
  const [spotifyLink, linkSpotify] = useState(false);
  const [workouts, changeWorkouts] = useState([]);
  const [workoutLastClicked, changeLastClicked] = useState(0);

  console.log(workouts);

  // include useEffect for efficiency as we only need this run once on first load
  useEffect(() => {
    if (spotifyLink == false) {
      fetch("https://fitness-tracker2024-8f04514422ed.herokuapp.com/Workouts"
      // fetch("/Workouts"
        , {
          method: 'GET',
        }
      ).then(
        response => response.json()
      ).then(
        data => {
          changeWorkouts(data);
        }
      )
   }

    document.body.style.backgroundColor = 'black';
    if (spotifyLink == true) {  // we check if user has requested spotify link
      requestAuth(access).then((res) => {
        access = res;
        setHasLoaded(true);
        linkSpotify(true);
      });   
    } else if (window.location.search.substring("code")){ // user has requested spotify tab and been redirected back here
      requestAuth(access).then((res) => {
        access = res;
        linkSpotify(true);
        setHasLoaded(true);  // state changes cause page rerender, just a note
      });
    } else { // user has not requested spotify tab
      setHasLoaded(true);
    }
  }, [spotifyLink]); // only run again if user requests spotify tab

  if (hasLoaded == true) {  // need auth to finish before proceeding to here
    return(
      <accessContext.Provider value={{access, workouts, changeWorkouts, workoutLastClicked, changeLastClicked, spotifyLink, linkSpotify}}>
        {phase == "Home" && spotifyLink == false && <SpotifyTab/>}
        {phase == "Home" && spotifyLink == true && <HookToSpotify/>}
        {

        workouts.map((item, index) => {
          if (phase == "Home" && workouts[index] != null) {
            return <AddWorkout phase={phase} phaseChange={phaseChange} name={item.workoutName} key={index} location={index}></AddWorkout>
          }
        })}

        {phase == "Home" && <AddWorkout phase={phase} phaseChange={phaseChange} name={""} location={-1}/>}
        {phase == "newWorkout" && <CreateWorkout phaseChange={phaseChange} workouts={workouts}/>}
      </accessContext.Provider>
    )
  }
}

export default App
