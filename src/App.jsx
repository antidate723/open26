import { useState, useEffect, useRef } from 'react';
import StartScreen from './components/StartScreen';
import CameraPrincipala from './components/DarkRoom';

function App() {
  const [ecranCurent, setEcranCurent] = useState('start');
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio('/audioptminigame.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = volume;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleStart = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
    setEcranCurent('joc');
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const handleVolumeChange = (e) => {
    setVolume(Number(e.target.value));
  };

  return (
    <div style={{ width: '100%', height: '100vh', margin: 0, padding: 0, position: 'relative' }}>
      {ecranCurent === 'start' && <StartScreen onStart={handleStart} />}
      {ecranCurent === 'joc' && <CameraPrincipala />}

      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(255, 255, 255, 0.08)',
          padding: '8px 12px',
          borderRadius: '12px',
          color: 'white',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.12)'
        }}
      >
        <button
          onClick={toggleMute}
          style={{
            background: 'transparent',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.25)',
            padding: '6px 10px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          {isMuted ? 'Unmute' : 'Mute'}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          style={{
            cursor: 'pointer',
            accentColor: 'white',
            background: 'transparent'
          }}
        />
      </div>
    </div>
  );
}

export default App;