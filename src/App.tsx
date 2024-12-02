import { Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Programmation from "./pages/Programmation"
import NationMap from "./pages/NationMap"

function App() {
  //Structurer l'application
  return (
    <>
      <Header />
        <Routes >
            <Route path="/" element={<Home />} />
            <Route path="/Programmation" element={<Programmation />}/>
            <Route path="/NationMap" element={<NationMap />}/>
        </Routes>
      <Footer />
    </>
  )
}

export default App