import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import { useAuth } from './contexts/AuthContext';

function App() {
	const { user } = useAuth();
	const location = useLocation();

	if (!user) {
		return <Navigate to="/login" replace state={{ from: location }} />;
	}

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
