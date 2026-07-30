import { useState, useEffect, useRef } from 'react';
import dateDialoguri from '../texte/dialoguri.json';
import '../components_css/MathPuzzleModal.css';

export default function MusicPuzzleModal({ onClose, onSolved }) {
    const [mode, setMode] = useState('dialog');

    const audioMainRef = useRef(null);
    const audioMinigameRef = useRef(null);
    const [isPlayingMain, setIsPlayingMain] = useState(false);
    const [isPlayingMini, setIsPlayingMini] = useState(false);

    const secventaCorecta = [0, 2, 1, 3];
    const [secventaUser, setSecventaUser] = useState([]);
    const [stareMinigame, setStareMinigame] = useState('asteptare');

    const clape = [
        { id: 0, culoare: '#e74c3c', nume: 'Clapa 1 (Low)' },
        { id: 1, culoare: '#3498db', nume: 'Clapa 2 (Mid-Low)' },
        { id: 2, culoare: '#f1c40f', nume: 'Clapa 3 (Mid-High)' },
        { id: 3, culoare: '#2ecc71', nume: 'Clapa 4 (High)' },
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
        audioMainRef.current = new Audio('/audioptmain.mpeg');
        audioMainRef.current.loop = true;

        audioMinigameRef.current = new Audio('/audioptminigame.mpeg');
        audioMinigameRef.current.loop = true;

        return () => {
            if (audioMainRef.current) {
                audioMainRef.current.pause();
                audioMainRef.current = null;
            }
            if (audioMinigameRef.current) {
                audioMinigameRef.current.pause();
                audioMinigameRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (mode === 'dialog') {
            if (audioMainRef.current) {
                audioMainRef.current.play().then(() => setIsPlayingMain(true)).catch(() => setIsPlayingMain(false));
            }
            if (audioMinigameRef.current) {
                audioMinigameRef.current.pause();
                setIsPlayingMini(false);
            }
        } else {
            if (audioMainRef.current) {
                audioMainRef.current.pause();
                setIsPlayingMain(false);
            }
        }
    }, [mode]);

    const toggleAudioMain = () => {
        if (!audioMainRef.current) return;
        if (isPlayingMain) {
            audioMainRef.current.pause();
            setIsPlayingMain(false);
        } else {
            audioMainRef.current.play().then(() => setIsPlayingMain(true)).catch(() => { });
        }
    };

    const toggleAudioMini = () => {
        if (!audioMinigameRef.current) return;
        if (isPlayingMini) {
            audioMinigameRef.current.pause();
            setIsPlayingMini(false);
        } else {
            audioMinigameRef.current.play().then(() => setIsPlayingMini(true)).catch(() => { });
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

    const apasaClapa = (idClapa) => {
        if (stareMinigame === 'corect') return;

        const nouaSecventa = [...secventaUser, idClapa];
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
            if (audioMinigameRef.current) {
                audioMinigameRef.current.pause();
            }
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
                    <div className="dialog-name" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{dialogData.titlu}</span>
                        <button
                            onClick={(e) => { e.stopPropagation(); toggleAudioMain(); }}
                            style={{ background: 'transparent', border: '1px solid #fff', color: '#fff', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                        >
                            {isPlayingMain ? '🔊 Sunet: Pornit' : '🔇 Sunet: Oprit'}
                        </button>
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
                <div className="math-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px', textAlign: 'center' }}>
                    <button className="math-close-btn" onClick={onClose}>×</button>
                    <h2 className="math-title">Calibrare Frecvență Audio</h2>
                    <p className="math-subtitle" style={{ fontSize: '13px', color: '#ccc' }}>
                        Ascultă ritmul și apasă clapele în ordinea corectă (4 pași).
                    </p>

                    <div style={{ margin: '15px 0' }}>
                        <button
                            onClick={toggleAudioMini}
                            style={{ padding: '6px 14px', background: isPlayingMini ? '#e74c3c' : '#2ecc71', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                        >
                            {isPlayingMini ? '⏸️ Oprește Beat-ul de Fundal' : '▶️ Ascultă Beat-ul (Audio Mini)'}
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', margin: '20px 0' }}>
                        {clape.map((clapa) => (
                            <button
                                key={clapa.id}
                                onClick={() => apasaClapa(clapa.id)}
                                style={{
                                    padding: '25px 10px',// 'asteptare', 'gresit', 'corect'
                                    background: clapa.culoare,
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    fontSize: '15px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                                    transition: 'transform 0.1s, filter 0.1s',
                                }}
                                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                {clapa.nume}
                            </button>
                        ))}
                    </div>

                    <div style={{ minHeight: '30px', marginTop: '10px' }}>
                        {stareMinigame === 'gresit' && <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>Secvență greșită! Se resetează... ❌</span>}
                        {stareMinigame === 'corect' && <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>Frecvență sincronizată cu succes! ✅</span>}
                        {stareMinigame === 'asteptare' && (
                            <span style={{ color: '#aaa', fontSize: '13px' }}>
                                Progres clape: {secventaUser.length} / {secventaCorecta.length}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}