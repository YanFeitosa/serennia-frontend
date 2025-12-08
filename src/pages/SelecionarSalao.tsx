import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, UserCheck, Search, LogOut } from 'lucide-react';
import { getSalons, selectSalon, type Salon } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Badge } from '../components/ui/Badge';
import { getUserFriendlyError, ERROR_MESSAGES } from '../lib/errorMessages';

const SelecionarSalao = () => {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSelecting, setIsSelecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();

  useEffect(() => {
    const loadSalons = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getSalons();
        setSalons(data);
      } catch (err: any) {
        console.error('Failed to load salons', err);
        setError(getUserFriendlyError(err, ERROR_MESSAGES.LOAD_SALONS_FAILED));
      } finally {
        setIsLoading(false);
      }
    };

    loadSalons();
  }, []);

  const handleSelectSalon = async (salon: Salon) => {
    try {
      setIsSelecting(true);
      setError(null);

      // Call API to update super_admin's salonId in database
      await selectSalon(salon.id);

      // Update appearance
      window.localStorage.setItem('serennia-appearance', JSON.stringify({
        platformName: salon.name
      }));
      window.dispatchEvent(new Event('serennia-appearance-changed'));

      // Refresh user data to get updated salonId
      await refreshUser();

      // Navigate to the app
      navigate('/app/agenda', { replace: true });
    } catch (err: any) {
      console.error('Failed to select salon', err);
      setError(getUserFriendlyError(err, ERROR_MESSAGES.SELECT_SALON_FAILED));
    } finally {
      setIsSelecting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const filteredSalons = salons.filter(salon =>
    salon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    salon.document?.includes(searchTerm)
  );

  const getStatusBadge = (status: Salon['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Ativo</Badge>;
      case 'pending':
        return <Badge variant="warning">Pendente</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspenso</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="landing-theme min-h-screen bg-[#0a0a0f] overflow-hidden relative">
      {/* Animated gradient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] animate-pulse"
          style={{ background: 'rgba(124, 58, 237, 0.2)' }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] animate-pulse"
          style={{ background: 'rgba(59, 130, 246, 0.2)', animationDelay: '1s' }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[80px] animate-pulse"
          style={{ background: 'rgba(236, 72, 153, 0.1)', animationDelay: '2s' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Serennia
            </h1>
            <p className="text-gray-400 mt-1">Olá, {user?.name || 'Super Admin'}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>

        {/* Main card */}
        <div 
          className="p-6 md:p-8 rounded-2xl border border-white/10 backdrop-blur-xl"
          style={{ background: 'rgba(255, 255, 255, 0.05)' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="w-8 h-8 text-purple-400" />
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-white">Selecionar Salão</h2>
              <p className="text-gray-400 text-sm">Escolha um salão para gerenciar</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por nome ou CNPJ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 mb-6 bg-pink-500/10 border border-pink-500/20 rounded-xl text-pink-400">
              {error}
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-gray-400">
                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Carregando salões...</span>
              </div>
            </div>
          )}

          {/* Salons list */}
          {!isLoading && !error && (
            <div className="space-y-3">
              {filteredSalons.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  {searchTerm ? 'Nenhum salão encontrado com esse termo.' : 'Nenhum salão cadastrado.'}
                </div>
              ) : (
                filteredSalons.map((salon) => (
                  <button
                    key={salon.id}
                    onClick={() => handleSelectSalon(salon)}
                    disabled={isSelecting}
                    className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 rounded-xl text-left transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors truncate">
                            {salon.name}
                          </h3>
                          {getStatusBadge(salon.status)}
                        </div>
                        {salon.document && (
                          <p className="text-sm text-gray-500 mb-2">CNPJ: {salon.document}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {salon.clientsCount} clientes
                          </span>
                          <span className="flex items-center gap-1">
                            <UserCheck className="w-4 h-4" />
                            {salon.collaboratorsCount} colaboradores
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="text-purple-400 group-hover:text-purple-300 transition-colors">
                          Entrar →
                        </span>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {/* Footer info */}
          {!isLoading && filteredSalons.length > 0 && (
            <p className="mt-6 text-center text-sm text-gray-500">
              {filteredSalons.length} {filteredSalons.length === 1 ? 'salão encontrado' : 'salões encontrados'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelecionarSalao;
