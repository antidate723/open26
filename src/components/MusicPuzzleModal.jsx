import { useState, useEffect, useRef } from 'react';
import dateDialoguri from '../texte/dialoguri.json';
import '../components_css/MathPuzzleModal.css';

export default function MusicPuzzleModal({ onClose, onSolved }) {
  const [mode, setMode] = useState('dialog');

  // Referință doar pentru melodia minigame-ului (4 secunde)
  const audioMinigameRef = useRef(null);
  const [isPlayingMini, setIsPlayingMini] = useState(false);

  // Secvența corectă de 7 pași: 1, 2, 3, 3, 3, 2, 1 (ID-uri: 0, 1, 2)
  const secventaCorecta = [0, 1, 2, 2, 2, 1, 0];
  const [secventaUser, setSecventaUser] = useState([]);
  const [stareMinigame, setStareMinigame] = useState('asteptare');

  // Cele 3 clape bazate pe imaginea /smker.png și sunetele dedicate
  const clape = [
    { id: 0, nume: 'Clapa 1', sunet: '/clapa1.mp3' },
    { id: 1, nume: 'Clapa 2', sunet: '/clapa2.mp3' },
    { id: 2, nume: 'Clapa 3', sunet: '/clapa3.mp3' },
  ];

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

  // Inițializare audio minigame
  useEffect(() => {
    audioMinigameRef.current = new Audio('/astaebuna.mp3');
    audioMinigameRef.current.loop = false;

    audioMinigameRef.current.onended = () => {
      setIsPlayingMini(false);
    };

    return () => {
      if (audioMinigameRef.current) {
        audioMinigameRef.current.pause();
        audioMinigameRef.current = null;
      }
    };
  }, []);

  const toggleAudioMini = () => {
    if (!audioMinigameRef.current) return;
    if (isPlayingMini) {
      audioMinigameRef.current.pause();
      audioMinigameRef.current.currentTime = 0;
      setIsPlayingMini(false);
    } else {
      audioMinigameRef.current.currentTime = 0;
      audioMinigameRef.current.play().then(() => setIsPlayingMini(true)).catch(() => {});
    }
  };

  // Efect Typewriter pentru dialog
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

  // Apăsarea clapelor cu imaginea smker.png
  const apasaClapa = (clapa) => {
    if (stareMinigame === 'corect') return;

    const sunetClapa = new Audio(clapa.sunet);
    sunetClapa.play().catch(() => {});

    const nouaSecventa = [...secventaUser, clapa.id];
    setSecventaUser(nouaSecventa);

    const indexCurent = nouaSecventa.length - 1;
    if (nouaSecventa[indexCurent] !== secventaCorecta[indexCurent]) {
      setStareMinigame('gresit');
      setTimeout(() => {
        setSecventaUser([]);
        setStareMinigame('asteptare');
      }, 800);
      return;
    }

    if (nouaSecventa.length === secventaCorecta.length) {
      setStareMinigame('corect');
      if (audioMinigameRef.current) audioMinigameRef.current.pause();
      setTimeout(() => {
        onSolved();
      }, 1200);
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
          <h2 className="math-title">Calibrare Frecvență Audio</h2>
          
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', margin: '15px 0' }}>
            <p style={{ fontSize: '13px', color: '#ccc', marginBottom: '10px' }}>
              Ascultă fragmentul acustic de referință:
            </p>
            <button 
              onClick={toggleAudioMini}
              style={{ padding: '8px 16px', background: isPlayingMini ? '#e74c3c' : '#2ecc71', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
            >
              {isPlayingMini ? '⏸️ Oprește / Reia' : '▶️ Ascultă Melodia (4s)'}
            </button>
          </div>

          <p className="math-subtitle" style={{ fontSize: '13px', color: '#f1c40f', fontWeight: 'bold' }}>
            Reprodu secvența (7 pași): 1 - 2 - 3 - 3 - 3 - 2 - 1
          </p>
          
          {/* Cele 3 clape bazate pe imaginea smker.png */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', margin: '20px 0' }}>
            {clape.map((clapa) => (
              <div
                key={clapa.id}
                onClick={() => apasaClapa(clapa)}
                style={{
                  flex: 1,
                  cursor: 'pointer',
                  transition: 'transform 0.1s',
                  userSelect: 'none',
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.92)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <img 
                  src="/smeker.png" 
                  alt={clapa.nume} 
                  style={{ width: '100%', height: 'auto', borderRadius: '8px', display: 'block', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }} 
                />
                <span style={{ fontSize: '12px', color: '#fff', marginTop: '5px', display: 'block' }}>{clapa.nume}</span>
              </div>
            ))}
          </div>

          <div style={{ minHeight: '30px', marginTop: '10px' }}>
            {stareMinigame === 'gresit' && <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>Secvență greșită! Se resetează... ❌</span>}
            {stareMinigame === 'corect' && <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>Frecvență sincronizată cu succes! ✅</span>}
            {stareMinigame === 'asteptare' && (
              <span style={{ color: '#aaa', fontSize: '13px' }}>
                Progres: {secventaUser.length} / {secventaCorecta.length} pași
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}