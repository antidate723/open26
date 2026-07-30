import { useState, useEffect } from 'react';
import { Book, Save } from 'lucide-react';
import '../components_css/CarnetNotite.css';

export default function CarnetNotite() {
  const [notite, setNotite] = useState(() => {
    return localStorage.getItem('infoMotion_carnetNotite') || '';
  });

  const [esteDeschis, setEsteDeschis] = useState(false);

  useEffect(() => {
    localStorage.setItem('infoMotion_carnetNotite', notite);
  }, [notite]);

  return (
    <div className={`container-jurnal-explorator ${esteDeschis ? 'deschis' : 'inchis'}`}>
      <button 
        className="sageata-toggle-jurnal" 
        onClick={() => setEsteDeschis(!esteDeschis)}
        title={esteDeschis ? "Închide carnetul" : "Deschide jurnalul de explorator"}
      >
        {esteDeschis ? '▶' : <Book size={18} />}
      </button>

      <div className="jurnal-continut">
        <div className="jurnal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Book size={20} /> Jurnal de Explorator
          </h3>
          <span className="jurnal-subtitlu">Notițe & Indicii</span>
        </div>

        <textarea
          className="jurnal-textarea"
          value={notite}
          onChange={(e) => setNotite(e.target.value)}
          placeholder="Notează aici calculele, șirurile matematice sau indiciile..."
        />

        <div className="jurnal-footer">
          <span className="jurnal-status" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Save size={14} /> Salvat local
          </span>
          <button 
            className="jurnal-btn-sterge" 
            onClick={() => setNotite('')}
          >
            Șterge tot
          </button>
        </div>
      </div>
    </div>
  );
}