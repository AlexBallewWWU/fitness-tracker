import SpotifyTab from './components/SpotifyTab';
import { requestAuth } from './components/Auth';
import React, { useEffect } from 'react';
import { useState } from 'react';

var access = '';
export var accessContext = React.createContext();

function App() {

  const [hasLoaded, setHasLoaded] = useState(false);

  // include useEffect for efficiency as we only need this run once
  useEffect(() => {
    document.body.style.backgroundColor = 'black';
    requestAuth(access).then( (res) => {
      access = res;
      setHasLoaded(true);
    });
  }, []);
  
  if(hasLoaded == true){
    return(
      <accessContext.Provider value={access}>
        <SpotifyTab/>
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
