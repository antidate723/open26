import { useState, useEffect } from 'react';
import dateDialoguri from '../texte/dialoguri.json';
import '../components_css/CutieDialog.css';

export default function CutieDialog({ dialogId, onDialogTerminat }) {
  const [indexLinie, setIndexLinie] = useState(0);
  const [textAfisat, setTextAfisat] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [nivelLumina, setNivelLumina] = useState(0);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [dialogTerminat, setDialogTerminat] = useState(false);
  
  const [indexModulJos, setIndexModulJos] = useState(0);
  const [caruselDeschis, setCaruselDeschis] = useState(false);

  const [moduleRezolvate, setModuleRezolvate] = useState([]); 
  const [valoriInput, setValoriInput] = useState({ m4: '', m5: '', m6: '' });
  const [erori, setErori] = useState({ m4: '', m5: '', m6: '' });

  const dialogCurent = dateDialoguri.dialoguri[dialogId];

  const panouriSus = [
    { id: 'sus-centru', clasa: 'panou-sus-centru', text: 'Modul 1' },
    { id: 'stanga-sus', clasa: 'panou-stanga-sus', text: 'Modul 2' },
    { id: 'dreapta-sus', clasa: 'panou-dreapta-sus', text: 'Modul 3' },
  ];

  const moduleJosPoze = [
    { id: 'm4', clasa: 'modul-stanga-jos', titlu: 'Modul 4', imagine: '/bun.jpeg', raspunsCorect: '1' },
    { id: 'm5', clasa: 'modul-centru-jos-1', titlu: 'Modul 5', imagine: '/nivel1.jpeg', raspunsCorect: '2' },
    { id: 'm6', clasa: 'modul-centru-jos-2', titlu: 'Modul 6', imagine: '/nivel2.jpeg', raspunsCorect: '3' },
  ];

  const modulMasa = { 
    id: 'm8', 
    clasa: 'modul-stanga-centru-jos', 
    titlu: 'Modulul 8', 
    imagine: '/masabtn.png' 
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
      if (onDialogTerminat) onDialogTerminat();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT') return; 

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

  const verificaRaspunsMultiplu = (e, id, raspunsCorect) => {
    e.preventDefault();
    
    if (valoriInput[id].trim() === raspunsCorect) {
      if (!moduleRezolvate.includes(id)) {
        const noiRezolvate = [...moduleRezolvate, id];
        setModuleRezolvate(noiRezolvate);
        
        setNivelLumina(noiRezolvate.length);
      }
    } else {
      setErori(prev => ({ ...prev, [id]: 'Incorect' }));
    }
  };

  if (!dialogCurent) return null;

  const estePenultimulSauMaiDeparte = indexLinie >= dialogCurent.linii.length - 2;

  const SchimbaLumina = (e) => {
    e.stopPropagation();
    setNivelLumina((prev) => (prev < 3 ? prev + 1 : 0));
  };

  const handlePanouClick = (e, panouId) => {
    e.stopPropagation();
    console.log(`Ai apăsat pe panoul: ${panouId}`);
  };

  return (
    <div className="dialog-overlay">
      <div
        className="cursor-lumina"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
        }}
      />

      <div className={`overlay-intuneric lumina-nivel-${nivelLumina}`} />

      <button className="buton-comutator-lumina" onClick={SchimbaLumina}>
        💡 Lumina: {nivelLumina === 0 ? 'Off (Glow)' : nivelLumina === 1 ? '33%' : nivelLumina === 2 ? '66%' : '100%'}
      </button>

      {estePenultimulSauMaiDeparte && (
        <div className="fundal-efecte">
          <div className="bec-container">
            <div className="fir-bec" />
            <div className={`bec-lumina bec-lumina-nivel-${nivelLumina}`} />
          </div>

          <div className="panou-lateral panou-stanga" />

          <div className="panou-lateral panou-dreapta panou-input-multiplu">
             <h3>Tablou Siguranțe</h3>
             
             <div className="lista-mini-formulare">
               {moduleJosPoze.map((modul) => {
                 const esteRezolvat = moduleRezolvate.includes(modul.id);
                 
                 return (
                   <div key={modul.id} className={`mini-form-container ${esteRezolvat ? 'rezolvat-box' : ''}`}>
                     <h4>{modul.titlu}</h4>
                     
                     {esteRezolvat ? (
                       <span className="status-verde-mic">Conectat ✅</span>
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
             
             {moduleRezolvate.length === 3 && (
                <div className="status-final-curent">
                  Toate sistemele funcționale! ⚡
                </div>
             )}
          </div>

          <div className="container-panouri-central">
            {panouriSus.map((panou) => (
              <button
                key={panou.id}
                className={`panou-card ${panou.clasa}`}
                onClick={(e) => handlePanouClick(e, panou.id)}
              >
                <span>{panou.text}</span>
              </button>
            ))}

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
                  <img
                    src={modul.imagine}
                    alt={modul.titlu}
                    onError={(e) => console.error("Eroare poză:", modul.imagine)}
                  />
                  <div className="tag-modul-jos">
                    {modul.titlu} {esteDejaRezolvat ? '✅' : ''}
                  </div>
                </div>
              );
            })}

            <div
              key={modulMasa.id}
              className={`modul-poza-jos ${modulMasa.clasa}`}
              onClick={(e) => handlePanouClick(e, modulMasa.id)}
            >
              <img
                src={modulMasa.imagine}
                alt={modulMasa.titlu}
                onError={(e) => console.error("Eroare poză:", modulMasa.imagine)}
              />
              <div className="tag-modul-jos">{modulMasa.titlu}</div>
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
            <span className="cursor-blink">|</span>
          </p>
          <div
            className="dialog-hint"
            style={{ opacity: isTyping ? 0 : 1, transition: 'opacity 0.3s' }}
          >
            Press Space to continue ▼
          </div>
        </div>
      )}

      {caruselDeschis && (
        <div className="galerie-fullscreen" onClick={() => setCaruselDeschis(false)}>
          <button 
            className="buton-inchidere-galerie" 
            onClick={(e) => { e.stopPropagation(); setCaruselDeschis(false); }}
          >
            ×
          </button>
          
          <button 
            className="sageata-galerie stanga" 
            onClick={(e) => navigaPoze(-1, e)}
          >
            ❮
          </button>
          
          <img 
            src={moduleJosPoze[indexModulJos].imagine} 
            alt={moduleJosPoze[indexModulJos].titlu} 
            className="galerie-imagine"
            onClick={(e) => e.stopPropagation()} 
          />
          
          <button 
            className="sageata-galerie dreapta" 
            onClick={(e) => navigaPoze(1, e)}
          >
            ❯
          </button>
        </div>
      )}
    </div>
  );
}