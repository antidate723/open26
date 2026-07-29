import { motion } from "framer-motion";
import "../components_css/StartScreen.css"; 

function StartScreen({ onStart }) {
  return (
    <div className="start-container">
      <motion.h1
        className="start-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        CAMERA INTERZISĂ
      </motion.h1>

      <motion.p
        className="start-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <br />
        Bun venit! Aceasta este Camera Interzisa.
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
        ÎNCEPE
      </motion.button>
    </div>
  );
}

export default StartScreen;