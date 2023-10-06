import { Routes, Route } from "react-router-dom";
import "./App.css";

import Decrypt from "./components/Decrypt";
import Encrypt from "./components/Encrypt";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Encrypt />} />
        <Route path="/decrypt" element={<Decrypt />} />
        <Route path="/*" element={<Encrypt />} />
      </Routes>
    </div>
  );
}

export default App;
