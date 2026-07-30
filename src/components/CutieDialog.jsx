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
  const [caruselDeschis, setCaruselDeschis] = useState(false);
  const [indexCarusel, setIndexCarusel] = useState(0);

  const dialogCurent = dateDialoguri.dialoguri[dialogId];

  const panouriSus = [
    { id: 'sus-centru', clasa: 'panou-sus-centru', text: 'Modul 1' },
    { id: 'stanga-sus', clasa: 'panou-stanga-sus', text: 'Modul 2' },
    { id: 'dreapta-sus', clasa: 'panou-dreapta-sus', text: 'Modul 3' },
  ];

  // Imaginile din carusel
  const imaginiCarusel = [
    { id: 'img1', titlu: 'Imaginea 1', src: '/bun.jpeg', descriere: 'Descriere prima imagine' },
    { id: 'img2', titlu: 'Imaginea 2', src: '/bun.jpeg', descriere: 'Descriere a doua imagine' },
    { id: 'img3', titlu: 'Imaginea 3', src: 'masabtn.png', descriere: 'Descriere a treia imagine' },
  ];

  const navigareCarusel = (directie, e) => {
    if (e) e.stopPropagation();
    setIndexCarusel((prev) => {
      let urmatorul = prev + directie;
      if (urmatorul >= imaginiCarusel.length) return 0;
      if (urmatorul < 0) return imaginiCarusel.length - 1;
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
      if (caruselDeschis) {
        if (e.key === 'ArrowLeft') navigareCarusel(-1);
        if (e.key === 'ArrowRight') navigareCarusel(1);
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

  if (!dialogCurent) return null;

  const estePenultimulSauMaiDeparte = indexLinie >= dialogCurent.linii.length - 2;

  const SchimbaLumina = (e) => {
    e.stopPropagation();
    setNivelLumina((prev) => (prev < 3 ? prev + 1 : 0));
  };

  const handlePanouClick = (e, panouId) => {
    e.stopPropagation();
    console.log(`Ai apăsat pe modulul: ${panouId}`);
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

            {/* Singurul modul din dreapta jos */}
            <div
              className="modul-poza-jos modul-dreapta-jos"
              onClick={(e) => {
                e.stopPropagation();
                setCaruselDeschis(true);
              }}
            >
              <img src="/bun.jpeg" alt="Galerie Imagini" />
              <div className="tag-modul-jos">Galerie</div>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL CARUSEL */}
      {caruselDeschis && (
        <div className="modal-carusel-overlay" onClick={() => setCaruselDeschis(false)}>
          <div className="modal-carusel-content" onClick={(e) => e.stopPropagation()}>
            <button className="inchide-modal" onClick={() => setCaruselDeschis(false)}>
              ✕
            </button>

            <div className="carusel-view">
              <button className="sageata-carusel prev" onClick={(e) => navigareCarusel(-1, e)}>
                ❮
              </button>

              <div className="carusel-slide-container fade">
                <img
                  src={imaginiCarusel[indexCarusel].src}
                  alt={imaginiCarusel[indexCarusel].titlu}
                  className="carusel-imagine"
                />
                <div className="carusel-detalii">
                  <h3>{imaginiCarusel[indexCarusel].titlu}</h3>
                  <p>{imaginiCarusel[indexCarusel].descriere}</p>
                </div>
              </div>

              <button className="sageata-carusel next" onClick={(e) => navigareCarusel(1, e)}>
                ❯
              </button>
            </div>

            <div className="dots-container">
              {imaginiCarusel.map((_, i) => (
                <span
                  key={i}
                  className={`dot ${i === indexCarusel ? 'active' : ''}`}
                  onClick={() => setIndexCarusel(i)}
                />
              ))}
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
    </div>
  );
}