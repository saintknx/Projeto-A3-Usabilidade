import { BrowserRouter, Routes, Route } from "react-router-dom"
import MapPage     from "./pages/MapPage/MapPage";
import BiomaPage   from "./pages/BiomaPage/BiomaPage";
import PokemonPage from "./pages/PokemonPage/PokemonPage";

/**
 * Rotas:
 *   /                  → Mapa
 *   /bioma/:habitat    → Lista de Pokémons do estado
 *   /pokemon/:id       → Detalhes do Pokémon
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                element={<MapPage />}     />
        <Route path="/bioma/:habitat"  element={<BiomaPage />}   />
        <Route path="/pokemon/:id"     element={<PokemonPage />} />
      </Routes>
    </BrowserRouter>
  );
}