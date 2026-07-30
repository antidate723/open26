import { useState, useEffect } from 'react';
import '../components_css/MathPuzzleModal.css';
import dateDialoguri from '../texte/dialoguri.json';
import '../components_css/CutieDialog.css';

const puzzles = [
  { text: "2, 4, 8, 16, ?", answer: "32" },
  { text: "1, 1, 2, 3, 5, 8, ?", answer: "13" },
  { text: "3, 6, 12, 24, ?", answer: "48" }
];

export default function MathPuzzleModal({ stage, onClose, onSolvedStage, isAlreadySolved }) {
  // Dacă a mai fost deschis (stage > 0) sau e rezolvat, dăm skip la poveste
 const [mode, setMode] = useState('dialog'); // Așa forțăm dialogul să apară mereu!
  
  // Stări pentru problema de matematică
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  // ====== LOGICA DE DIALOG ======
  const liniiDialog = dateDialoguri.dialoguri["masa_mate"].linii;
  const titluDialog = dateDialoguri.dialoguri["masa_mate"].titlu;
  
  const [indexLinie, setIndexLinie] = useState(0);
  const [textAfisat, setTextAfisat] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (mode !== 'dialog') return;
    
    const textComplet = liniiDialog[indexLinie];
    let indexCurent = 0;
    setTextAfisat('');
    setIsTyping(true);

    const interval = setInterval(() => {
      if (indexCurent < textComplet.length) {
        setTextAfisat(textComplet.substring(0, indexCurent + 1));
        indexCurent++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [indexLinie, mode]);

  const actiuneDialog = (e) => {
    e.stopPropagation();
    if (isTyping) return; // Așteptăm să termine de scris
    
    if (indexLinie < liniiDialog.length - 1) {
      setIndexLinie(prev => prev + 1);
    } else {
      setMode('puzzle'); // A terminat textul, deschidem foaia de mate!
    }
  };

  // ====== LOGICA PENTRU MATEMATICĂ ======
  const isCompleted = stage >= 3;
  const current = !isCompleted ? puzzles[stage] : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() === current.answer) {
      setValue("");
      setError("");
      onSolvedStage();
    } else {
      setError("Incorect! Mai încearcă.");
    }
  };

  return (
    <div 
      className="math-modal-overlay" 
      onClick={mode === 'puzzle' ? onClose : undefined} // Se poate închide dând click în afară doar la puzzle
    >
      {mode === 'dialog' ? (
        
        /* ECRANUL DE DIALOG (Folosim aceleași clase din CutieDialog.css!) */
        <div 
          className="dialog-box" 
          onClick={actiuneDialog}
          style={{ cursor: isTyping ? 'default' : 'pointer' }}
        >
          <div className="dialog-name">{titluDialog}</div>
          <p className="dialog-text">
            {textAfisat}
            {!isTyping && <span className="cursor-blink">|</span>}
          </p>
          <div className="dialog-hint" style={{ opacity: isTyping ? 0 : 1, transition: 'opacity 0.3s' }}>
            Click to continue
          </div>
        </div>

      ) : (

        /* ECRANUL CU FOAIA DE MATE */
        <div className="math-modal-box" onClick={(e) => e.stopPropagation()}>
          <button className="math-close-btn" onClick={onClose}>×</button>
          <h2 className="math-title">Foaie cu Problemă</h2>
          
          {isCompleted ? (
            <div className="math-success">
              <p>Ai rezolvat toate cele 3 probleme de pe foaie!</p>
              <button onClick={onClose} className="math-btn-ok">Închide</button>
            </div>
          ) : (
            <>
              <p className="math-subtitle">Ghicește regula și numărul lipsă (Nivel {stage + 1}/3)</p>
              <div className="math-puzzle-text">{current.text}</div>
              
              <form onSubmit={handleSubmit} className="math-form">
                <input 
                  type="text" 
                  value={value} 
                  onChange={(e) => { setValue(e.target.value); setError(""); }} 
                  placeholder="Răspunsul tău"
                  className="math-input"
                  autoFocus
                  autoComplete="off"
                />
                <button type="submit" className="math-submit-btn">Verifică</button>
              </form>
              {error && <p className="math-error">{error}</p>}
            </>
          )}
        </div>

      )}
    </div>
  );
}