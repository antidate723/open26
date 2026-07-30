import { motion } from "framer-motion";
import "../components_css/StartScreen.css"; 

function StartScreen({ onStart }) {
  return (
    <div className="start-container">
      <img src="/logo.svg" alt="logo" width={700}/>

      <motion.p
        className="start-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <br />
        Trapped in the dark, you must use your knowledge to solve the room's puzzles, restore the power, and unlock your escape.
      </motion.p>

      <motion.button
        className="start-button"
        onClick={onStart}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        START
      </motion.button>
    </div>
  );
}

export default StartScreen;