import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import { useAuth } from './contexts/AuthContext';
import { Menu } from 'lucide-react';

function App() {
	const { user, isLoading } = useAuth();
	const location = useLocation();
	const [sidebarOpen, setSidebarOpen] = useState(false);

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
		<div className="flex h-screen bg-background overflow-hidden">
			{/* Mobile sidebar overlay */}
			{sidebarOpen && (
				<div 
					className="fixed inset-0 bg-black/50 z-40 lg:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}
			
			{/* Sidebar - hidden on mobile, shown on lg screens */}
			<div className={`
				fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
				${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
			`}>
				<Sidebar onClose={() => setSidebarOpen(false)} />
			</div>
			
			{/* Main content */}
			<main className="flex-1 overflow-y-auto min-w-0">
				{/* Mobile header with menu button */}
				<div className="sticky top-0 z-30 bg-background border-b border-border p-4 lg:hidden">
					<button
						onClick={() => setSidebarOpen(true)}
						className="p-2 rounded-lg hover:bg-card transition-colors"
						aria-label="Abrir menu"
					>
						<Menu className="w-6 h-6 text-text" />
					</button>
				</div>
				
				<div className="p-4 md:p-6 lg:p-8">
					<Outlet />
				</div>
			</main>
		</div>
	);
}

export default App;
