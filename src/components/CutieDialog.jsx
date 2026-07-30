import { useState, useEffect } from 'react';
import { Check, Clock, KeyRound, Trophy } from 'lucide-react';
import dateDialoguri from '../texte/dialoguri.json';
import '../components_css/CutieDialog.css';

import MathPuzzleModal from './MathPuzzleModal';
import MusicPuzzleModal from './MusicPuzzleModal';
import MasinaScrisModal from './MasinaScrisModal';
import ChemistryPuzzleModal from './ChemistryPuzzleModal';

const TOTAL_PUZZLES = 7;

export default function CutieDialog({ dialogId, onDialogTerminat }) {
  const [activeDialogId, setActiveDialogId] = useState(dialogId);
  const [indexLinie, setIndexLinie] = useState(0);
  const [textAfisat, setTextAfisat] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const [nivelLumina, setNivelLumina] = useState(0);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [dialogTerminat, setDialogTerminat] = useState(false);

  const [indexModulJos, setIndexModulJos] = useState(0);
  const [caruselDeschis, setCaruselDeschis] = useState(false);

  const [mathModalOpen, setMathModalOpen] = useState(false);
  const [m8Stage, setM8Stage] = useState(0);
  const [musicModalOpen, setMusicModalOpen] = useState(false);
  const [modul2Open, setModul2Open] = useState(false);
  const [chemistryModalOpen, setChemistryModalOpen] = useState(false);

  const [ecranFinalComplet, setEcranFinalComplet] = useState(() => {
    return localStorage.getItem('infoMotion_ecranFinalComplet') === 'true';
  });

  const [fundalFinal, setFundalFinal] = useState(() => {
    return localStorage.getItem('infoMotion_fundalCastig') || null;
  });

  const [codUsa, setCodUsa] = useState('');
  const [eroareUsa, setEroareUsa] = useState(false);
  const [usaDeschisa, setUsaDeschisa] = useState(() => {
    return localStorage.getItem('infoMotion_usaDeschisa') === 'true';
  });

  const [timpScurs, setTimpScurs] = useState(() => {
    const timpSalvat = localStorage.getItem('infoMotion_timpScurs');
    return timpSalvat ? parseInt(timpSalvat, 10) : 0;
  });

  const [jocTerminatTimp, setJocTerminatTimp] = useState(() => {
    return localStorage.getItem('infoMotion_jocTerminatTimp') === 'true';
  });

  const [moduleRezolvate, setModuleRezolvate] = useState(() => {
    const salvat = localStorage.getItem('infoMotion_rezolvate');
    return salvat ? JSON.parse(salvat) : [];
  });

  const [moduleGlobalRezolvate, setModuleGlobalRezolvate] = useState(() => {
    const salvatGlobal = localStorage.getItem('infoMotion_moduleGlobalRezolvate');
    return salvatGlobal ? JSON.parse(salvatGlobal) : [];
  });

  const [valoriInput, setValoriInput] = useState({
    m4: '',
    m5: '',
    m6: '',
  });

  const [erori, setErori] = useState({
    m4: '',
    m5: '',
    m6: '',
  });

  const dialogCurent =
    dateDialoguri.dialoguri[activeDialogId] || dateDialoguri.dialoguri[dialogId];

  const panouriPodea = [
    { id: 'sus-centru', clasa: 'podea-stanga', titlu: 'Module 1', imagine: '/chimie.png' },
    { id: 'stanga-sus', clasa: 'podea-centru', titlu: 'Module 2', imagine: '/typewriter.png' },
    { id: 'dreapta-sus', clasa: 'podea-dreapta', titlu: 'Module 3', imagine: '/sintetizator.png' },
  ];

  const moduleJosPoze = [
    { id: 'm4', clasa: 'poza-stiva-1', titlu: 'Circuit 1', imagine: '/circuit1.png', raspunsCorect: '12' },
    { id: 'm5', clasa: 'poza-stiva-2', titlu: 'Circuit 2', imagine: '/circuit2.png', raspunsCorect: '5' },
    { id: 'm6', clasa: 'poza-stiva-3', titlu: 'Circuit 3', imagine: '/circuit3.png', raspunsCorect: '10' },
  ];

  const modulMasa = {
    id: 'm8',
    clasa: 'podea-stanga-jos',
    titlu: 'Module 8',
    imagine: '/masabtn.png',
  };

  useEffect(() => {
    setActiveDialogId(dialogId);
    setIndexLinie(0);
    setDialogTerminat(false);
  }, [dialogId]);

  useEffect(() => {
    if (jocTerminatTimp || moduleRezolvate.length === TOTAL_PUZZLES) return;

    const timer = setInterval(() => {
      setTimpScurs((prev) => {
        const nouTimp = prev + 1;
        localStorage.setItem('infoMotion_timpScurs', nouTimp.toString());
        return nouTimp;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [jocTerminatTimp, moduleRezolvate.length]);

  useEffect(() => {
    const rezolvateSursa = JSON.parse(localStorage.getItem('infoMotion_rezolvate') || '[]');
    const deLaSigurante = rezolvateSursa.filter((id) => ['m4', 'm5', 'm6'].includes(id)).length;

    if (!usaDeschisa) {
      setNivelLumina(deLaSigurante);
    }
  }, [usaDeschisa]);

  useEffect(() => {
    localStorage.setItem('infoMotion_rezolvate', JSON.stringify(moduleRezolvate));

    if (moduleRezolvate.length === TOTAL_PUZZLES && !jocTerminatTimp) {
      setJocTerminatTimp(true);
      localStorage.setItem('infoMotion_jocTerminatTimp', 'true');
    }
  }, [moduleRezolvate, jocTerminatTimp]);

  useEffect(() => {
    localStorage.setItem(
      'infoMotion_moduleGlobalRezolvate',
      JSON.stringify(moduleGlobalRezolvate)
    );
  }, [moduleGlobalRezolvate]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!dialogCurent) return;
    if (dialogTerminat && activeDialogId !== 'dialog_win_secret') return;

    const textComplet = dialogCurent.linii[indexLinie];
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
  }, [indexLinie, dialogCurent, activeDialogId, dialogTerminat]);

  const formateazaTimp = (secundeTotale) => {
    const minute = Math.floor(secundeTotale / 60);
    const secunde = secundeTotale % 60;
    return `${minute.toString().padStart(2, '0')}:${secunde
      .toString()
      .padStart(2, '0')}`;
  };

  const adaugaLaProgresGlobal = (idModul) => {
    const idUnicGlobal = `${dialogId}-${idModul}`;
    setModuleGlobalRezolvate((prev) => {
      if (prev.includes(idUnicGlobal)) return prev;
      return [...prev, idUnicGlobal];
    });
  };

  const actiuneTreciMaiDeparte = () => {
    if (!dialogCurent || isTyping) return;

    if (indexLinie < dialogCurent.linii.length - 1) {
      setIndexLinie((prev) => prev + 1);
    } else {
      setDialogTerminat(true);

      if (activeDialogId === 'dialogMasa') {
        setMathModalOpen(true);
      } else if (onDialogTerminat) {
        onDialogTerminat();
      }
    }
  };

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
    const handleKeyDown = (e) => {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (caruselDeschis) {
        if (e.key === 'ArrowLeft') navigaPoze(-1, null);
        if (e.key === 'ArrowRight') navigaPoze(1, null);
        if (e.key === 'Escape') setCaruselDeschis(false);
        return;
      }

      if ((!dialogTerminat || activeDialogId === 'dialog_win_secret') && e.code === 'Space') {
        e.preventDefault();
        actiuneTreciMaiDeparte();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [caruselDeschis, dialogTerminat, activeDialogId, isTyping, indexLinie, dialogCurent]);

  const verificaCodUsa = (e) => {
    e.preventDefault();
    const codCorectPredefinit = '123456789';

    if (codUsa.trim() === codCorectPredefinit) {
      setUsaDeschisa(true);
      localStorage.setItem('infoMotion_usaDeschisa', 'true');
      setEroareUsa(false);

      setNivelLumina(3);
      localStorage.setItem('infoMotion_nivelLumina', '3');

      const imagineNoua = '/backrounwin.png';
      setFundalFinal(imagineNoua);
      localStorage.setItem('infoMotion_fundalCastig', imagineNoua);

      setActiveDialogId('dialog_win_secret');
      setIndexLinie(0);
      setDialogTerminat(false);
      setCodUsa('');
    } else {
      setEroareUsa(true);
      setTimeout(() => setEroareUsa(false), 1500);
    }
  };

  const handleInputChange = (id, valoare) => {
    setValoriInput((prev) => ({ ...prev, [id]: valoare }));
    if (erori[id]) {
      setErori((prev) => ({ ...prev, [id]: '' }));
    }
  };

  const verificaRaspunsMultiplu = (e, id, raspunsCorect) => {
    e.preventDefault();

    if (valoriInput[id].trim() === raspunsCorect) {
      if (!moduleRezolvate.includes(id)) {
        const noiRezolvate = [...moduleRezolvate, id];
        setModuleRezolvate(noiRezolvate);

        if (['m4', 'm5', 'm6'].includes(id) && !usaDeschisa) {
          setNivelLumina((prev) => Math.min(prev + 1, 3));
        }

        adaugaLaProgresGlobal(id);
      }

      setErori((prev) => ({ ...prev, [id]: '' }));
    } else {
      setErori((prev) => ({ ...prev, [id]: 'Incorrect' }));
    }
  };

  const handlePanouClick = (e, panouId) => {
    e.stopPropagation();

    if (panouId === 'dreapta-sus') {
      setMusicModalOpen(true);
      return;
    }

    if (panouId === 'stanga-sus') {
      setModul2Open(true);
      return;
    }

    if (panouId === 'sus-centru') {
      if (!usaDeschisa) {
        alert('This module is locked. Enter the correct door PIN first.');
        return;
      }
      setChemistryModalOpen(true);
    }
  };

  const handleMasaClick = (e) => {
    e.stopPropagation();
    setMathModalOpen(true);
  };

  if (!dialogCurent) return null;

  const estePenultimulSauMaiDeparte =
    activeDialogId !== 'intro_camera' ||
    indexLinie >= dialogCurent.linii.length - 2;

  const procentProgres = Math.round(
    (moduleRezolvate.length / TOTAL_PUZZLES) * 100
  );

  if (ecranFinalComplet) {
    const sub15Minute = timpScurs <= 900;

    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: '#000',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 99999,
          fontFamily: 'monospace',
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <Trophy size={64} color="#ffd700" style={{ marginBottom: '20px' }} />
        <h1 style={{ fontSize: '2.5rem', color: '#4ade80', marginBottom: '10px' }}>
          CONGRATULATIONS!
        </h1>
        <p
          style={{
            fontSize: '1.2rem',
            color: '#cbd5e1',
            maxWidth: '600px',
            lineHeight: 1.6,
            marginBottom: '20px',
          }}
        >
          You completed every module, including the final chemistry experiment,
          and escaped the room.
        </p>
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.7)',
            border: '1px solid #475569',
            padding: '15px 30px',
            borderRadius: '10px',
            fontSize: '1.5rem',
            marginBottom: '30px',
            color: '#38bdf8',
          }}
        >
          Time: <strong>{formateazaTimp(timpScurs)}</strong>
        </div>
        <p
          style={{
            fontSize: '1.1rem',
            color: sub15Minute ? '#4ade80' : '#f87171',
            fontWeight: 'bold',
          }}
        >
          {sub15Minute
            ? 'You escaped in under 15 minutes!'
            : 'You went over 15 minutes, but you still made it out!'}
        </p>
      </div>
    );
  }

  return (
    <div className={`dialog-overlay ${fundalFinal ? 'castigat' : ''}`}>
      <div className="licurici-container">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="licurici"></div>
        ))}
      </div>

      <div
        className="cursor-lumina"
        style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
      ></div>

      {!usaDeschisa && (
        <div className={`overlay-intuneric lumina-nivel-${nivelLumina}`}></div>
      )}

      <div
        style={{
          position: 'absolute',
          top: '15px',
          left: '15px',
          zIndex: 100,
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid #334155',
            borderRadius: '8px',
            padding: '6px 14px',
            color: '#38bdf8',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          }}
        >
          <Clock size={16} />
          Time: {formateazaTimp(timpScurs)}
        </div>
      </div>

      {estePenultimulSauMaiDeparte && (
        <div className="fundal-efecte">
          <div className="infomotion-cifru-usa-container">
            <div className="infomotion-cifru-titlu">
              <KeyRound size={12} /> Door PIN
            </div>

            {usaDeschisa ? (
              <span className="infomotion-cifru-succes">UNLOCKED ✓</span>
            ) : (
              <form
                onSubmit={verificaCodUsa}
                onClick={(e) => e.stopPropagation()}
                className="infomotion-cifru-form"
              >
                <input
                  type="password"
                  value={codUsa}
                  onChange={(e) => setCodUsa(e.target.value)}
                  placeholder="PIN..."
                  className={`infomotion-cifru-input ${eroareUsa ? 'eroare' : ''}`}
                  autoComplete="off"
                />
                <button type="submit" className="infomotion-cifru-btn">
                  OK
                </button>
              </form>
            )}
          </div>

          <div className="container-progres-global">
            <div className="info-progres-text">
              <span>
                Escape Room Progress: {moduleRezolvate.length} / {TOTAL_PUZZLES} Modules
              </span>
              <span>{procentProgres}%</span>
            </div>
            <div className="baral-progres-fundal">
              <div
                className="bara-progres-umpluta"
                style={{ width: `${procentProgres}%` }}
              ></div>
            </div>
          </div>

          <div className="bec-container">
            <div className="fir-bec"></div>
            <div className={`bec-lumina bec-lumina-nivel-${nivelLumina}`}></div>
          </div>

          <div className="sectiune-dreapta-sigurante">
            <div className="titlu-circuit-board">Circuit Board</div>

            {moduleJosPoze.map((modul) => {
              const esteRezolvat = moduleRezolvate.includes(modul.id);

              return (
                <div key={modul.id} className="rand-circuit-input">
                  <input
                    type="text"
                    placeholder="Answer..."
                    value={valoriInput[modul.id]}
                    onChange={(e) => handleInputChange(modul.id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="circuit-input"
                  />
                  <button
                    onClick={(e) => verificaRaspunsMultiplu(e, modul.id, modul.raspunsCorect)}
                    className={`circuit-btn ${esteRezolvat ? 'rezolvat' : ''}`}
                  >
                    {esteRezolvat ? '✓' : 'OK'}
                  </button>
                  {erori[modul.id] && (
                    <span className="circuit-error">{erori[modul.id]}</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="zona-circuite-dreapta">
            {moduleJosPoze.map((modul, idx) => {
              const esteSelectat = idx === indexModulJos;
              const esteDejaRezolvat = moduleRezolvate.includes(modul.id);

              return (
                <div
                  key={modul.id}
                  className={`poza-circuit-stiva ${modul.clasa} ${esteSelectat ? 'poza-circuit-activa' : ''} ${esteDejaRezolvat ? 'modul-verde' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIndexModulJos(idx);
                    setCaruselDeschis(true);
                  }}
                >
                  <img src={modul.imagine} alt={modul.titlu} />
                  <div className="tag-circuit-mic">
                     {esteDejaRezolvat && <Check size={12} />}
                  </div>
                </div>
              );
            })}

            <div
              className="navigatie-circuite-dreapta"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="sageata-poza" onClick={(e) => navigaPoze(-1, e)}>
                ❮
              </button>
              <button className="sageata-poza" onClick={(e) => navigaPoze(1, e)}>
                ❯
              </button>
            </div>
          </div>

          <div className="container-module-podea">
            {panouriPodea.map((panou) => {
              const esteRezolvatPanou =
                (panou.id === 'dreapta-sus' && moduleRezolvate.includes('m3')) ||
                (panou.id === 'stanga-sus' && moduleRezolvate.includes('m2')) ||
                (panou.id === 'sus-centru' && moduleRezolvate.includes('m1'));

              return (
                <div
                  key={panou.id}
                  className={`modul-podea ${panou.clasa} ${esteRezolvatPanou ? 'modul-verde' : ''}`}
                  onClick={(e) => handlePanouClick(e, panou.id)}
                  style={{
                    opacity: panou.id === 'sus-centru' && !usaDeschisa ? 0.6 : 1,
                  }}
                >
                  <img src={panou.imagine} alt={panou.titlu} />
                  <div className="tag-modul-podea">
                    {panou.titlu}
                    {esteRezolvatPanou && <Check size={14} />}
                    {panou.id === 'sus-centru' && !usaDeschisa && ' 🔒'}
                  </div>
                </div>
              );
            })}

            <div
              key={modulMasa.id}
              className={`modul-podea ${modulMasa.clasa} ${moduleRezolvate.includes('m8') ? 'modul-verde' : ''}`}
              onClick={handleMasaClick}
            >
              <img src={modulMasa.imagine} alt={modulMasa.titlu} />
              <div className="tag-modul-podea">
                {modulMasa.titlu}
                {moduleRezolvate.includes('m8') && <Check size={14} />}
              </div>
            </div>
          </div>
        </div>
      )}

      {moduleRezolvate.length === TOTAL_PUZZLES && usaDeschisa && (
        <div
          style={{
            position: 'fixed',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 99999,
            background: 'rgba(15, 23, 42, 0.95)',
            border: '2px solid #4ade80',
            padding: '15px 30px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.8)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span style={{ color: '#4ade80', fontWeight: 'bold', fontSize: '1rem' }}>
            All modules are complete!
          </span>
          <button
            onClick={() => {
              setEcranFinalComplet(true);
              localStorage.setItem('infoMotion_ecranFinalComplet', 'true');
            }}
            style={{
              background: '#22c55e',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Show Final Screen
          </button>
        </div>
      )}

      {(!dialogTerminat || activeDialogId === 'dialog_win_secret') && (
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
          <div
            className="dialog-hint"
            style={{ opacity: isTyping ? 0 : 1, transition: 'opacity 0.3s' }}
          >
            Click or Press Space to continue ▼
          </div>
        </div>
      )}

      {caruselDeschis && (
        <div className="galerie-fullscreen" onClick={() => setCaruselDeschis(false)}>
          <button
            className="buton-inchidere-galerie"
            onClick={(e) => {
              e.stopPropagation();
              setCaruselDeschis(false);
            }}
          >
            ×
          </button>

          <button className="sageata-galerie stanga" onClick={(e) => navigaPoze(-1, e)}>
            ❮
          </button>

          <img
            src={moduleJosPoze[indexModulJos].imagine}
            alt={moduleJosPoze[indexModulJos].titlu}
            className="galerie-imagine"
            onClick={(e) => e.stopPropagation()}
          />

          <button className="sageata-galerie dreapta" onClick={(e) => navigaPoze(1, e)}>
            ❯
          </button>
        </div>
      )}

      {chemistryModalOpen && (
        <ChemistryPuzzleModal
          onClose={() => setChemistryModalOpen(false)}
          onSolved={() => {
            if (!moduleRezolvate.includes('m1')) {
              const noiRezolvate = [...moduleRezolvate, 'm1'];
              setModuleRezolvate(noiRezolvate);
              adaugaLaProgresGlobal('m1');
              localStorage.setItem(
                'infoMotion_notaChimie',
                'H2SO4 chemistry reaction completed'
              );

              const imagineFinalaNoua = '/backrounwin.png';
              setFundalFinal(imagineFinalaNoua);
              localStorage.setItem('infoMotion_fundalCastig', imagineFinalaNoua);
            }

            setChemistryModalOpen(false);
          }}
        />
      )}

      {mathModalOpen && (
        <MathPuzzleModal
          stage={m8Stage}
          isAlreadySolved={moduleRezolvate.includes('m8')}
          onClose={() => setMathModalOpen(false)}
          onSolvedStage={() => {
            const next = m8Stage + 1;
            setM8Stage(next);

            if (next >= 3 && !moduleRezolvate.includes('m8')) {
              const noiRezolvate = [...moduleRezolvate, 'm8'];
              setModuleRezolvate(noiRezolvate);
              adaugaLaProgresGlobal('m8');
            }
          }}
        />
      )}

      {musicModalOpen && (
        <MusicPuzzleModal
          onClose={() => setMusicModalOpen(false)}
          onSolved={() => {
            if (!moduleRezolvate.includes('m3')) {
              const noiRezolvate = [...moduleRezolvate, 'm3'];
              setModuleRezolvate(noiRezolvate);
              adaugaLaProgresGlobal('m3');
              localStorage.setItem(
                'infoMotion_notaMuzica',
                'Correct synthesizer sequence activated'
              );
            }

            setMusicModalOpen(false);
          }}
        />
      )}

      {modul2Open && (
        <MasinaScrisModal
          isAlreadySolved={moduleRezolvate.includes('m2')}
          onClose={() => setModul2Open(false)}
          onSolved={() => {
            if (!moduleRezolvate.includes('m2')) {
              const noiRezolvate = [...moduleRezolvate, 'm2'];
              setModuleRezolvate(noiRezolvate);
              adaugaLaProgresGlobal('m2');
              localStorage.setItem(
                'infoMotion_notaMasina',
                'Typewriter code validated'
              );
            }

            setModul2Open(false);
          }}
        />
      )}
    </div>
  );
}