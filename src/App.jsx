import { useState } from 'react';
import StartScreen from './components/StartScreen'; // Componenta ta inițială
import CameraPrincipala from './components/DarkRoom'; // Camera cu obiecte

function App() {
  // Starea care decide ce componentă se afișează
  const [ecranCurent, setEcranCurent] = useState('start');

  return (
    <div style={{ width: '100%', height: '100vh', margin: 0, padding: 0 }}>
      
      {/* Dacă suntem la început, afișăm ecranul de start */}
      {ecranCurent === 'start' && (
        <StartScreen onStart={() => setEcranCurent('joc')} />
      )}

      {/* Dacă a apăsat 'ÎNCEPE', afișăm camera */}
      {ecranCurent === 'joc' && (
        <CameraPrincipala />
      )}

    </div>
  );
}

export default App;