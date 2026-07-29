import { useState, useEffect } from 'react';
import dateDialoguri from '../texte/dialoguri.json';
import '../components_css/CutieDialog.css'; 

export default function CutieDialog({ dialogId, onDialogTerminat }) {
  const [indexLinie, setIndexLinie] = useState(0);
  const [textAfisat, setTextAfisat] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const dialogCurent = dateDialoguri.dialoguri[dialogId];

  // 1. Efectul pentru scrierea textului (Typewriter)
  useEffect(() => {
    if (!dialogCurent) return;

    const textComplet = dialogCurent.linii[indexLinie];
    let indexCurent = 0;

    setTextAfisat(''); 
    setIsTyping(true); // Începem procesul de tastare

    const interval = setInterval(() => {
      if (indexCurent < textComplet.length) {
        const bucataDeText = textComplet.substring(0, indexCurent + 1);
        setTextAfisat(bucataDeText);
        indexCurent++;
      } else {
        setIsTyping(false); // Am terminat de tastat
        clearInterval(interval);
      }
    }, 30); 

    return () => clearInterval(interval);
  }, [indexLinie, dialogCurent]);

  // Funcția pentru avansarea în dialog
  const actiuneTreciMaiDeparte = () => {
    // Dacă încă se tastează, blocăm avansarea
    if (isTyping) {
      return; 
    }

    // Dacă a terminat de tastat, trecem la linia următoare sau închidem dialogul
    if (indexLinie < dialogCurent.linii.length - 1) {
      setIndexLinie(prev => prev + 1);
    } else {
      onDialogTerminat();
    }
  };

  // 2. Event Listener global pentru Tasta Space
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault(); 
        actiuneTreciMaiDeparte();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTyping, indexLinie, dialogCurent, onDialogTerminat]); 

  if (!dialogCurent) return null;

  // Verificăm dacă suntem la penultimul mesaj sau mai departe pentru efectele vizuale
  const estePenultimulSauMaiDeparte = indexLinie >= dialogCurent.linii.length - 2;

  return (
    <div className="dialog-overlay">
      {/* Elementele de fundal activate la penultimul mesaj */}
      {estePenultimulSauMaiDeparte && (
        <div className="fundal-efecte">
          {/* Becul sus în dreapta */}
          <div className="bec-container">
            <div className="fir-bec" />
            <div className="bec-lumina" />
          </div>

          {/* Panou Stânga - Înalt */}
          <div className="panou-lateral panou-stanga" />

          {/* Panou Dreapta - Scurt */}
          <div className="panou-lateral panou-dreapta" />
        </div>
      )}

      <div 
        className="dialog-box" 
        onClick={actiuneTreciMaiDeparte}
        style={{ cursor: isTyping ? 'default' : 'pointer' }}
      >
        <div className="dialog-name">
          {dialogCurent.titlu}
        </div>
        
        <p className="dialog-text">
          {textAfisat}
          <span className="cursor-blink">|</span>
        </p>
        
        <div 
          className="dialog-hint" 
          style={{ opacity: isTyping ? 0 : 1, transition: 'opacity 0.3s' }}
        >
          Press Space to continue ▼
        </div>
      </div>
    </div>
  );
}