import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import HeroPage from './pages/HeroPage.jsx';
import AnimationPage from './pages/AnimationPage.jsx';
import CharacterPage from './pages/CharacterPage.jsx';
import TemplatePage from './pages/TemplatePage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/hero" element={<HeroPage />} />
      <Route path="/animation" element={<AnimationPage />} />
      <Route path="/character" element={<CharacterPage />} />
      <Route path="/templates/:slug" element={<TemplatePage />} />
    </Routes>
  );
}
