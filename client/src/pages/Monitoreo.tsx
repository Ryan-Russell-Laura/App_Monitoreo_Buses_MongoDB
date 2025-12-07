import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from '../router';
import { apiCall } from '../api';
import { ViajeDiario, Bus, Ruta, Usuario } from '../types';
import { Plus, Trash2, Edit2, ArrowLeft } from 'lucide-react';
import { ViajeDiarioForm } from '../components/ViajeDiarioForm';

export const Monitoreo = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [viajes, setViajes] = useState<ViajeDiario[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [conductores, setConductores] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroRuta, setFiltroRuta] = useState('');
  const [filtroConductor, setFiltroConductor] = useState('');

  useEffect(() => {
    cargarDatos();
  }, [token]);

const cargarDatos = async () => {
    setLoading(true);
    try {
      const [viajasData, busesData, rutasData, conductoresData] = await Promise.all([ // Línea 24: ¡NUEVO!
        apiCall('/viajes-diarios'),
        apiCall('/buses'),
        apiCall('/rutas'),
        apiCall('/auth/conductores'), // <-- AÑADE ESTA LÍNEA CRÍTICA
      ]);
      setViajes(viajasData);
      setBuses(busesData);
      setRutas(rutasData);
      
      setConductores(conductoresData); // <-- REEMPLAZA las 4 líneas ineficientes por esta
      
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

 const viajesFiltrados = viajes.filter((viaje) => {
    const fechaViaje = new Date(viaje.horario.salidaProgramada).toISOString().split('T')[0];
    const cumpleFecha = !filtroFecha || fechaViaje === filtroFecha;
    const cumpleRuta = !filtroRuta || viaje.rutaId._id === filtroRuta;
    const cumpleConductor = !filtroConductor || viaje.conductorId._id === filtroConductor; // <-- CAMBIADO a ._id
    return cumpleFecha && cumpleRuta && cumpleConductor;
  });

  const handleEliminar = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este viaje?')) return;
    try {
      await apiCall(`/viajes-diarios/${id}`, { method: 'DELETE' });
      setViajes(viajes.filter((v) => v._id !== id));
    } catch (error) {
      console.error('Error eliminando viaje:', error);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingId(null);
    cargarDatos();
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
          <h1 className="text-xl font-bold text-gray-800">Gestión de Viajes Diarios</h1>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {showForm ? (
          <ViajeDiarioForm
            busesOptions={buses}
            rutasOptions={rutas}
            conductoresOptions={conductores}
            viajePorEditar={editingId ? viajes.find((v) => v._id === editingId) : null}
            onClose={handleFormClose}
          />
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Viajes Diarios</h2>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Plus className="w-5 h-5" />
                Nuevo Viaje
              </button>
            </div>

            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-md">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Filtrar por Fecha</label>
                <input
                  type="date"
                  value={filtroFecha}
                  onChange={(e) => setFiltroFecha(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Filtrar por Ruta</label>
                <select
                  value={filtroRuta}
                  onChange={(e) => setFiltroRuta(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Todas las rutas</option>
                  {rutas.map((ruta) => (
                    <option key={ruta._id} value={ruta._id}>
                      {ruta.nombreRuta}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Filtrar por Conductor</label>
                <select
                  value={filtroConductor}
                  onChange={(e) => setFiltroConductor(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Todos los conductores</option>
                  {conductores.map((conductor) => (
                    <option key={conductor._id} value={conductor._id}>
                      {conductor.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">Cargando...</div>
            ) : viajesFiltrados.length === 0 ? (
              <div className="text-center py-8 text-gray-600">No hay viajes registrados</div>
            ) : (
              <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Ruta</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Bus</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Conductor</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Salida</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Estado</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viajesFiltrados.map((viaje) => (
                      <tr key={viaje._id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">{viaje.rutaId.nombreRuta}</td>
                        <td className="px-6 py-4">{viaje.busId.placa}</td>
                        <td className="px-6 py-4">{viaje.conductorId.nombre}</td>
                        <td className="px-6 py-4">
                          {new Date(viaje.horario.salidaProgramada).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              viaje.estado === 'Completado'
                                ? 'bg-green-100 text-green-800'
                                : viaje.estado === 'En Curso'
                                  ? 'bg-blue-100 text-blue-800'
                                  : viaje.estado === 'Cancelado'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {viaje.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setEditingId(viaje._id);
                              setShowForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 mr-4"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleEliminar(viaje._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
