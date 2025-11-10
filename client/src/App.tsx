import { Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import ProfileSelect from './pages/ProfileSelect';
import CreateProfile from './pages/CreateProfile';
import WorldMap from './pages/WorldMap';
import Game from './pages/Game';
import ParentDashboard from './pages/ParentDashboard';

// Reading Games - lazy loaded
const ReadingGamesHome = lazy(() => import('./features/reading-games/ui/ReadingGamesHome'));
const GameLoader = lazy(() => import('./features/reading-games/ui/GameLoader'));
const ProgressPage = lazy(() => import('./features/reading-games/ui/ProgressPage'));

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
          
          {/* Reading Games - lazy loaded */}
          <Route 
            path="/reading-games" 
            element={
              <Suspense fallback={<LoadingScreen />}>
                <ReadingGamesHome />
              </Suspense>
            } 
          />
          <Route 
            path="/reading-games/:slug" 
            element={
              <Suspense fallback={<LoadingScreen />}>
                <GameLoader />
              </Suspense>
            } 
          />
          <Route 
            path="/reading-games/progress" 
            element={
              <Suspense fallback={<LoadingScreen />}>
                <ProgressPage />
              </Suspense>
            } 
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

/**
 * Écran de chargement simple pour le lazy loading
 */
function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-child-xl font-bold text-indigo-600">
        Chargement...
      </div>
    </div>
  );
}

export default App;
