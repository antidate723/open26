import { useState } from 'react';
import CutieDialog from '../components/CutieDialog'; // Importă componenta de dialog
import '../components_css/DarkRoom.css'

export default function CameraPrincipala() {
  // Când camera se încarcă, pornește direct cu dialogul de intro
  const [dialogActiv, setDialogActiv] = useState('intro_camera');

  return (
    <div className="camera-container">
      <h2 className="camera-title">Laboratorul Secret</h2>
      <p className="camera-hint">Apasă pe obiectele din cameră pentru a le investiga.</p>

      {/* Obiect 1: Masa de Chimie */}
      <div 
        className="obiect-interactiv chimie"
        onClick={() => setDialogActiv('obiect_chimie')}
      >
        Masa de Chimie
      </div>

      {/* Obiect 2: Calculatorul */}
      <div 
        className="obiect-interactiv calculator"
        onClick={() => setDialogActiv('obiect_calculator')}
      >
        Terminal Vechi
      </div>

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