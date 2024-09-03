import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import { useNavigate } from 'react-router-dom';
import React from "react";
import Inicio from './components/pages/Inicio';
import RegistroUser from './components/pages/RegistroUser';
import IniciarSesion from './components/pages/IniciarSesion';
import GlobalProvider from "./context/GlobalContext";
import { ListsMascotas } from "./components/pages/ListsMascotas";
import FiltradosReporte from "./components/pages/FiltradosReporte";
import Graficas from "./components/pages/Grafica";
import Usuarios from "./components/pages/Usuarios";
import TabMascotas from "./components/pages/TabMascotas";
import TabNotificaciones from "./components/pages/TabNotificaciones";
import PerfilUsuario from "./components/pages/Perfil";
import Reportes from "./components/pages/Reportes";

function App() {
  const stored = localStorage.getItem('user');
  const user = stored && stored !== 'undefined' ? JSON.parse(stored) : null;

  return (
    <BrowserRouter>
      <GlobalProvider>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/iniciosesion" element={<IniciarSesion />} />
          <Route path="/registro" element={<RegistroUser />} />

          {user && user.rol === 'superusuario' && (
            <>
              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/mascotas" element={<TabMascotas />} />
              <Route path="/notificaciones" element={<TabNotificaciones />} />
              <Route path="/graficas" element={<Graficas />} />
              <Route path="/perfil" element={<PerfilUsuario />} />
              <Route path="/Filtrosreporte" element={<FiltradosReporte />} />
              <Route path="/reportes" element={<Reportes />} />
            </>
          )}
          {user && user.rol === 'administrador' && (
            <>
              <Route path="/mascotas" element={<TabMascotas />} />
              <Route path="/perfil" element={<PerfilUsuario />} />
              <Route path="/Filtrosreporte" element={<FiltradosReporte />} />
              <Route path="/reportes" element={<Reportes />} />
            </>
          )}
          {user && user.rol === 'usuario' && (
            <>
              <Route path="/listmascotas" element={<ListsMascotas />} />
              <Route path="/notificaciones" element={<TabNotificaciones />} />
              <Route path="/perfil" element={<PerfilUsuario />} />
              <Route path="/Filtrosreporte" element={<FiltradosReporte />} />
              <Route path="/reportes" element={<Reportes />} />
            </>
          )}
        </Routes>
      </GlobalProvider>
    </BrowserRouter>
  );
}

export default App;
