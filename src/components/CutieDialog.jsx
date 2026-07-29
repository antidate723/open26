import { useState, useEffect } from 'react';
import dateDialoguri from '../texte/dialoguri.json';
import '../components_css/CutieDialog.css'; 

export default function CutieDialog({ dialogId, onDialogTerminat }) {
  const [indexLinie, setIndexLinie] = useState(0);
  const [textAfisat, setTextAfisat] = useState('');
  
  const dialogCurent = dateDialoguri.dialoguri[dialogId];


  useEffect(() => {
    if (!dialogCurent) return;

    const textComplet = dialogCurent.linii[indexLinie];
    let indexCurent = 0;
    setTextAfisat(''); 
    const interval = setInterval(() => {
      if (indexCurent < textComplet.length) {

        setTextAfisat(prev => prev + textComplet.charAt(indexCurent));
        indexCurent++;
      } else {
        clearInterval(interval);
      }
    }, 30); 

   
    return () => clearInterval(interval);
  }, [indexLinie, dialogCurent]);

  if (!dialogCurent) return null;

  const mergiMaiDeparte = () => {
    const textComplet = dialogCurent.linii[indexLinie];
    
    
    if (textAfisat.length < textComplet.length) {
      setTextAfisat(textComplet);
      return;
    }

   
    if (indexLinie < dialogCurent.linii.length - 1) {
      setIndexLinie(indexLinie + 1);
    } else {
      onDialogTerminat();
    }
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-box" onClick={mergiMaiDeparte}>
    
        <div className="dialog-name">
          {dialogCurent.titlu}
        </div>
        
        <p className="dialog-text">
          {textAfisat}
          <span className="cursor-blink">|</span>
        </p>
        
        <div className="dialog-hint">
          Click pentru a continua ▼
        </div>
      </div>
    </div>
  );
}