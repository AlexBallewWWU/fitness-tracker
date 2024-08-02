import SpotifyTab from './components/SpotifyTab';
import { requestAuth } from './components/Auth';
import React, { useEffect, useState } from 'react';
import AddWorkout from './components/AddWorkout';
import { CreateWorkout } from './components/AddWorkout';

// we create a context so that all components can access spotify token
var access = '';
export var accessContext = React.createContext();

function App() {

  const [hasLoaded, setHasLoaded] = useState(false);
  const [phase, phaseChange] = useState("Home");
  const [workouts, changeWorkouts] = useState([]);
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
        {phase == "Home" && <AddWorkout phase={phase} phaseChange={phaseChange}/>}
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
