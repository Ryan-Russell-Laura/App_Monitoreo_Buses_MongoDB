import React, { useState, useEffect } from 'react';
import { useNavigate } from '../router';
import { apiCall } from '../api';
import { Bus as BusType } from '../types';
import { Plus, ArrowLeft } from 'lucide-react';

export const Buses = () => {
  const navigate = useNavigate();
  const [buses, setBuses] = useState<BusType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ placa: '', modelo: '', capacidad: 0, mantenimiento: '' });

  useEffect(() => {
    cargarBuses();
  }, []);

  const cargarBuses = async () => {
    setLoading(true);
    try {
      const data = await apiCall('/buses');
      setBuses(data);
    } catch (error) {
      console.error('Error cargando buses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAgregar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const nuevoBus = await apiCall('/buses', {
        method: 'POST',
        body: JSON.stringify({
          placa: formData.placa.toUpperCase(),
          modelo: formData.modelo,
          capacidad: parseInt(formData.capacidad.toString()),
          mantenimiento: formData.mantenimiento || null,
        }),
      });
      setBuses([...buses, nuevoBus]);
      setFormData({ placa: '', modelo: '', capacidad: 0, mantenimiento: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error agregando bus:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <h1 className="text-xl font-bold text-gray-800">Gestión de Buses</h1>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Flota de Buses</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            <Plus className="w-5 h-5" />
            Nuevo Bus
          </button>
        </div>

        {showForm && (
          <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Agregar Nuevo Bus</h3>
            <form onSubmit={handleAgregar}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Placa</label>
                  <input
                    type="text"
                    value={formData.placa}
                    onChange={(e) => setFormData({ ...formData, placa: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    placeholder="ABC-123"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Modelo</label>
                  <input
                    type="text"
                    value={formData.modelo}
                    onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    placeholder="Mercedes Benz 1729"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Capacidad</label>
                  <input
                    type="number"
                    value={formData.capacidad}
                    onChange={(e) => setFormData({ ...formData, capacidad: parseInt(e.target.value) })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    placeholder="45"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Próximo Mantenimiento</label>
                  <input
                    type="date"
                    value={formData.mantenimiento}
                    onChange={(e) => setFormData({ ...formData, mantenimiento: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">Cargando...</div>
        ) : buses.length === 0 ? (
          <div className="text-center py-8 text-gray-600">No hay buses registrados</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buses.map((bus) => (
              <div key={bus._id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{bus.placa}</h3>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Modelo:</span> {bus.modelo}
                </p>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Capacidad:</span> {bus.capacidad} pasajeros
                </p>
                {bus.mantenimiento && (
                  <p className="text-gray-600">
                    <span className="font-medium">Mantenimiento:</span>{' '}
                    {new Date(bus.mantenimiento).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
