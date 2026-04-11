import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QuestProvider } from './context/QuestContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './pages/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HouseSelectionPage from './pages/HouseSelectionPage.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
import QuestsPage from './pages/QuestsPage.tsx';
import SpellsPage from './pages/SpellsPage.tsx';
import LeaderboardPage from './pages/LeaderboardPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <QuestProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="houses" element={<HouseSelectionPage />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="quests" element={<QuestsPage />} />
                <Route path="spells" element={<SpellsPage />} />
                <Route path="leaderboard" element={<LeaderboardPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>
            </Route>
          </Routes>
        </QuestProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
