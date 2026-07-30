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
  const [mode, setMode] = useState('dialog'); 
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const liniiDialog = dateDialoguri.dialoguri["masa_mate"].linii;
  const titluDialog = dateDialoguri.dialoguri["masa_mate"].titlu;
  
  const [indexLinie, setIndexLinie] = useState(0);
  const [textAfisat, setTextAfisat] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  // Efect pentru scrierea textului (Typewriter)
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
  }, [indexLinie, mode, liniiDialog]);

  // Funcția pentru trecerea la următoarea linie sau deschiderea puzzle-ului
  const treciMaiDeparte = () => {
    if (isTyping) return; 
    if (indexLinie < liniiDialog.length - 1) {
      setIndexLinie(prev => prev + 1);
    } else {
      setMode('puzzle'); 
    }
  };

  // Handler pentru click pe dialog
  const actiuneDialogClick = (e) => {
    e.stopPropagation();
    treciMaiDeparte();
  };

  // Efect pentru a asculta tasta Space
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (mode === 'dialog' && e.code === 'Space') {
        e.preventDefault(); // Previne scroll-ul accidental
        treciMaiDeparte();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, isTyping, indexLinie, liniiDialog]);

  const isCompleted = stage >= 3;
  const current = !isCompleted ? puzzles[stage] : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() === current.answer) {
      setValue("");
      setError("");
      onSolvedStage();
    } else {
      setError("Incorrect! Try again.");
    }
  };

  return (
    <div 
      className="math-modal-overlay" 
      onClick={mode === 'puzzle' ? onClose : undefined} 
    >
      {mode === 'dialog' ? (
        <div 
          className="dialog-box" 
          onClick={actiuneDialogClick}
          style={{ cursor: isTyping ? 'default' : 'pointer' }}
        >
          <div className="dialog-name">{titluDialog}</div>
          <p className="dialog-text">
            {textAfisat}
            {!isTyping && <span className="cursor-blink">|</span>}
          </p>
          <div className="dialog-hint" style={{ opacity: isTyping ? 0 : 1, transition: 'opacity 0.3s' }}>
            Click or Press Space to continue ▼
          </div>
        </div>
      ) : (
        <div className="math-paper-box" onClick={(e) => e.stopPropagation()}>
          <button className="math-close-btn" onClick={onClose}>×</button>
          
          <div className="math-paper-content">
            <h2 className="math-title-handwritten">Mathematical Notes</h2>
            
            {isCompleted ? (
              <div className="math-success-ink">
                <p>I've solved everything there is to solve here...</p>
                <button onClick={onClose} className="math-btn-ink">Put the paper back</button>
              </div>
            ) : (
              <>
                <p className="math-subtitle-ink">Guess the rule and the missing number (Problem {stage + 1}/3)</p>
                <div className="math-puzzle-text-ink">{current.text}</div>
                
                <form onSubmit={handleSubmit} className="math-form-ink">
                  <input 
                    type="text" 
                    value={value} 
                    onChange={(e) => { setValue(e.target.value); setError(""); }} 
                    placeholder="Answer..."
                    className="math-input-ink"
                    autoFocus
                    autoComplete="off"
                  />
                  <button type="submit" className="math-submit-btn-ink">Write</button>
                </form>
                {error && <p className="math-error-ink">{error}</p>}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}