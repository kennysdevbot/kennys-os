import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Kanban } from './pages/Kanban';
import { Notes } from './pages/Notes';
import { Inbox } from './pages/Inbox';
import { useKeyboardNavigation } from './hooks';

function AppContent() {
  useKeyboardNavigation();

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/kanban" element={<Kanban />} />
      <Route path="/notes" element={<Notes />} />
      <Route path="/inbox" element={<Inbox />} />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Layout>
          <AppContent />
        </Layout>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
