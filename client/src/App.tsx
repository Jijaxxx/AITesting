import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ProfileSelect from './pages/ProfileSelect';
import CreateProfile from './pages/CreateProfile';
import WorldMap from './pages/WorldMap';
import Game from './pages/Game';
import ParentDashboard from './pages/ParentDashboard';

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-purple-50 to-secondary-50">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<ProfileSelect />} />
          <Route path="/create-profile" element={<CreateProfile />} />
          <Route path="/world/:profileId" element={<WorldMap />} />
          <Route path="/game/:world/:level" element={<Game />} />
          <Route path="/parent/:profileId" element={<ParentDashboard />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
