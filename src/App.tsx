import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { PokemonProvider } from './context/PokemonContext';
import Layout from './components/Layout';
import ListView from './pages/ListView';
import GalleryView from './pages/GalleryView';
import DetailView from './pages/DetailView';

export default function App() {
  return (
    <PokemonProvider>
      {/* basename = '/mp2/' in production so routes work on GitHub Pages */}
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/list" replace />} />
            <Route path="list" element={<ListView />} />
            <Route path="gallery" element={<GalleryView />} />
            <Route path="pokemon/:id" element={<DetailView />} />
            <Route path="*" element={<Navigate to="/list" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PokemonProvider>
  );
}
