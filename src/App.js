import Home from './componentes/Home';
import Livros from './componentes/Livros';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Livraria da Lili #13</h1>
      <BrowserRouter>
        <Nav variant="tabs" className="links">
          <Nav.Link as={Link} to="/">Página Inicial</Nav.Link>
          <Nav.Link as={Link} to="/livros">Livros</Nav.Link>
        </Nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/livros" element={<Livros />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

