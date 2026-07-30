import { useState, useEffect } from 'react';
import dateDialoguri from '../texte/dialoguri.json';
import '../components_css/MathPuzzleModal.css'; // Putem folosi același CSS curat de modal

export default function MusicPuzzleModal({ onClose, onSolved }) {
  const [mode, setMode] = useState('dialog');

  
  const dialogData = dateDialoguri.dialoguri["modul_muzica"] || {
    titlu: "Sistem Acustic",
    linii: [
      "O frecvență ciudată începe să pulseze în pereți...",
      "Aflu un ritm ascuns în ecourile încăperii.",
      "Trebuie să potrivesc semnalele audio în ordinea corectă!"
    ]
  };

  const [indexLinie, setIndexLinie] = useState(0);
  const [textAfisat, setTextAfisat] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (mode !== 'dialog') return;
    
    const textComplet = dialogData.linii[indexLinie];
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
  }, [indexLinie, mode, dialogData]);

  const actiuneDialog = (e) => {
    e.stopPropagation();
    if (isTyping) return; 
    
    if (indexLinie < dialogData.linii.length - 1) {
      setIndexLinie(prev => prev + 1);
    } else {
      setMode('puzzle'); 
    }
  };

  return (
    <div className="math-modal-overlay" onClick={mode === 'puzzle' ? onClose : undefined}>
      {mode === 'dialog' ? (
        <div 
          className="dialog-box" 
          onClick={actiuneDialog}
          style={{ cursor: isTyping ? 'default' : 'pointer' }}
        >
          <div className="dialog-name">{dialogData.titlu}</div>
          <p className="dialog-text">
            {textAfisat}
            {!isTyping && <span className="cursor-blink">|</span>}
          </p>
          <div className="dialog-hint" style={{ opacity: isTyping ? 0 : 1, transition: 'opacity 0.3s' }}>
            Click sau Apasă Space pentru a continua ▼
          </div>
        </div>
      ) : (
        <div className="math-modal-box" onClick={(e) => e.stopPropagation()}>
          <button className="math-close-btn" onClick={onClose}>×</button>
          <h2 className="math-title">Calilibrare Frecvență Audio</h2>
          <p className="math-subtitle">Ascultă beat-urile și așază butoanele în ordinea corectă a frecvențelor.</p>
          
          <div style={{ padding: '20px', textAlign: 'center', color: '#fff' }}>
            <p>🎵 [Zona de minigame cu butoane audio va urma aici]</p>
            <button 
              onClick={onSolved} 
              style={{ marginTop: '20px', padding: '8px 16px', background: '#b026ff', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}
            >
              Simulează Rezolvarea Ritmului
            </button>
          </div>
        </div>
      )}
    </div>
  );
}