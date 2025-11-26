import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import { useAuth } from './contexts/AuthContext';

function App() {
	const { user, isLoading } = useAuth();
	const location = useLocation();

	// Show loading only if we're actually loading and don't have a user yet
	// This prevents redirect loops when user is null but we're still initializing
	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen bg-background">
				<div className="text-text-muted">Carregando...</div>
			</div>
		);
	}

	// Only redirect if we're done loading and there's no user
	// This prevents redirects during initialization
	if (!isLoading && !user) {
		return <Navigate to="/login" replace state={{ from: location }} />;
	}

	// If still loading or no user, show loading (shouldn't reach here, but safety check)
	if (!user) {
		return (
			<div className="flex items-center justify-center h-screen bg-background">
				<div className="text-text-muted">Carregando...</div>
			</div>
		);
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
