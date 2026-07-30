import { useState, useEffect } from 'react';
import '../components_css/MasinaScrisModal.css';
import '../components_css/CutieDialog.css'; 
import dateDialoguri from '../texte/dialoguri.json'; 

export default function MasinaScrisModal({ onClose, onSolved, isAlreadySolved }) {
  const [mode, setMode] = useState(isAlreadySolved ? 'puzzle' : 'dialog');

  // ====== LOGICA DE DIALOG ======
  const liniiDialog = dateDialoguri.dialoguri["masina_scris"].linii;
  const titluDialog = dateDialoguri.dialoguri["masina_scris"].titlu;
  
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
    if (isTyping) return; 
    
    if (indexLinie < liniiDialog.length - 1) {
      setIndexLinie(prev => prev + 1);
    } else {
      setMode('puzzle'); 
    }
  };

  // ====== LOGICA PUZZLE (Mașină de scris) ======
  const [culoare, setCuloare] = useState('black');
  const [aliniere, setAliniere] = useState('left');
  const [marime, setMarime] = useState('16px');
  const [feedback, setFeedback] = useState('');

  const verificaFormatare = () => {
    if (culoare === 'red' && aliniere === 'center' && marime === '24px') {
      setFeedback('✅ FORMAT ACCEPTED. PRINTING CLASSIFIED LOG...');
      
      setTimeout(() => {
        onSolved();
      }, 1500); 
      
    } else {
      setFeedback('❌ ERROR: MACHINE REJECTS FORMATTING. TRY AGAIN.');
    }
  };

  return (
    <div className="terminal-overlay" onClick={mode === 'puzzle' ? onClose : undefined}>
      
      {mode === 'dialog' ? (
        <div className="dialog-box" onClick={actiuneDialog} style={{ cursor: isTyping ? 'default' : 'pointer' }}>
          <div className="dialog-name">{titluDialog}</div>
          <p className="dialog-text">
            {textAfisat}
            {!isTyping && <span className="cursor-blink">|</span>}
          </p>
          <div className="dialog-hint" style={{ opacity: isTyping ? 0 : 1, transition: 'opacity 0.3s' }}>
            Click to continue ▼
          </div>
        </div>
      ) : (
        /* ========================================= */
        /* CONTAINERUL TYPEWRITER                    */
        /* ========================================= */
        <div className="typewriter-container" onClick={(e) => e.stopPropagation()}>
          <button className="typewriter-close-btn" onClick={onClose}>×</button>
          
          {isAlreadySolved ? (
            <div className="typewriter-success-screen">
              <h2 className="success-title">SYSTEM UNLOCKED</h2>
              <p>The classified report has already been printed successfully.</p>
              <button className="btn-type-action" onClick={onClose}>CLOSE</button>
            </div>
          ) : (
            <>
              <div className="typewriter-header">
                <h2>&gt; OPERATION: TYPEWRITER_OVERRIDE</h2>
                <p>TASK: Calibrate the machine to print the emergency log. (Requirements: <strong>24px, Red Ink, Centered</strong>)</p>
              </div>

              {/* TOOLBAR MAȘINĂ DE SCRIS (Rotițe / Comutatoare) */}
              <div className="typewriter-toolbar">
                <div className="tool-group">
                  <label>INK RIBBON</label>
                  <select value={culoare} onChange={(e) => setCuloare(e.target.value)} className="type-select">
                    <option value="black">Standard Black</option>
                    <option value="red">Emergency Red</option>
                    <option value="blue">Cyanotype Blue</option>
                  </select>
                </div>

                <div className="tool-group">
                  <label>TYPEFACE SIZE</label>
                  <select value={marime} onChange={(e) => setMarime(e.target.value)} className="type-select">
                    <option value="12px">Micro (12px)</option>
                    <option value="16px">Standard (16px)</option>
                    <option value="24px">Headline (24px)</option>
                  </select>
                </div>

                <div className="tool-group">
                  <label>CARRIAGE ALIGNMENT</label>
                  <div className="type-align-group">
                    <button className={aliniere === 'left' ? 'active' : ''} onClick={() => setAliniere('left')}>
                      LEFT
                    </button>
                    <button className={aliniere === 'center' ? 'active' : ''} onClick={() => setAliniere('center')}>
                      CENTER
                    </button>
                    <button className={aliniere === 'right' ? 'active' : ''} onClick={() => setAliniere('right')}>
                      RIGHT
                    </button>
                  </div>
                </div>
              </div>

              {/* ROLA DE HÂRTIE */}
              <div className="paper-roller-bg">
                <div className="paper-sheet">
                  <p className="paper-text" style={{ color: culoare, textAlign: aliniere, fontSize: marime }}>
                    CONFIDENTIAL REPORT. Subject 84 has breached Sector 7 containment. Proceed with extreme caution. The security override code is embedded within this very document.
                  </p>
                </div>
              </div>

              {/* ZONA DE JOS (Maneta de Print) */}
              <div className="typewriter-footer">
                <button className="btn-type-action" onClick={verificaFormatare}>
                  [ PULL CARRIAGE LEVER ]
                </button>
                <span className="feedback-msg" style={{ color: feedback.includes('✅') ? '#4dff4d' : '#ff4d4d' }}>
                  {feedback}
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}