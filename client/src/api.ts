const API_URL = import.meta.env.VITE_API_URL;

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  // 1. Inicializa headers como un objeto Record<string, string> (más seguro y mutable)
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // 2. Copia cabeceras existentes si existen
  // Usar Object.assign o la sintaxis de spread es válido, pero Object.assign es más robusto aquí.
  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  // 3. Inyecta el token SOLO si existe
  if (token) {
    headers['Authorization'] = `Bearer ${token}`; // Ahora este acceso es 100% seguro.
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error en la solicitud');
  }

  return response.json();

  // ... (El resto del código es correcto)
}