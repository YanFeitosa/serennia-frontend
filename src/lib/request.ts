const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

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
    const message =
      typeof data === 'object' &&
      data !== null &&
      'error' in data &&
      typeof (data as any).error === 'string'
        ? (data as any).error
        : `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

export { API_BASE_URL };
