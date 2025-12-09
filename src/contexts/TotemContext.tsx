// src/contexts/TotemContext.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { TotemClient, TotemService, TotemCollaborator, TotemDeviceLoginResponse } from '../lib/api/totem';

interface TotemSalonInfo {
  salonId: string;
  salonName: string;
  salonTheme: Record<string, unknown> | null;
  deviceId: string;
  deviceName: string;
}

interface TotemState {
  salonInfo: TotemSalonInfo | null;
  client: TotemClient | null;
  selectedServices: TotemService[];
  selectedCollaborator: TotemCollaborator | null;
  selectedDateTime: Date | null;
}

interface TotemContextType {
  state: TotemState;
  isAuthenticated: boolean;
  isDeviceAuthenticated: boolean;
  salonId: string | null;
  salonName: string | null;
  setSalonInfo: (info: TotemSalonInfo | null) => void;
  loginDevice: (response: TotemDeviceLoginResponse) => void;
  logoutDevice: () => void;
  setClient: (client: TotemClient | null) => void;
  setSelectedServices: (services: TotemService[]) => void;
  addService: (service: TotemService) => void;
  removeService: (serviceId: string) => void;
  setSelectedCollaborator: (collaborator: TotemCollaborator | null) => void;
  setSelectedDateTime: (dateTime: Date | null) => void;
  clearClientState: () => void;
  clearState: () => void;
  getTotalDuration: () => number;
  getTotalPrice: () => number;
}

const TotemContext = createContext<TotemContextType | undefined>(undefined);

const STORAGE_KEY = 'serennia-totem-state';
const DEVICE_STORAGE_KEY = 'serennia-totem-device';

const defaultState: TotemState = {
  salonInfo: null,
  client: null,
  selectedServices: [],
  selectedCollaborator: null,
  selectedDateTime: null,
};

export const TotemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<TotemState>(defaultState);

  // Carregar estado do localStorage ao montar
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      // Load device info separately (persistent)
      const deviceStored = window.localStorage.getItem(DEVICE_STORAGE_KEY);
      if (deviceStored) {
        const deviceInfo = JSON.parse(deviceStored) as TotemSalonInfo;
        setState(prev => ({ ...prev, salonInfo: deviceInfo }));
      }

      // Load client state (session)
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Converter selectedDateTime de string para Date se existir e for válida
        let parsedDate: Date | null = null;
        if (parsed.selectedDateTime) {
          const dateAttempt = new Date(parsed.selectedDateTime);
          if (!isNaN(dateAttempt.getTime())) {
            parsedDate = dateAttempt;
          }
        }
        setState(prev => ({
          ...prev,
          client: parsed.client ?? null,
          selectedServices: parsed.selectedServices ?? [],
          selectedCollaborator: parsed.selectedCollaborator ?? null,
          selectedDateTime: parsedDate,
        }));
      }
    } catch (error) {
      console.error('Error loading totem state from localStorage', error);
    }
  }, []);

  // Salvar estado no localStorage sempre que mudar
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const toStore = {
        client: state.client,
        selectedServices: state.selectedServices,
        selectedCollaborator: state.selectedCollaborator,
        selectedDateTime: state.selectedDateTime?.toISOString() ?? null,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch (error) {
      console.error('Error saving totem state to localStorage', error);
    }
  }, [state.client, state.selectedServices, state.selectedCollaborator, state.selectedDateTime]);

  const setSalonInfo = (info: TotemSalonInfo | null) => {
    setState(prev => ({ ...prev, salonInfo: info }));
    if (typeof window !== 'undefined') {
      if (info) {
        window.localStorage.setItem(DEVICE_STORAGE_KEY, JSON.stringify(info));
      } else {
        window.localStorage.removeItem(DEVICE_STORAGE_KEY);
      }
    }
  };

  const loginDevice = (response: TotemDeviceLoginResponse) => {
    const info: TotemSalonInfo = {
      salonId: response.salonId,
      salonName: response.salonName,
      salonTheme: response.salonTheme,
      deviceId: response.deviceId,
      deviceName: response.deviceName,
    };
    setSalonInfo(info);
  };

  const logoutDevice = () => {
    setSalonInfo(null);
    clearState();
  };

  const setClient = (client: TotemClient | null) => {
    setState((prev) => ({ ...prev, client }));
  };

  const setSelectedServices = (services: TotemService[]) => {
    setState((prev) => ({ ...prev, selectedServices: services }));
  };

  const addService = (service: TotemService) => {
    setState((prev) => {
      // Evitar duplicatas
      if (prev.selectedServices.some((s) => s.id === service.id)) {
        return prev;
      }
      return {
        ...prev,
        selectedServices: [...prev.selectedServices, service],
      };
    });
  };

  const removeService = (serviceId: string) => {
    setState((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.filter((s) => s.id !== serviceId),
    }));
  };

  const setSelectedCollaborator = (collaborator: TotemCollaborator | null) => {
    setState((prev) => ({ ...prev, selectedCollaborator: collaborator }));
  };

  const setSelectedDateTime = (dateTime: Date | null) => {
    setState((prev) => ({ ...prev, selectedDateTime: dateTime }));
  };

  const clearClientState = () => {
    setState(prev => ({
      ...prev,
      client: null,
      selectedServices: [],
      selectedCollaborator: null,
      selectedDateTime: null,
    }));
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  const clearState = () => {
    setState(defaultState);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(DEVICE_STORAGE_KEY);
    }
  };

  const getTotalDuration = () => {
    return state.selectedServices.reduce((sum, service) => sum + service.duration, 0);
  };

  const getTotalPrice = () => {
    return state.selectedServices.reduce((sum, service) => sum + service.price, 0);
  };

  const isDeviceAuthenticated = !!state.salonInfo;
  const salonId = state.salonInfo?.salonId ?? null;
  const salonName = state.salonInfo?.salonName ?? null;

  return (
    <TotemContext.Provider
      value={{
        state,
        isAuthenticated: !!state.salonInfo,
        isDeviceAuthenticated,
        salonId,
        salonName,
        setSalonInfo,
        loginDevice,
        logoutDevice,
        setClient,
        setSelectedServices,
        addService,
        removeService,
        setSelectedCollaborator,
        setSelectedDateTime,
        clearClientState,
        clearState,
        getTotalDuration,
        getTotalPrice,
      }}
    >
      {children}
    </TotemContext.Provider>
  );
};

export const useTotem = () => {
  const context = useContext(TotemContext);
  if (context === undefined) {
    throw new Error('useTotem must be used within a TotemProvider');
  }
  return context;
};

