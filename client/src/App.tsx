import { Routes, Route } from 'react-router-dom';
import ProfileSelect from './pages/ProfileSelect';
import CreateProfile from './pages/CreateProfile';
import WorldMap from './pages/WorldMap';
import Game from './pages/Game';
import ParentDashboard from './pages/ParentDashboard';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-purple-50 to-secondary-50">
      <Routes>
        <Route path="/" element={<ProfileSelect />} />
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route path="/world/:profileId" element={<WorldMap />} />
        <Route path="/game/:world/:level" element={<Game />} />
        <Route path="/parent" element={<ParentDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
