import { Navigate, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ClubsPage } from './pages/ClubsPage';
import { RoundPage } from './pages/RoundPage';
import { SummaryPage } from './pages/SummaryPage';
import { AppLayout } from './components/AppLayout';

const App = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/clubs" element={<ClubsPage />} />
        <Route path="/round/:roundId" element={<RoundPage />} />
        <Route path="/summary/:roundId" element={<SummaryPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
};

export default App;
