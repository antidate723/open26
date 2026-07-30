import { useState, useEffect } from 'react';
import dateDialoguri from '../texte/dialoguri.json';
import '../components_css/MathPuzzleModal.css';
import '../components_css/ChemistryPuzzleModal.css';

export default function ChemistryPuzzleModal({ onClose, onSolved }) {
  const [mode, setMode] = useState('dialog');

  const secventaCorecta = [0, 2, 1, 3];
  const [secventaUser, setSecventaUser] = useState([]);
  const [stareMinigame, setStareMinigame] = useState('asteptare');

  const [vieti, setVieti] = useState(3);

  const [culoareAmestec, setCuloareAmestec] = useState('transparent');
  const [mesajEroare, setMesajEroare] = useState("Choose the first substance to start the reaction.");

  const eprubeteDisponibile = [
    { id: 0, nume: 'Sulfuric Acid', formula: 'H₂SO₄', coef: '1', desc: 'Strong desiccant.', culoare: '#ff4757', hex: '#ff4757' },
    { id: 1, nume: 'Nitroglycerin', formula: 'C₃H₅(NO₃)₃', coef: '3', desc: 'Unstable and reactive compound.', culoare: '#ffa502', hex: '#ffa502' },
    { id: 2, nume: 'Stabilizer', formula: 'C₆H₁₂O₆', coef: '2', desc: 'Control buffer molecule.', culoare: '#2ed573', hex: '#2ed573' },
    { id: 3, nume: 'Catalyst', formula: 'Pt/Rh', coef: '4', desc: 'Triggers the final spark.', culoare: '#9b59b6', hex: '#9b59b6' },
    { id: 4, nume: 'Distilled Water', formula: 'H₂O', coef: '0', desc: 'Hazard! Completely extinguishes the mixture.', culoare: '#3b82f6', hex: '#3b82f6' },
  ];

  const dialogData = dateDialoguri.dialoguri["obiect_chimie"];

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


  const treciMaiDeparte = () => {
    if (isTyping) return;
    if (indexLinie < dialogData.linii.length - 1) {
      setIndexLinie(prev => prev + 1);
    } else {
      setMode('puzzle');
    }
  };

  // Handler pentru click
  const actiuneDialogClick = (e) => {
    e.stopPropagation();
    treciMaiDeparte();
  };

  // Efect pentru a asculta tasta Space
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (mode === 'dialog' && e.code === 'Space') {
        e.preventDefault(); // Previne scroll-ul paginii
        treciMaiDeparte();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, isTyping, indexLinie, dialogData]);

  const adaugaEprubeta = (eprubeta) => {
    if (stareMinigame === 'detonat' || stareMinigame === 'gresit' || vieti <= 0) return;

    const pasCurentIndex = secventaUser.length;
    const esteGresit = eprubeta.id === 4 || eprubeta.id !== secventaCorecta[pasCurentIndex];

    if (esteGresit) {
      const vietiNoi = vieti - 1;
      setVieti(vietiNoi);
      setStareMinigame('gresit');
      setCuloareAmestec('#ef4444');

      if (eprubeta.id === 4) {
        setMesajEroare(" The beaker broke! You added Distilled Water and stopped the chemical reaction!");
      } else if (pasCurentIndex === 0) {
        setMesajEroare(" The beaker cracked! Sulfuric Acid should be added first to prime the base.");
      } else if (pasCurentIndex === 1) {
        setMesajEroare(" Failure! After the acid, you needed the Stabilizer, not this substance.");
      } else {
        setMesajEroare(" The beaker collapsed! The order of reactants is incorrect for detonation.");
      }

      setTimeout(() => {
        setSecventaUser([]);
        setStareMinigame('asteptare');
        setCuloareAmestec('transparent');
        setMesajEroare(vietiNoi <= 0 ? "You ran out of lives! Resetting the laboratory..." : "Choose the first substance to start the reaction.");
        if (vietiNoi <= 0) setVieti(3);
      }, 1800);
      return;
    }

    const nouaSecventa = [...secventaUser, eprubeta.id];
    setSecventaUser(nouaSecventa);
    setCuloareAmestec(eprubeta.hex);

    if (nouaSecventa.length === 1) {
      setMesajEroare("Good! The acid has primed the base. Continue with the stabilizer.");
    } else if (nouaSecventa.length === 2) {
      setMesajEroare("Stabilizer integrated correctly. Add the unstable compound.");
    } else if (nouaSecventa.length === 3) {
      setMesajEroare("Almost done! You only need the catalyst spark.");
    }

    if (nouaSecventa.length === secventaCorecta.length) {
      setStareMinigame('detonat');
      setMesajEroare(" Chain reaction successful! The door has been blown open!");
      setTimeout(() => {
        onSolved();
      }, 2000);
    }
  };

  const EprubetaSVG = ({ plina, culoare }) => (
    <svg width="45" height="85" viewBox="0 0 60 110" style={{ overflow: 'visible' }}>
      <rect x="22" y="2" width="16" height="15" rx="2" fill="none" stroke="#cbd5e1" strokeWidth="3" />
      <path d="M 15 15 L 15 90 C 15 102, 45 102, 45 90 L 45 15 Z" fill="rgba(255, 255, 255, 0.04)" stroke="#cbd5e1" strokeWidth="3" strokeLinejoin="round" />
      {plina && (
        <path d="M 16.5 40 L 16.5 90 C 16.5 100, 43.5 100, 43.5 90 L 43.5 40 Z" fill={culoare} style={{ transition: 'all 0.3s ease' }} />
      )}
    </svg>
  );

  const genereazaEcuatieLive = () => {
    if (secventaUser.length === 0) return "Reaction: [ Waiting for reactants... ]";
    const elemente = secventaUser.map(id => {
      const sub = eprubeteDisponibile[id];
      return `${sub.coef}${sub.formula}`;
    });
    return `Active Equation: ${elemente.join(' + ')} ➔ [ Status: In progress... ]`;
  };

  return (
    <div className="math-modal-overlay" onClick={mode === 'puzzle' ? onClose : undefined}>
      {mode === 'dialog' ? (
        <div
          className="dialog-box"
          onClick={actiuneDialogClick}
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
            Click or Press Space to continue ▼
          </div>
        </div>
      ) : (
        <div className="chem-box" onClick={(e) => e.stopPropagation()}>
          <button className="chem-close-btn" onClick={onClose}>×</button>

          <div className="chem-header">
            <h2 className="chem-title">&gt; Chemical_Lab_Detonation_Station</h2>
            <div className="chem-hearts">
              {[1, 2, 3].map((inima) => (
                <span key={inima} className={`chem-heart ${inima <= vieti ? 'filled' : ''}`}>♥</span>
              ))}
            </div>
          </div>

          <div className={`chem-message ${stareMinigame === 'gresit' ? 'wrong' : ''}`}>
            <span>{mesajEroare}</span>
          </div>

          <div className="chem-beaker-wrap">
            <div className={`chem-beaker ${stareMinigame === 'gresit' ? 'spart' : ''}`}>
              <div
                className="chem-beaker-fill"
                style={{
                  height: `${(secventaUser.length / secventaCorecta.length) * 100}%`,
                  background: culoareAmestec,
                }}
              >
                {secventaUser.length > 0 && (
                  <span>{secventaUser.length}/4</span>
                )}
              </div>
            </div>
            <span className="chem-beaker-label">Beaker</span>
          </div>

          <div className="chem-equation">
            {genereazaEcuatieLive()}
          </div>

          <p className="chem-hint">
            Choose the test tubes in the correct order to break the door:
          </p>

          <div className="chem-grid">
            {eprubeteDisponibile.map((ep) => (
              <div
                key={ep.id}
                className="chem-tube"
                style={{ '--tube-color': ep.culoare }}
                onClick={() => adaugaEprubeta(ep)}
              >
                <EprubetaSVG plina={true} culoare={ep.culoare} />
                <span className="chem-tube-name">{ep.nume}</span>
                <span className="chem-tube-formula" style={{ color: ep.culoare }}>{ep.coef}{ep.formula}</span>
                <span className="chem-tube-desc">{ep.desc}</span>
              </div>
            ))}
          </div>

          <div className="chem-status">
            {stareMinigame === 'detonat' && (
              <span className="chem-status-success"> TOTAL SUCCESS! The door has been successfully unlocked!</span>
            )}
            {stareMinigame === 'asteptare' && (
              <div className="chem-progress">
                <span className="chem-progress-label">Progress:</span>
                {secventaCorecta.map((_, idx) => (
                  <div key={idx} className={`chem-progress-dot ${idx < secventaUser.length ? 'done' : ''}`}>
                    {idx < secventaUser.length ? '✓' : idx + 1}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}