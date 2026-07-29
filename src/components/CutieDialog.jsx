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
  // Indexul modulului/pozei selectate de pe jos (0 = Modul 4, 1 = Modul 5, etc.)
  const [indexModulJos, setIndexModulJos] = useState(0);

  const dialogCurent = dateDialoguri.dialoguri[dialogId];

  // Panourile fixe de sus
  const panouriSus = [
    { id: 'sus-centru', clasa: 'panou-sus-centru', text: 'Modul 1' },
    { id: 'stanga-sus', clasa: 'panou-stanga-sus', text: 'Modul 2' },
    { id: 'dreapta-sus', clasa: 'panou-dreapta-sus', text: 'Modul 3' },
  ];

  // Modulele/pozele de jos (era numit "moduleJos" dar folosit ca "moduleJosPoze" - de aici venea eroarea)
  const moduleJosPoze = [
    { id: 'm4', clasa: 'modul-stanga-jos', titlu: 'Modul 4', imagine: '/bun.jpeg' },
    { id: 'm5', clasa: 'modul-centru-jos-1', titlu: 'Modul 5', imagine: '/bun.jpeg' },
    { id: 'm6', clasa: 'modul-centru-jos-2', titlu: 'Modul 6', imagine: '/bun.jpeg' },
    { id: 'm7', clasa: 'modul-dreapta-jos', titlu: 'Modul 7', imagine: '/bun.jpeg' },
  ];

  // Schimbă poza selectată (Stânga / Dreapta)
  const navigaPoze = (directie, e) => {
    e.stopPropagation();
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
      setIndexLinie(prev => prev + 1);
    } else {
      setDialogTerminat(true); // Ascundem doar caseta de text!
      if (onDialogTerminat) onDialogTerminat();
    }
  };
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        actiuneTreciMaiDeparte();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTyping, indexLinie, dialogCurent, onDialogTerminat]);

  if (!dialogCurent) return null;

  const estePenultimulSauMaiDeparte = indexLinie >= dialogCurent.linii.length - 2;

  const SchimbaLumina = (e) => {
    e.stopPropagation();
    setNivelLumina(prev => (prev < 3 ? prev + 1 : 0));
  };

  const handlePanouClick = (e, panouId) => {
    e.stopPropagation();
    console.log(`Ai apăsat pe poza/modulul: ${panouId}`);
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
          <div className="panou-lateral panou-dreapta" />

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
              return (
                <div
                  key={modul.id}
                  className={`modul-poza-jos ${modul.clasa} ${esteSelectat ? 'poza-activa' : ''}`}
                  onClick={(e) => {
                    setIndexModulJos(idx);
                    handlePanouClick(e, modul.id);
                  }}
                >
                  <img
                    src={modul.imagine}
                    alt={modul.titlu}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="tag-modul-jos">{modul.titlu}</div>
                </div>
              );
            })}

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
          <div className="dialog-name">
            {dialogCurent.titlu}
          </div>

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
    </div>
  );
}