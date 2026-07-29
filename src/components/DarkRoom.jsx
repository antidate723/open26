import { useState } from 'react';
import CutieDialog from '../components/CutieDialog'; 
import '../components_css/DarkRoom.css'

export default function CameraPrincipala() {
  const [dialogActiv, setDialogActiv] = useState('intro_camera');

  return (
    <div className="camera-container">
      {dialogActiv && (
        <CutieDialog
          dialogId={dialogActiv}
          onDialogTerminat={() => {
            console.log("Dialogul s-a terminat, dar păstrăm fundalul și modulele pe ecran!");
          }}
        />
      )}
    </div>
  );
}