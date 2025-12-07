import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from '../router';
import { Bus, LogOut, ClipboardList, Truck } from 'lucide-react';

export const Dashboard = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Bus className="w-6 h-6 text-blue-600 mr-2" />
            <h1 className="text-xl font-bold text-gray-800">Monitoreo de Rutas</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">{usuario?.nombre}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Bienvenido, {usuario?.nombre}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            onClick={() => navigate('/monitoreo')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer border-l-4 border-blue-600"
          >
            <div className="flex items-center mb-4">
              <ClipboardList className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">Gestionar Viajes</h3>
            </div>
            <p className="text-gray-600">
              Crea, edita y monitorea los viajes diarios de tus buses
            </p>
          </div>

          <div
            onClick={() => navigate('/buses')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer border-l-4 border-green-600"
          >
            <div className="flex items-center mb-4">
              <Truck className="w-8 h-8 text-green-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">Gestionar Buses</h3>
            </div>
            <p className="text-gray-600">
              Registra y administra la flota de buses
            </p>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Información del Usuario</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Email</p>
              <p className="text-gray-800 font-medium">{usuario?.email}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Rol</p>
              <p className="text-gray-800 font-medium">{usuario?.rol}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
