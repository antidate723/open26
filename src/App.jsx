import { useState } from 'react';
import StartScreen from './components/StartScreen'; 
import CameraPrincipala from './components/DarkRoom'; 

function App() {
  
  const [ecranCurent, setEcranCurent] = useState('start');

  return (
    <div style={{ width: '100%', height: '100vh', margin: 0, padding: 0 }}>
      
     
      {ecranCurent === 'start' && (
        <StartScreen onStart={() => setEcranCurent('joc')} />
      )}

      
      {ecranCurent === 'joc' && (
        <CameraPrincipala />
      )}

    </div>
  );
}

export default App;