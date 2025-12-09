// src/components/configuracoes/TotemDevicesSection.tsx
import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  getTotemDevices, 
  createTotemDevice, 
  updateTotemDevice, 
  regenerateTotemDeviceCode, 
  deleteTotemDevice,
  type TotemDevice 
} from '../../lib/api/totem';
import { Loader2, Plus, RefreshCw, Trash2, Monitor, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { getUserFriendlyError, ERROR_MESSAGES } from '../../lib/errorMessages';

export const TotemDevicesSection = () => {
  const [devices, setDevices] = useState<TotemDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [newDeviceName, setNewDeviceName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [editingDeviceId, setEditingDeviceId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [visibleCodes, setVisibleCodes] = useState<Set<string>>(new Set());
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);

  // Load devices on mount
  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getTotemDevices();
      setDevices(data);
    } catch (err) {
      setError(getUserFriendlyError(err, ERROR_MESSAGES.LOAD_SETTINGS_FAILED));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newDeviceName.trim()) return;
    
    setIsCreating(true);
    setError(null);
    try {
      const device = await createTotemDevice(newDeviceName.trim());
      setDevices(prev => [...prev, device]);
      setNewDeviceName('');
      setShowAddForm(false);
    } catch (err) {
      setError(getUserFriendlyError(err, 'Erro ao criar dispositivo'));
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editingName.trim()) return;
    
    setIsUpdating(true);
    setError(null);
    try {
      const updated = await updateTotemDevice(id, { name: editingName.trim() });
      setDevices(prev => prev.map(d => d.id === id ? updated : d));
      setEditingDeviceId(null);
      setEditingName('');
    } catch (err) {
      setError(getUserFriendlyError(err, 'Erro ao atualizar dispositivo'));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleActive = async (device: TotemDevice) => {
    setError(null);
    try {
      const updated = await updateTotemDevice(device.id, { isActive: !device.isActive });
      setDevices(prev => prev.map(d => d.id === device.id ? updated : d));
    } catch (err) {
      setError(getUserFriendlyError(err, 'Erro ao atualizar dispositivo'));
    }
  };

  const handleRegenerateCode = async (id: string) => {
    setRegeneratingId(id);
    setError(null);
    try {
      const updated = await regenerateTotemDeviceCode(id);
      setDevices(prev => prev.map(d => d.id === id ? updated : d));
      // Show the new code
      setVisibleCodes(prev => new Set(prev).add(id));
    } catch (err) {
      setError(getUserFriendlyError(err, 'Erro ao regenerar código'));
    } finally {
      setRegeneratingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    setError(null);
    try {
      await deleteTotemDevice(id);
      setDevices(prev => prev.filter(d => d.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      setError(getUserFriendlyError(err, 'Erro ao excluir dispositivo'));
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleCodeVisibility = (id: string) => {
    setVisibleCodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const copyCode = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Nunca';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl shadow-elevated border border-border p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-2 text-text-muted">Carregando dispositivos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl shadow-elevated border border-border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            Dispositivos Totem
          </h3>
          <p className="text-sm text-text-muted mt-1">
            Gerencie os dispositivos totem de autoatendimento do salão. Cada dispositivo recebe um código de acesso único para autenticação.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setShowAddForm(true)}
          disabled={showAddForm}
        >
          <Plus className="w-4 h-4 mr-1" />
          Adicionar Totem
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {showAddForm && (
        <div className="p-4 bg-background border border-border rounded-lg space-y-3">
          <h4 className="text-sm font-medium text-text">Novo Dispositivo Totem</h4>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Nome do dispositivo (ex: Recepção Principal)"
              value={newDeviceName}
              onChange={(e) => setNewDeviceName(e.target.value)}
              className="flex-1"
            />
            <Button
              size="sm"
              onClick={handleCreate}
              disabled={isCreating || !newDeviceName.trim()}
            >
              {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Criar'}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setShowAddForm(false);
                setNewDeviceName('');
              }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {devices.length === 0 ? (
        <div className="text-center py-8 text-text-muted">
          <Monitor className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Nenhum dispositivo totem cadastrado.</p>
          <p className="text-sm mt-1">Clique em "Adicionar Totem" para criar um novo dispositivo.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {devices.map((device) => (
            <div
              key={device.id}
              className={`p-4 border rounded-lg transition-colors ${
                device.isActive 
                  ? 'bg-background border-border' 
                  : 'bg-background/50 border-border/50 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {editingDeviceId === device.id ? (
                    <div className="flex items-center gap-2 mb-2">
                      <Input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="max-w-xs"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleUpdate(device.id)}
                        disabled={isUpdating || !editingName.trim()}
                      >
                        {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar'}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingDeviceId(null);
                          setEditingName('');
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-text">{device.name}</h4>
                      <button
                        className="text-xs text-primary hover:underline"
                        onClick={() => {
                          setEditingDeviceId(device.id);
                          setEditingName(device.name);
                        }}
                      >
                        editar
                      </button>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        device.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {device.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-text-muted">Código:</span>
                      <code className="px-2 py-1 bg-sidebar rounded text-text font-mono">
                        {visibleCodes.has(device.id) ? device.accessCode : '••••••'}
                      </code>
                      <button
                        className="p-1 text-text-muted hover:text-text transition-colors"
                        onClick={() => toggleCodeVisibility(device.id)}
                        title={visibleCodes.has(device.id) ? 'Ocultar código' : 'Mostrar código'}
                      >
                        {visibleCodes.has(device.id) ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        className="p-1 text-text-muted hover:text-text transition-colors"
                        onClick={() => copyCode(device.accessCode, device.id)}
                        title="Copiar código"
                      >
                        {copiedCode === device.id ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-text-muted">
                    Último acesso: {formatDate(device.lastAccessAt)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRegenerateCode(device.id)}
                    disabled={regeneratingId === device.id}
                    title="Regenerar código de acesso"
                  >
                    {regeneratingId === device.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                  </Button>
                  
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={device.isActive}
                      onChange={() => handleToggleActive(device)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>

                  {deleteConfirm === device.id ? (
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(device.id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirmar'}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteConfirm(null)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDeleteConfirm(device.id)}
                      title="Excluir dispositivo"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TotemDevicesSection;
