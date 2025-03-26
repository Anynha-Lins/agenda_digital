import { Routes, Route } from "react-router";
import Home from "./pages/home/Home";
import Navbar from "./components/nav/Navbar";
import Edit from "./pages/Edit/Edit";
import Create from "./pages/create/Create";
import Contact from "./pages/contact/Contact";
function App() {

  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/create" element={<Create />} />
        <Route path="/contact/:id" element={<Contact />} />
      </Routes>
    </>
  )
}

export default App
