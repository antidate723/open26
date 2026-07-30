import { useState, useEffect } from 'react';
import dateDialoguri from '../texte/dialoguri.json';
import '../components_css/MathPuzzleModal.css';

export default function ChemistryPuzzleModal({ onClose, onSolved }) {
  const [mode, setMode] = useState('dialog');

  // Secvența corectă (4 pași: Acid -> Stabilizator -> Nitroglicerină -> Catalizator)
  const secventaCorecta = [0, 2, 1, 3]; 
  const [secventaUser, setSecventaUser] = useState([]);
  const [stareMinigame, setStareMinigame] = useState('asteptare'); // 'asteptare', 'gresit', 'detonat'
  
  // Sistem de vieți (3 încercări)
  const [vieti, setVieti] = useState(3);

  // Stare pentru Paharul Berzelius
  const [culoareAmestec, setCuloareAmestec] = useState('transparent');
  const [mesajEroare, setMesajEroare] = useState("Alege prima substanță pentru a începe reacția.");

  // Lista substanțelor
  const eprubeteDisponibile = [
    { id: 0, nume: 'Acid Sulfuric', formula: 'H₂SO₄', coef: '1', desc: 'Deshidratant puternic.', culoare: '#ff4757', hex: '#ff4757' },
    { id: 1, nume: 'Nitroglicerină', formula: 'C₃H₅(NO₃)₃', coef: '3', desc: 'Compus instabil și reactiv.', culoare: '#ffa502', hex: '#ffa502' },
    { id: 2, nume: 'Stabilizator', formula: 'C₆H₁₂O₆', coef: '2', desc: 'Moleculă tampon de control.', culoare: '#2ed573', hex: '#2ed573' },
    { id: 3, nume: 'Catalizator', formula: 'Pt/Rh', coef: '4', desc: 'Declanșează scânteia finală.', culoare: '#9b59b6', hex: '#9b59b6' },
    { id: 4, nume: 'Apă Distilată', formula: 'H₂O', coef: '0', desc: 'Hazard! Stinge total amestecul.', culoare: '#3b82f6', hex: '#3b82f6' },
  ];

  const dialogData = dateDialoguri.dialoguri["modul_chimie"] || {
    titlu: "Laborator Central - Unitatea de Detonație",
    linii: [
      "Sistemul de securitate al ușii este blindat cu un aliaj greu...",
      "Privesc panoul principal: am nevoie de o reacție chimică în lanț.",
      "O singură eroare în dozaj și tot laboratorul sare în aer. Să fim precisi!"
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

  // Logica de amestecare și verificare a greșelilor
  const adaugaEprubeta = (eprubeta) => {
    if (stareMinigame === 'detonat' || stareMinigame === 'gresit' || vieti <= 0) return;

    // Verificăm dacă a pus apă (id 4) sau a greșit pasul din secvență
    const pasCurentIndex = secventaUser.length;
    const esteGresit = eprubeta.id === 4 || eprubeta.id !== secventaCorecta[pasCurentIndex];

    if (esteGresit) {
      const vietiNoi = vieti - 1;
      setVieti(vietiNoi);
      setStareMinigame('gresit');
      setCuloareAmestec('#ef4444');

      if (eprubeta.id === 4) {
        setMesajEroare("💥 Paharul s-a spart! Ai adăugat Apă Distilată și ai stins reacția chimică!");
      } else if (pasCurentIndex === 0) {
        setMesajEroare("💥 Paharul s-a fisurat! Acidul Sulfuric trebuia pus primul pentru a amorsa baza.");
      } else if (pasCurentIndex === 1) {
        setMesajEroare("💥 Eșec! După acid era nevoie de Stabilizator Organic, nu de această substanță.");
      } else {
        setMesajEroare("💥 Paharul a cedat! Ordinea reactanților este incorectă pentru detonație.");
      }

      setTimeout(() => {
        setSecventaUser([]);
        setStareMinigame('asteptare');
        setCuloareAmestec('transparent');
        setMesajEroare(vietiNoi <= 0 ? "Ai rămas fără vieți! Se resetează laboratorul..." : "Alege prima substanță pentru a începe reacția.");
        if (vietiNoi <= 0) setVieti(3); // Reset vieți la 0
      }, 1800);
      return;
    }

    // Dacă pasul este corect
    const nouaSecventa = [...secventaUser, eprubeta.id];
    setSecventaUser(nouaSecventa);
    setCuloareAmestec(eprubeta.hex);

    if (nouaSecventa.length === 1) {
      setMesajEroare("Bun! Acidul a amorsat baza. Continuă cu stabilizatorul.");
    } else if (nouaSecventa.length === 2) {
      setMesajEroare("Stabilizator integrat corect. Adaugă compusul instabil.");
    } else if (nouaSecventa.length === 3) {
      setMesajEroare("Aproape gata! Mai ai nevoie doar de scânteia catalizatorului.");
    }

    // Verificare succes complet
    if (nouaSecventa.length === secventaCorecta.length) {
      setStareMinigame('detonat');
      setMesajEroare("🔥 Reacție în lanț reușită! Ușa a fost spulberată cu succes!");
      setTimeout(() => {
        onSolved();
      }, 2000);
    }
  };

  // Eprubetă SVG curată
  const EprubetaSVG = ({ plina, culoare }) => (
    <svg width="45" height="85" viewBox="0 0 60 110" style={{ overflow: 'visible' }}>
      <rect x="22" y="2" width="16" height="15" rx="2" fill="none" stroke="#cbd5e1" strokeWidth="3" />
      <path d="M 15 15 L 15 90 C 15 102, 45 102, 45 90 L 45 15 Z" fill="rgba(255, 255, 255, 0.04)" stroke="#cbd5e1" strokeWidth="3" strokeLinejoin="round" />
      {plina && (
        <path d="M 16.5 40 L 16.5 90 C 16.5 100, 43.5 100, 43.5 90 L 43.5 40 Z" fill={culoare} style={{ transition: 'all 0.3s ease' }} />
      )}
    </svg>
  );

  // Generare ecuație chimică cu coeficienți live sub Paharul Berzelius
  const genereazaEcuatieLive = () => {
    if (secventaUser.length === 0) return "Reacție: [ Așteptare reactanți... ]";
    const elemente = secventaUser.map(id => {
      const sub = eprubeteDisponibile[id];
      return `${sub.coef}${sub.formula}`;
    });
    return `Ecuație Activă: ${elemente.join(' + ')} ➔ [ Stare: În curs... ]`;
  };

  return (
    <div className="math-modal-overlay" onClick={mode === 'puzzle' ? onClose : undefined}>
      <style>{`
        @keyframes spargerePahar {
          0%, 100% { transform: translateX(0) scale(1); filter: drop-shadow(0 0 0px red); }
          20% { transform: translateX(-12px) scale(0.95) rotate(-5deg); filter: drop-shadow(0 0 15px red); }
          40% { transform: translateX(12px) scale(1.05) rotate(5deg); filter: drop-shadow(0 0 25px red); }
          60% { transform: translateX(-8px) scale(0.98); }
          80% { transform: translateX(8px) scale(1.02); }
        }
        .pahar-spart { animation: spargerePahar 0.5s ease-in-out; }
      `}</style>

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
        <div 
          className="math-modal-box" 
          onClick={(e) => e.stopPropagation()} 
          style={{ 
            maxWidth: '820px', 
            width: '95%', 
            textAlign: 'center', 
            background: '#090d16', 
            border: '1px solid #1e293b', 
            borderRadius: '16px',
            padding: '25px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.8)'
          }}
        >
          <button className="math-close-btn" onClick={onClose}>×</button>
          
          {/* Header cu Titlu și Vieți (Inimi) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ color: '#f8fafc', fontSize: '1.25rem', margin: 0 }}>
              🧪 Laborator Chimic - Stația de Detonație
            </h2>
            <div style={{ display: 'flex', gap: '6px', fontSize: '1.1rem' }}>
              {[1, 2, 3].map((inima) => (
                <span key={inima} style={{ opacity: inima <= vieti ? 1 : 0.3, filter: inima <= vieti ? 'drop-shadow(0 0 6px #ef4444)' : 'none', transition: 'opacity 0.3s' }}>
                  ❤️
                </span>
              ))}
            </div>
          </div>

          {/* Mesaj informativ / motiv de eroare */}
          <div style={{ 
            background: stareMinigame === 'gresit' ? 'rgba(239, 68, 68, 0.15)' : '#1e293b', 
            padding: '10px 15px', 
            borderRadius: '8px', 
            borderLeft: `4px solid ${stareMinigame === 'gresit' ? '#ef4444' : '#3b82f6'}`,
            margin: '10px 0',
            textAlign: 'left',
            fontSize: '0.85rem',
            color: stareMinigame === 'gresit' ? '#fca5a5' : '#cbd5e1',
            transition: 'all 0.3s'
          }}>
            <span>{mesajEroare}</span>
          </div>

          {/* Paharul Berzelius Central + Animație de spargere la eșec */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '15px 0' }}>
            <div className={stareMinigame === 'gresit' ? 'pahar-spart' : ''} style={{ 
              width: '100px', 
              height: '130px', 
              borderLeft: '5px solid #cbd5e1', 
              borderRight: '5px solid #cbd5e1', 
              borderBottom: '5px solid #cbd5e1', 
              borderRadius: '0 0 14px 14px',
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.03)',
              display: 'flex',
              alignItems: 'flex-end', 
              overflow: 'hidden',
              boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5)'
            }}>
              <div style={{ 
                width: '100%', 
                height: `${(secventaUser.length / secventaCorecta.length) * 100}%`, 
                background: culoareAmestec,
                transition: 'all 0.4s ease',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                {secventaUser.length > 0 && (
                  <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                    {secventaUser.length}/4
                  </span>
                )}
              </div>
            </div>
            <span style={{ marginTop: '6px', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 'bold' }}>
              Paharul Berzelius
            </span>
          </div>

          <div style={{ 
            background: '#0f172a', 
            border: '1px solid #334155', 
            borderRadius: '6px', 
            padding: '8px 12px', 
            margin: '10px 0', 
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            color: '#38bdf8'
          }}>
            {genereazaEcuatieLive()}
          </div>

          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '10px 0 15px 0' }}>
            Alege eprubetele în ordinea corectă pentru a sparge ușa:
          </p>

          {/* Eprubete interactive jos */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '15px' }}>
            {eprubeteDisponibile.map((ep) => (
              <div
                key={ep.id}
                onClick={() => adaugaEprubeta(ep)}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '10px 4px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = ep.culoare;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#334155';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <EprubetaSVG plina={true} culoare={ep.culoare} />
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#f8fafc', marginTop: '4px' }}>{ep.nume}</span>
                <span style={{ fontSize: '0.65rem', color: ep.culoare, fontFamily: 'monospace', marginBottom: '2px' }}>{ep.coef}{ep.formula}</span>
                <span style={{ fontSize: '0.6rem', color: '#94a3b8', textAlign: 'center', minHeight: '26px' }}>{ep.desc}</span>
              </div>
            ))}
          </div>

          {/* Status final */}
          <div style={{ minHeight: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {stareMinigame === 'detonat' && (
              <span style={{ color: '#4ade80', fontSize: '0.9rem', fontWeight: 'bold' }}>
                🔥 SUCCES TOTAL! Ușa a fost deblocată cu succes!
              </span>
            )}
            {stareMinigame === 'asteptare' && (
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Progres:</span>
                {secventaCorecta.map((_, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      width: '20px', 
                      height: '20px', 
                      borderRadius: '50%', 
                      background: idx < secventaUser.length ? '#3b82f6' : 'rgba(255,255,255,0.05)', 
                      border: '1px solid #475569',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      color: '#fff',
                      fontWeight: 'bold'
                    }}
                  >
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