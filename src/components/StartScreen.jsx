import { motion } from "framer-motion";

function StartScreen({ onStart }) {
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        backgroundColor: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#e8e6df",
        fontFamily: "sans-serif",
        textAlign: "center",
        padding: "0 20px",
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{
          fontSize: "4.5rem",
          fontWeight: "800",
          marginBottom: "1.5rem",
          letterSpacing: "2px",
          textShadow: "0 0 20px rgba(255,140,0,0.4)",
        }}
      >
        CAMERA INTERZISĂ
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{
          color: "#b0aea3",
          fontSize: "1.3rem",
          maxWidth: "600px",
          marginBottom: "2.5rem",
          lineHeight: "1.6",
        }}
      >
        <br />
        Bun venit! Aceasta este Camera Interzisa.
      </motion.p>

      <motion.button
        onClick={onStart}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        whileHover={{ scale: 1.05, borderColor: "#ff8c00" }}
        whileTap={{ scale: 0.95 }}
        style={{
          padding: "16px 48px",
          fontSize: "1.2rem",
          fontWeight: "600",
          backgroundColor: "transparent",
          border: "2px solid #9a988f",
          borderRadius: "8px",
          color: "#e8e6df",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        ÎNCEPE
      </motion.button>
    </div>
  );
}

export default StartScreen;