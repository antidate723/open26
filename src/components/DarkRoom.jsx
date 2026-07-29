import { useState } from 'react';
import CutieDialog from '../components/CutieDialog'; // Importă componenta de dialog
import '../components_css/DarkRoom.css'

export default function CameraPrincipala() {
  // Când camera se încarcă, pornește direct cu dialogul de intro
  const [dialogActiv, setDialogActiv] = useState('intro_camera');

  return (
    <div className="camera-container">
      {dialogActiv && (
        <CutieDialog
          dialogId={dialogActiv}
          onDialogTerminat={() => {
            console.log("Dialogul s-a terminat, dar păstrăm fundalul și modulele pe ecran!");
            // Nu mai facem setDialogActiv(null);
          }}
        />
      )}
    </div>
  );
}