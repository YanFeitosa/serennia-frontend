import { supabase } from './supabase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Validate API_BASE_URL on module load
if (!API_BASE_URL && typeof window !== 'undefined') {
  console.error(
    '⚠️ VITE_API_BASE_URL is not set. API requests will fail. ' +
    'Please configure your .env file with VITE_API_BASE_URL.'
  );
}

async function getAuthToken(): Promise<string | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  } catch {
    return null;
  }
}

const REQUEST_TIMEOUT = 30000; // 30 seconds

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!API_BASE_URL) {
    const errorMsg = 'API_BASE_URL não configurado. Por favor, configure VITE_API_BASE_URL no arquivo .env com a URL do backend (ex: http://localhost:4000)';
    console.error('❌', errorMsg);
    throw new Error(errorMsg);
  }

  // Validate that API_BASE_URL is not pointing to Supabase
  if (API_BASE_URL.includes('supabase.co') && !API_BASE_URL.includes('functions.supabase.co')) {
    const errorMsg = `❌ ERRO: VITE_API_BASE_URL está apontando para o Supabase (${API_BASE_URL}). 
    
Configure VITE_API_BASE_URL com a URL do seu BACKEND (ex: http://localhost:4000).
O Supabase é usado apenas para autenticação (VITE_SUPABASE_URL), não para as rotas da API.`;
    console.error(errorMsg);
    throw new Error('VITE_API_BASE_URL está configurado incorretamente. Deve apontar para o backend, não para o Supabase.');
  }

  const url = `${API_BASE_URL}${path}`;
  console.log('🌐 Making request:', { method: options.method || 'GET', url, path });

  const token = await getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Add salon context header if available (for Super Admin context switching)
  const salonId = window.localStorage.getItem('serennia-salon-id');
  if (salonId) {
    headers['x-salon-id'] = salonId;
  }

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log('📡 Response received:', { status: response.status, statusText: response.statusText, url });

    const text = await response.text();
    let data: unknown = undefined;

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    if (!response.ok) {
      let message = 'Erro desconhecido';

      if (response.status === 401) {
        message = 'Sessão expirada. Por favor, faça login novamente.';
        if (typeof window !== 'undefined') {
          // Only redirect if we're not on a public route
          const publicRoutes = ['/', '/login', '/totem'];
          const currentPath = window.location.pathname;
          const isPublicRoute = publicRoutes.some(route =>
            currentPath === route || currentPath.startsWith(route + '/')
          );

          if (!isPublicRoute) {
            await supabase.auth.signOut();
            window.location.href = '/login';
          }
        }
      } else if (response.status === 403) {
        message = 'Você não tem permissão para realizar esta ação.';
      } else if (response.status === 404) {
        message = 'Recurso não encontrado.';
      } else if (response.status === 429) {
        // Rate limit exceeded
        if (
          typeof data === 'object' &&
          data !== null &&
          'error' in data &&
          typeof (data as any).error === 'string'
        ) {
          message = (data as any).error;
        } else {
          message = 'Muitas requisições. Por favor, aguarde alguns instantes e tente novamente.';
        }
      } else if (response.status >= 500) {
        // Try to get error message from response body first
        if (
          typeof data === 'object' &&
          data !== null &&
          'error' in data &&
          typeof (data as any).error === 'string'
        ) {
          message = (data as any).error;
        } else {
          message = 'Erro no servidor. Tente novamente mais tarde.';
        }
      } else if (
        typeof data === 'object' &&
        data !== null &&
        'error' in data &&
        typeof (data as any).error === 'string'
      ) {
        message = (data as any).error;
      } else {
        message = `Erro na requisição (status ${response.status}). Verifique sua conexão e tente novamente.`;
      }

      throw new Error(message);
    }

    return data as T;
  } catch (error: any) {
    clearTimeout(timeoutId);

    console.error('❌ Request error:', {
      name: error.name,
      message: error.message,
      url,
      stack: error.stack,
    });

    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Verifique sua conexão e tente novamente.');
    }

    if (error instanceof TypeError) {
      if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
        const errorMsg = `Erro de conexão com o servidor. Verifique:
1. Se o backend está rodando (${API_BASE_URL})
2. Se a URL está correta no arquivo .env
3. Se há problemas de CORS
4. Sua conexão com a internet`;
        console.error('❌', errorMsg);
        throw new Error(errorMsg);
      }
    }

    // Re-throw with more context
    if (error.message) {
      throw error;
    }

    throw new Error(`Erro desconhecido: ${error.toString()}`);
  }
}

export { API_BASE_URL };
