import { useState, useEffect, useRef } from 'react';
import dateDialoguri from '../texte/dialoguri.json';
import '../components_css/MathPuzzleModal.css';
import '../components_css/MusicPuzzleModal.css';

export default function MusicPuzzleModal({ onClose, onSolved, onPenalty }) {
  const [mode, setMode] = useState('dialog');

  const audioMinigameRef = useRef(null);
  const [isPlayingMini, setIsPlayingMini] = useState(false);

  const secventaCorecta = [0, 1, 2, 2, 2, 1, 0];
  const [secventaUser, setSecventaUser] = useState([]);
  const [stareMinigame, setStareMinigame] = useState('asteptare');

  const maxInimi = 3;
  const [inimi, setInimi] = useState(maxInimi);
  const [clapaAnimata, setClapaAnimata] = useState(null);

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

  const apasaClapa = (clapa) => {
    if (stareMinigame === 'corect') return;

    setClapaAnimata(clapa.id);
    setTimeout(() => setClapaAnimata(null), 180);

    const sunetClapa = new Audio(clapa.sunet);
    sunetClapa.play().catch(() => {});

    const nouaSecventa = [...secventaUser, clapa.id];
    setSecventaUser(nouaSecventa);

    const indexCurent = nouaSecventa.length - 1;
    if (nouaSecventa[indexCurent] !== secventaCorecta[indexCurent]) {
      const inimiRamase = inimi - 1;

      if (inimiRamase <= 0) {
        if (typeof onPenalty === 'function') onPenalty(180);
        setInimi(maxInimi);
      } else {
        setInimi(inimiRamase);
      }

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
        <div className="terminal-modal-box" onClick={(e) => e.stopPropagation()}>
          <button className="terminal-close-btn" onClick={onClose}>×</button>
          <h2 className="terminal-title">&gt; Calibrare_Frecventa_Audio</h2>

          <div className="terminal-hearts">
            {Array.from({ length: maxInimi }).map((_, i) => (
              <span key={i} className={`terminal-heart ${i < inimi ? 'filled' : ''}`}>♥</span>
            ))}
          </div>

          <div className="terminal-panel">
            <p className="terminal-panel-label">Ascultă fragmentul acustic de referință:</p>
            <button
              className={`terminal-btn ${isPlayingMini ? 'playing' : ''}`}
              onClick={toggleAudioMini}
            >
              {isPlayingMini ? '[ Opreste ]' : '[ Asculta Melodia (4s) ]'}
            </button>
          </div>

          <div className="terminal-clape-row">
            {clape.map((clapa) => (
              <div
                key={clapa.id}
                className={`terminal-clapa ${clapaAnimata === clapa.id ? 'apasata' : ''}`}
                onClick={() => apasaClapa(clapa)}
              >
                <img src="/smeker.png" alt={clapa.nume} />
                <span>{clapa.nume}</span>
              </div>
            ))}
          </div>

          <div className="terminal-status">
            {stareMinigame === 'gresit' && <span className="wrong">Secventa gresita. Se reseteaza.</span>}
            {stareMinigame === 'corect' && <span className="correct">Frecventa sincronizata cu succes.</span>}
            {stareMinigame === 'asteptare' && (
              <span className="waiting">Progres: {secventaUser.length} / {secventaCorecta.length} pasi</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}