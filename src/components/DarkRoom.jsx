import { useState } from 'react';
import CutieDialog from '../components/CutieDialog'; // Importă componenta de dialog
import '../components_css/DarkRoom.css'

export default function CameraPrincipala() {
  // Când camera se încarcă, pornește direct cu dialogul de intro
  const [dialogActiv, setDialogActiv] = useState('intro_camera');

  return (
    <div className="camera-container">


     
      {/* Aici e logica care afișează dialogul dacă dialogActiv NU este null */}
      {dialogActiv && (
        <CutieDialog 
          dialogId={dialogActiv} 
          onDialogTerminat={() => setDialogActiv(null)} 
        />
      )}
    </div>
  );
}