import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Kanban } from './pages/Kanban';
import { Notes } from './pages/Notes';
import { Inbox } from './pages/Inbox';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/kanban" element={<Kanban />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/inbox" element={<Inbox />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
