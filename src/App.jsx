import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home'
import Citas from './pages/citas';



function App() {


  return (
    <Router>

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/citas" element={<Citas />} />
    </Routes>
    </Router>

  )
}

export default App
