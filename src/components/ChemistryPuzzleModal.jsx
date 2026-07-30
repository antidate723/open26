import { useState, useEffect } from 'react';
import dateDialoguri from '../texte/dialoguri.json';
import '../components_css/MathPuzzleModal.css';

export default function ChemistryPuzzleModal({ onClose, onSolved }) {
  const [mode, setMode] = useState('dialog');

   const [secventaUser, setSecventaUser] = useState([]);
  const secventaCorecta = [0, 2, 1];  
  const [stareMinigame, setStareMinigame] = useState('asteptare');  
   const substante = [
    { id: 0, nume: 'Acid Sulfuric (H₂SO₄)', culoare: '#e74c3c' },
    { id: 1, nume: 'Nitroglicerină', culoare: '#f1c40f' },
    { id: 2, nume: 'Stabilizator Chimic', culoare: '#3498db' },
  ];

  const dialogData = dateDialoguri.dialoguri["modul_chimie"] || {
    titlu: "Laborator de Chimie",
    linii: [
      "Am terminat primele 3 task-uri, dar ușa este blocată...",
      "Trebuie să montez o bombă improvizată ca să o arunc în aer!"
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

   const adaugaSubstanta = (idSubstanta) => {
    if (stareMinigame === 'detonat') return;

    const nouaSecventa = [...secventaUser, idSubstanta];
    setSecventaUser(nouaSecventa);

    const indexCurent = nouaSecventa.length - 1;
    if (nouaSecventa[indexCurent] !== secventaCorecta[indexCurent]) {
      setStareMinigame('gresit');
      setTimeout(() => {
        setSecventaUser([]);
        setStareMinigame('asteptare');
      }, 900);
      return;
    }

    if (nouaSecventa.length === secventaCorecta.length) {
      setStareMinigame('detonat');
      setTimeout(() => {
        onSolved();
      }, 1500);
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
          <div className="dialog-name">
            <span>{dialogData.titlu}</span>
          </div>
          <p className="dialog-text">
            {textAfisat}
            {!isTyping && <span className="cursor-blink">|</span>}
          </p>
          <div className="dialog-hint" style={{ opacity: isTyping ? 0 : 1, transition: 'opacity 0.3s' }}>
            Click sau Apasă Space pentru a continua ▼
          </div>
        </div>
      ) : (
        <div className="math-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', textAlign: 'center' }}>
          <button className="math-close-btn" onClick={onClose}>×</button>
          <h2 className="math-title">Amestec Exploziv pentru Ușă</h2>
          
          <p className="math-subtitle" style={{ fontSize: '13px', color: '#f1c40f', fontWeight: 'bold', margin: '15px 0' }}>
            Combină substanțele în ordinea corectă pentru a detona ușa!
          </p>
          
           <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px 0' }}>
            {substante.map((sub) => (
              <button
                key={sub.id}
                onClick={() => adaugaSubstanta(sub.id)}
                style={{
                  padding: '15px',
                  background: sub.culoare,
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                  transition: 'transform 0.1s',
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                {sub.nume}
              </button>
            ))}
          </div>

          <div style={{ minHeight: '30px', marginTop: '10px' }}>
            {stareMinigame === 'gresit' && <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>Reacție instabilă! Eșec, se resetează... 💥</span>}
            {stareMinigame === 'detonat' && <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>BOOM! Ușa a fost spulberată cu succes! 🚪🔥</span>}
            {stareMinigame === 'asteptare' && (
              <span style={{ color: '#aaa', fontSize: '13px' }}>
                Substanțe adăugate: {secventaUser.length} / {secventaCorecta.length}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}