// src/contexts/TotemContext.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { TotemClient, TotemService, TotemCollaborator } from '../lib/api/totem';

interface TotemState {
  client: TotemClient | null;
  selectedServices: TotemService[];
  selectedCollaborator: TotemCollaborator | null;
  selectedDateTime: Date | null;
}

interface TotemContextType {
  state: TotemState;
  setClient: (client: TotemClient | null) => void;
  setSelectedServices: (services: TotemService[]) => void;
  addService: (service: TotemService) => void;
  removeService: (serviceId: string) => void;
  setSelectedCollaborator: (collaborator: TotemCollaborator | null) => void;
  setSelectedDateTime: (dateTime: Date | null) => void;
  clearState: () => void;
  getTotalDuration: () => number;
  getTotalPrice: () => number;
}

const TotemContext = createContext<TotemContextType | undefined>(undefined);

const STORAGE_KEY = 'serennia-totem-state';

const defaultState: TotemState = {
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
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setState({
          ...defaultState,
          ...parsed,
          // Converter selectedDateTime de string para Date se existir
          selectedDateTime: parsed.selectedDateTime
            ? new Date(parsed.selectedDateTime)
            : null,
        });
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
        ...state,
        // Converter selectedDateTime para string para armazenar
        selectedDateTime: state.selectedDateTime?.toISOString() ?? null,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch (error) {
      console.error('Error saving totem state to localStorage', error);
    }
  }, [state]);

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

  const clearState = () => {
    setState(defaultState);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  const getTotalDuration = () => {
    return state.selectedServices.reduce((sum, service) => sum + service.duration, 0);
  };

  const getTotalPrice = () => {
    return state.selectedServices.reduce((sum, service) => sum + service.price, 0);
  };

  return (
    <TotemContext.Provider
      value={{
        state,
        setClient,
        setSelectedServices,
        addService,
        removeService,
        setSelectedCollaborator,
        setSelectedDateTime,
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

