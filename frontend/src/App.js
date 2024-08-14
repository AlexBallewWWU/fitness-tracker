import SpotifyTab from './components/SpotifyTab';
import { requestAuth } from './components/Auth';
import React, { useEffect, useState } from 'react';
import AddWorkout from './components/AddWorkout';
import { CreateWorkout, Ad } from './components/AddWorkout';

// we create a context so that all components can access spotify token
var access = '';
export var accessContext = React.createContext();

function App() {

  const [hasLoaded, setHasLoaded] = useState(false);
  const [phase, phaseChange] = useState("Home");
  const [workouts, changeWorkouts] = useState([]);
  // we will store all of the works outs here as obejects and 
  // in useEffect we will pack it full of the previous ones and add to it
  // then it will be returned here as to automatically keep updating the page for us using the map array function
  // all workouts will be kept in this array, so if they delete one after we call the backend
  // it will remove it from the server for us
  // var workouts = [];
  console.log(workouts);
  // console.log(workouts);

  // include useEffect for efficiency as we only need this run once
  useEffect(() => {
    document.body.style.backgroundColor = 'black';
    requestAuth(access).then( (res) => {
      access = res;
      setHasLoaded(true);  // state changes cause page rerender, just a note
    });
  }, []);
  
  if(hasLoaded == true){  // need auth to finish before proceeding to here
    return(
      <accessContext.Provider value={{access, workouts, changeWorkouts}}>
        {phase == "Home" && <SpotifyTab/>}
        {workouts.map((item) => ( // need to add new UI for onClick for these now
            phase == "Home" && <AddWorkout phase={phase} phaseChange={phaseChange} name={item.workoutName}></AddWorkout>
        ))}

        {phase == "Home" && <AddWorkout phase={phase} phaseChange={phaseChange} name={""}/>}
        {phase == "newWorkout" && <CreateWorkout phaseChange={phaseChange} workouts={workouts}/>}
        {/* {test} */}
      </accessContext.Provider>
    )
  }
}











// function App() {

//   const [backendData, setBackendData] = useState([{}])

//   useEffect(() => {
//     fetch("/api").then(
//       response => response.json()
//     ).then(
//       data => {
//         setBackendData(data)
//         console.log(data);
//       }
//     )
    
//   }, [])

//   return (
//     <div>

//     </div>
//   )
// }

export default App
