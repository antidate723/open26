import { useState, useEffect } from "react";
import StartScreen from "./components/StartScreen";
//import DarkRoom from "./components/DarkRoom.jsx";
import "./App.css";

const STORAGE_KEY = "escapeRoomProgress";

function App() {
  const [started, setStarted] = useState(false);
  const [solved, setSolved] = useState([false, false, false]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setStarted(data.started);
      setSolved(data.solved);
    }
  }, []);

  useEffect(() => {
    const data = { started, solved };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [started, solved]);

  return (
    <>
      {!started ? (
        <StartScreen onStart={() => setStarted(true)} />
      ) : (
        <DarkRoom solved={solved} setSolved={setSolved} />
      )}
    </>
  );
}

export default App;