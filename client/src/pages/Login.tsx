import React, { useState } from 'react';
import { useNavigate } from '../router';
import { useAuth } from '../context/AuthContext';
import { apiCall } from '../api';
import { Bus } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState('Conductor');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      login(data.token, data.usuario);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en el login');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ nombre, email, password, rol }),
      });
      setError('');
      alert('Registro exitoso. Por favor inicia sesión.');
      setIsRegister(false);
      setNombre('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-center mb-8">
          <Bus className="w-8 h-8 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Monitoreo Buses</h1>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={isRegister ? handleRegister : handleLogin}>
          {isRegister && (
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Tu nombre completo"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="tu@email.com"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="••••••••"
            />
          </div>

          {isRegister && (
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Rol</label>
              <select
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Conductor">Conductor</option>
                <option value="Programador">Programador</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
          >
            {loading ? 'Cargando...' : isRegister ? 'Registrarse' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {isRegister ? 'Ya tengo cuenta' : 'Crear nueva cuenta'}
          </button>
        </div>
      </div>
    </div>
  );
};
