import { useState, useEffect } from 'react';
import { Lightbulb, Check, Zap } from 'lucide-react';
import dateDialoguri from '../texte/dialoguri.json';
import '../components_css/CutieDialog.css';

import MathPuzzleModal from './MathPuzzleModal';
import MusicPuzzleModal from './MusicPuzzleModal';
import MasinaScrisModal from './MasinaScrisModal';
import CarnetNotite from './CarnetNotite'; 

const TOTAL_MODULE_JOC = 10;
const TOTAL_PUZZLES = 5; 

export default function CutieDialog({ dialogId, onDialogTerminat, totalModulePlatforma = 12 }) {
  const [indexLinie, setIndexLinie] = useState(0);
  const [textAfisat, setTextAfisat] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  
  const [nivelLumina, setNivelLumina] = useState(0);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [dialogTerminat, setDialogTerminat] = useState(false);
  const [indexModulJos, setIndexModulJos] = useState(0);
  const [caruselDeschis, setCaruselDeschis] = useState(false);
  const [carnetDeschis, setCarnetDeschis] = useState(false); 

  const [mathModalOpen, setMathModalOpen] = useState(false);
  const [m8Stage, setM8Stage] = useState(0);
  const [musicModalOpen, setMusicModalOpen] = useState(false);
  const [modul2Open, setModul2Open] = useState(false);

  const [moduleRezolvate, setModuleRezolvate] = useState(() => {
    const salvat = localStorage.getItem('infoMotion_rezolvate');
    return salvat ? JSON.parse(salvat) : [];
  });

  const [moduleGlobalRezolvate, setModuleGlobalRezolvate] = useState(() => {
    const salvatGlobal = localStorage.getItem('infoMotion_moduleGlobalRezolvate');
    return salvatGlobal ? JSON.parse(salvatGlobal) : [];
  });

  const [valoriInput, setValoriInput] = useState({ m4: '', m5: '', m6: '' });
  const [erori, setErori] = useState({ m4: '', m5: '', m6: '' });

  const [activeDialogId, setActiveDialogId] = useState(dialogId);
  const dialogCurent = dateDialoguri.dialoguri[activeDialogId];

  const panouriSus = [
    { id: 'sus-centru', clasa: 'panou-sus-centru', titlu: 'Modul 1', imagine: '/modul1.png' },
    { id: 'stanga-sus', clasa: 'panou-stanga-sus', titlu: 'Modul 2', imagine: '/typewriter.png' },
    { id: 'dreapta-sus', clasa: 'panou-dreapta-sus', titlu: 'Modul 3', imagine: '/pick-up.png' },
  ];

  const moduleJosPoze = [
    { id: 'm4', clasa: 'modul-stanga-jos', titlu: 'Modul 4', imagine: '/bun.jpeg', raspunsCorect: '12' },
    { id: 'm5', clasa: 'modul-centru-jos-1', titlu: 'Modul 5', imagine: '/nivel1.jpeg', raspunsCorect: '5' },
    { id: 'm6', clasa: 'modul-centru-jos-2', titlu: 'Modul 6', imagine: '/nivel2.jpeg', raspunsCorect: '10' },
  ];

  const modulMasa = { id: 'm8', clasa: 'modul-stanga-centru-jos', titlu: 'Modulul 8', imagine: '/masabtn.png' };

  useEffect(() => {
    const rezolvateSursa = JSON.parse(localStorage.getItem('infoMotion_rezolvate') || '[]');
    const deLaSigurante = rezolvateSursa.filter(id => ['m4', 'm5', 'm6'].includes(id)).length;
    setNivelLumina(deLaSigurante);
  }, []);

  useEffect(() => {
    localStorage.setItem('infoMotion_rezolvate', JSON.stringify(moduleRezolvate));
  }, [moduleRezolvate]);

  useEffect(() => {
    localStorage.setItem('infoMotion_moduleGlobalRezolvate', JSON.stringify(moduleGlobalRezolvate));
  }, [moduleGlobalRezolvate]);

  const navigaPoze = (directie, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setIndexModulJos((prev) => {
      let urmatorul = prev + directie;
      if (urmatorul >= moduleJosPoze.length) return 0;
      if (urmatorul < 0) return moduleJosPoze.length - 1;
      return urmatorul;
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!dialogCurent) return;

    const textComplet = dialogCurent.linii[indexLinie];
    let indexCurent = 0;
    setTextAfisat('');
    setIsTyping(true);

    const interval = setInterval(() => {
      if (indexCurent < textComplet.length) {
        const bucataDeText = textComplet.substring(0, indexCurent + 1);
        setTextAfisat(bucataDeText);
        indexCurent++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [indexLinie, dialogCurent]);

  const actiuneTreciMaiDeparte = () => {
    if (isTyping) return;
    
    if (indexLinie < dialogCurent.linii.length - 1) {
      setIndexLinie((prev) => prev + 1);
    } else {
      setDialogTerminat(true); 
      
      if (activeDialogId === "dialogMasa") {
        setMathModalOpen(true); 
      } else {
        if (onDialogTerminat) onDialogTerminat(); 
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return; 
      
      if (caruselDeschis) {
        if (e.key === 'ArrowLeft') navigaPoze(-1, null);
        if (e.key === 'ArrowRight') navigaPoze(1, null);
        if (e.key === 'Escape') setCaruselDeschis(false);
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        actiuneTreciMaiDeparte();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTyping, indexLinie, dialogCurent, onDialogTerminat, caruselDeschis]);

  const handleInputChange = (id, valoare) => {
    setValoriInput(prev => ({ ...prev, [id]: valoare }));
    if (erori[id]) {
      setErori(prev => ({ ...prev, [id]: '' }));
    }
  };

  const adaugaLaProgresGlobal = (idModul) => {
    const idUnicGlobal = `${dialogId}-${idModul}`;
    setModuleGlobalRezolvate((prev) => {
      if (prev.includes(idUnicGlobal)) return prev;
      return [...prev, idUnicGlobal];
    });
  };

  const verificaRaspunsMultiplu = (e, id, raspunsCorect) => {
    e.preventDefault();
    if (valoriInput[id].trim() === raspunsCorect) {
      if (!moduleRezolvate.includes(id)) {
        const noiRezolvate = [...moduleRezolvate, id];
        setModuleRezolvate(noiRezolvate);
        
        if (['m4', 'm5', 'm6'].includes(id)) {
          setNivelLumina(prev => Math.min(prev + 1, 3));
        }

        adaugaLaProgresGlobal(id);
      }
    } else {
      setErori(prev => ({ ...prev, [id]: 'Incorect' }));
    }
  };

  const SchimbaLumina = (e) => {
    e.stopPropagation();
    setNivelLumina((prev) => (prev < 3 ? prev + 1 : 0));
  };

  const handlePanouClick = (e, panouId) => {
    e.stopPropagation();
    if (panouId === 'dreapta-sus') {
      setMusicModalOpen(true);
    } else if (panouId === 'stanga-sus') {
      setModul2Open(true);
    } else {
      console.log(`Ai apăsat pe panoul: ${panouId}`);
    }
  };

  const handleMasaClick = (e) => {
    e.stopPropagation();
    setMathModalOpen(true);
  };

  if (!dialogCurent) return null;
  const estePenultimulSauMaiDeparte = activeDialogId !== "intro_camera" || indexLinie >= dialogCurent.linii.length - 2;
  const procentProgres = Math.round((moduleRezolvate.length / TOTAL_PUZZLES) * 100);

  return (
    <div className="dialog-overlay">
      <div className="cursor-lumina" style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}></div>
      <div className={`overlay-intuneric lumina-nivel-${nivelLumina}`}></div>
      
      <button className="buton-comutator-lumina" onClick={SchimbaLumina} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Lightbulb size={16} /> Lumina: {nivelLumina === 0 ? 'Off (Glow)' : nivelLumina === 1 ? '33%' : nivelLumina === 2 ? '66%' : '100%'}
      </button>

      {estePenultimulSauMaiDeparte && (
        <div className="fundal-efecte">
          
          <div className="container-progres-global">
            <div className="info-progres-text">
              <span>Progres Escape Room: {moduleRezolvate.length} / {TOTAL_PUZZLES} Module</span>
              <span>{procentProgres}%</span>
            </div>
            <div className="baral-progres-fundal">
              <div className="bara-progres-umpluta" style={{ width: `${procentProgres}%` }}></div>
            </div>
          </div>

          <div className="bec-container">
            <div className="fir-bec"></div>
            <div className={`bec-lumina bec-lumina-nivel-${nivelLumina}`}></div>
          </div>

          <div className="panou-dreapta panou-input-multiplu">
            <h3>Tablou Siguranțe</h3>
            <div className="lista-mini-formulare">
              {moduleJosPoze.map((modul) => {
                const esteRezolvat = moduleRezolvate.includes(modul.id);
                return (
                  <div key={modul.id} className={`mini-form-container ${esteRezolvat ? 'rezolvat-box' : ''}`}>
                    <h4>{modul.titlu}</h4>
                    {esteRezolvat ? (
                      <span className="status-verde-mic" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Conectat <Check size={14} />
                      </span>
                    ) : (
                      <form onSubmit={(e) => verificaRaspunsMultiplu(e, modul.id, modul.raspunsCorect)} className="mini-form">
                        <div className="input-grup-orizontal">
                          <input
                            type="text"
                            value={valoriInput[modul.id]}
                            onChange={(e) => handleInputChange(modul.id, e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            placeholder="ex: 10"
                            autoComplete="off"
                          />
                          <button type="submit" onClick={(e) => e.stopPropagation()}>OK</button>
                        </div>
                        {erori[modul.id] && <span className="eroare-text-mic">{erori[modul.id]}</span>}
                      </form>
                    )}
                  </div>
                );
              })}
            </div>
            {moduleRezolvate.length === TOTAL_PUZZLES && (
              <div className="status-final-curent" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                Toate sistemele funcționale! <Zap size={18} />
              </div>
            )}
          </div>

          <div className="container-panouri-central">
            
            {panouriSus.map((panou) => {
              const esteRezolvatPanou = 
                (panou.id === 'dreapta-sus' && moduleRezolvate.includes('m3')) ||
                (panou.id === 'stanga-sus' && moduleRezolvate.includes('m2')) ||
                (panou.id === 'sus-centru' && moduleRezolvate.includes('m1'));
                
              return (
                <div
                  key={panou.id}
                  className={`modul-poza-jos ${panou.clasa} ${esteRezolvatPanou ? 'modul-verde' : ''}`}
                  onClick={(e) => handlePanouClick(e, panou.id)}
                >
                  <img src={panou.imagine} alt={panou.titlu} onError={(e) => console.error("Eroare poză", panou.imagine)} />
                  <div className="tag-modul-jos" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    {panou.titlu} {esteRezolvatPanou && <Check size={14} />}
                  </div>
                </div>
              );
            })}

            {moduleJosPoze.map((modul, idx) => {
              const esteSelectat = idx === indexModulJos;
              const esteDejaRezolvat = moduleRezolvate.includes(modul.id);
              
              return (
                <div
                  key={modul.id}
                  className={`modul-poza-jos ${modul.clasa} ${esteSelectat ? 'poza-activa' : ''} ${esteDejaRezolvat ? 'modul-verde' : ''}`}
                  onClick={(e) => {
                    setIndexModulJos(idx);
                    setCaruselDeschis(true);
                    handlePanouClick(e, modul.id);
                  }}
                >
                  <img src={modul.imagine} alt={modul.titlu} onError={(e) => console.error("Eroare poză", modul.imagine)} />
                  <div className="tag-modul-jos" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    {modul.titlu} {esteDejaRezolvat && <Check size={14} />}
                  </div>
                </div>
              );
            })}

            <div
              key={modulMasa.id}
              className={`modul-poza-jos ${modulMasa.clasa} ${moduleRezolvate.includes("m8") ? "modul-verde" : ""}`}
              onClick={handleMasaClick}
            >
              <img src={modulMasa.imagine} alt={modulMasa.titlu} onError={(e) => console.error("Eroare poză", modulMasa.imagine)} />
              <div className="tag-modul-jos" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                {modulMasa.titlu} {moduleRezolvate.includes("m8") && <Check size={14} />}
              </div>
            </div>

            <div className="navigatie-poze-jos" onClick={(e) => e.stopPropagation()}>
              <button className="sageata-poza prev-poza" onClick={(e) => navigaPoze(-1, e)}>❮</button>
              <button className="sageata-poza next-poza" onClick={(e) => navigaPoze(1, e)}>❯</button>
            </div>
          </div>
        </div>
      )}

      {!dialogTerminat && (
        <div 
          className="dialog-box" 
          onClick={actiuneTreciMaiDeparte}
          style={{ cursor: isTyping ? 'default' : 'pointer' }}
        >
          <div className="dialog-name">{dialogCurent.titlu}</div>
          <p className="dialog-text">
            {textAfisat}
            {!isTyping && <span className="cursor-blink">|</span>}
          </p>
          <div className="dialog-hint" style={{ opacity: isTyping ? 0 : 1, transition: 'opacity 0.3s' }}>
            Press Space to continue ▼
          </div>
        </div>
      )}

      <CarnetNotite />

      {caruselDeschis && (
        <div className="galerie-fullscreen" onClick={() => setCaruselDeschis(false)}>
          <button className="buton-inchidere-galerie" onClick={(e) => { e.stopPropagation(); setCaruselDeschis(false); }}>×</button>
          <button className="sageata-galerie stanga" onClick={(e) => navigaPoze(-1, e)}>❮</button>
          <img src={moduleJosPoze[indexModulJos].imagine} alt={moduleJosPoze[indexModulJos].titlu} className="galerie-imagine" onClick={(e) => e.stopPropagation()} />
          <button className="sageata-galerie dreapta" onClick={(e) => navigaPoze(1, e)}>❯</button>
        </div>
      )}

      {mathModalOpen && (
        <MathPuzzleModal
          stage={m8Stage}
          isAlreadySolved={moduleRezolvate.includes("m8")} 
          onClose={() => setMathModalOpen(false)}
          onSolvedStage={() => {
            const next = m8Stage + 1;
            setM8Stage(next);
            
            if (next >= 3 && !moduleRezolvate.includes("m8")) {
              const noiRezolvate = [...moduleRezolvate, "m8"];
              setModuleRezolvate(noiRezolvate);
              adaugaLaProgresGlobal("m8");
            }
          }}
        />
      )}

      {musicModalOpen && (
        <MusicPuzzleModal
          onClose={() => setMusicModalOpen(false)}
          onSolved={() => {
            if (!moduleRezolvate.includes("m3")) {
              const noiRezolvate = [...moduleRezolvate, "m3"];
              setModuleRezolvate(noiRezolvate);
              adaugaLaProgresGlobal("m3");
            }
            setMusicModalOpen(false);
          }}
        />
      )}

      {modul2Open && (
        <MasinaScrisModal
          isAlreadySolved={moduleRezolvate.includes("m2")}
          onClose={() => setModul2Open(false)}
          onSolved={() => {
            if (!moduleRezolvate.includes("m2")) {
              const noiRezolvate = [...moduleRezolvate, "m2"];
              setModuleRezolvate(noiRezolvate);
              adaugaLaProgresGlobal("m2");
            }
            setModul2Open(false);
          }}
        />
      )}

    </div>
  );
}