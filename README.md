
# 🧩 Blackout Room - Open26 

Un joc interactiv de tip "Escape Room" / "Puzzle Adventure" dezvoltat cu **React** și **Vite**. Jucătorul trebuie să rezolve o serie de puzzle-uri tematice (matematică, chimie, muzică) pentru a avansa și a descoperi secretele ascunse într-o cameră întunecată.

## 🚀 Tehnologii Folosite

- **Framework:** [React](https://reactjs.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Stilizare:** CSS Modules / Fisiere CSS clasice per componentă
- **Date & Dialoguri:** JSON (`dialoguri.json`)

## 🎮 Cum se joacă (Structura Proiectului)

Aplicația este formată din mai multe componente și mini-jocuri, organizate în folderul `src`:

- **Componente Principale:**
  - `App.jsx` - Punctul de intrare care gestionează logica principală și starea jocului.
  - `StartScreen.jsx` - Ecranul de start al jocului.
  - `DarkRoom.jsx` - Componenta care gestionează interfața camerei principale (Camera Întunecată).
  - `CutieDialog.jsx` - Un sistem avansat de dialoguri care citește din `dialoguri.json`.
  - `CarnetNotite.jsx` - Un "inventar" sau jurnal unde se salvează indiciile găsite pe parcurs.

- **Puzzle-uri (Modale):**
  - `MathPuzzleModal.jsx` - Un puzzle bazat pe logică și matematică.
  - `ChemistryPuzzleModal.jsx` - Un mini-joc unde trebuie să combini elemente chimice.
  - `MusicPuzzleModal.jsx` - Un puzzle bazat pe recunoașterea și reproducerea notelor muzicale.
  - `MasinaScrisModal.jsx` - Un puzzle de tip decodare / scriere la o mașină de scris veche.

- **Assets:** Imagini de fundal și UI (ex: `hero.jpg`, `sageata.jpg`).

## 🛠️ Instalare și Rulare Locală

Pentru a rula proiectul pe calculatorul tău, urmează acești pași:

1. **Clonează repository-ul:**
   ```bash
   git clone https://github.com/antidate723/open26.git
   ```

2. **Navighează în folderul proiectului:**
   ```bash
   cd open26
   ```

3. **Instalează dependențele:**
   ```bash
   npm install
   ```
   *(Dacă folosești yarn sau pnpm, folosește `yarn install` sau `pnpm install`)*

4. **Pornește serverul de dezvoltare:**
   ```bash
   npm run dev
   ```

5. Deschide `http://localhost:5173` în browser pentru a juca.

## 📦 Build pentru Producție

Pentru a genera o versiune optimizată pentru deployment (ex: pe Vercel, Netlify, sau GitHub Pages):

```bash
npm run build
```
Fisierele vor fi generate în folderul `dist/`.


<img width="1917" height="1048" alt="Screenshot 2026-07-30 170119" src="https://github.com/user-attachments/assets/886d2fa2-e009-47bb-9e4a-03aac92a04f9" />
<img width="1917" height="1052" alt="Screenshot 2026-07-30 170050" src="https://github.com/user-attachments/assets/0b3cb3ca-3812-469c-b6c7-0cdf73c053a5" />

## 👤 Autori
**antidate723**
- GitHub: [@antidate723](https://github.com/antidate723)

**11AS28**
- GitHub: [@11AS28](https://github.com/11AS28)
