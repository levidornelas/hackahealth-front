import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import EvolucaoPacienteX from './App';
import EvolucaoPacienteY from './paciente-y';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<EvolucaoPacienteY />} />
    </Routes>
  </BrowserRouter>
);
