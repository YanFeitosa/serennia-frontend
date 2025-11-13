import { Outlet } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';

function App() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default App;
