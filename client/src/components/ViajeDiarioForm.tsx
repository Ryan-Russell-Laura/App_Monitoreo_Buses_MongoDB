import React, { useState, useEffect } from 'react';
import { apiCall } from '../api';
import { Bus, Ruta, Usuario, ViajeDiario } from '../types';
import { X } from 'lucide-react';

interface ViajeDiarioFormProps {
  busesOptions: Bus[];
  rutasOptions: Ruta[];
  conductoresOptions: Usuario[];
  viajePorEditar: ViajeDiario | null;
  onClose: () => void;
}

export const ViajeDiarioForm = ({
  busesOptions,
  rutasOptions,
  conductoresOptions,
  viajePorEditar,
  onClose,
}: ViajeDiarioFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    rutaId: '',
    busId: '',
    conductorId: '',
    horario: {
      salidaProgramada: '',
      salidaReal: '',
      llegadaProgramada: '',
      llegadaReal: '',
    },
    monitoreoCombustible: {
      nivelInicial: 0,
      nivelFinal: 0,
      consumo: 0,
    },
    estado: 'Programado',
    observaciones: '',
  });
  const formatToLocalDatetime = (isoString: string | undefined): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
  useEffect(() => {
    if (viajePorEditar) {
      setFormData({
        rutaId: viajePorEditar.rutaId._id,
        busId: viajePorEditar.busId._id,
        conductorId: (viajePorEditar.conductorId as Usuario)._id, // ✅ DEBE SER ._id (añadimos as Usuario si el tipo no lo resuelve automáticamente)
        horario: {
          salidaProgramada: formatToLocalDatetime(viajePorEditar.horario.salidaProgramada),
          salidaReal: formatToLocalDatetime(viajePorEditar.horario.salidaReal),
          llegadaProgramada: formatToLocalDatetime(viajePorEditar.horario.llegadaProgramada),
          llegadaReal: formatToLocalDatetime(viajePorEditar.horario.llegadaReal),
        },
        monitoreoCombustible: viajePorEditar.monitoreoCombustible,
        estado: viajePorEditar.estado,
        observaciones: viajePorEditar.observaciones || '',
      });
    }
  }, [viajePorEditar]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        horario: {
          ...formData.horario,
          salidaProgramada: new Date(formData.horario.salidaProgramada).toISOString(),
          salidaReal: formData.horario.salidaReal ? new Date(formData.horario.salidaReal).toISOString() : null,
          llegadaProgramada: new Date(formData.horario.llegadaProgramada).toISOString(),
          llegadaReal: formData.horario.llegadaReal ? new Date(formData.horario.llegadaReal).toISOString() : null,
        },
        monitoreoCombustible: {
          ...formData.monitoreoCombustible,
          nivelInicial: parseFloat(formData.monitoreoCombustible.nivelInicial.toString()),
          nivelFinal: parseFloat(formData.monitoreoCombustible.nivelFinal.toString()),
          consumo: parseFloat(formData.monitoreoCombustible.consumo.toString()),
        },
      };

      if (viajePorEditar) {
        await apiCall(`/viajes-diarios/${viajePorEditar._id}`, {
          method: 'PUT',
          body: JSON.stringify(dataToSend),
        });
      } else {
        await apiCall('/viajes-diarios', {
          method: 'POST',
          body: JSON.stringify(dataToSend),
        });
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el viaje');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {viajePorEditar ? 'Editar Viaje' : 'Crear Nuevo Viaje'}
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Ruta</label>
            <select
              value={formData.rutaId}
              onChange={(e) => setFormData({ ...formData, rutaId: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Seleccionar ruta</option>
              {rutasOptions.map((ruta) => (
                <option key={ruta._id} value={ruta._id}>
                  {ruta.nombreRuta} ({ruta.origen} → {ruta.destino})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Bus</label>
            <select
              value={formData.busId}
              onChange={(e) => setFormData({ ...formData, busId: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Seleccionar bus</option>
              {busesOptions.map((bus) => (
                <option key={bus._id} value={bus._id}>
                  {bus.placa} - {bus.modelo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Conductor</label>
            <select
              value={formData.conductorId}
              onChange={(e) => setFormData({ ...formData, conductorId: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Seleccionar conductor</option>
              {conductoresOptions.map((conductor) => (
                <option key={conductor._id} value={conductor._id}>
                  {conductor.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Estado</label>
            <select
              value={formData.estado}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="Programado">Programado</option>
              <option value="En Curso">En Curso</option>
              <option value="Completado">Completado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Horario</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Salida Programada</label>
              <input
                type="datetime-local"
                value={formData.horario.salidaProgramada}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    horario: { ...formData.horario, salidaProgramada: e.target.value },
                  })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Salida Real</label>
              <input
                type="datetime-local"
                value={formData.horario.salidaReal}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    horario: { ...formData.horario, salidaReal: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Llegada Programada</label>
              <input
                type="datetime-local"
                value={formData.horario.llegadaProgramada}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    horario: { ...formData.horario, llegadaProgramada: e.target.value },
                  })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Llegada Real</label>
              <input
                type="datetime-local"
                value={formData.horario.llegadaReal}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    horario: { ...formData.horario, llegadaReal: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monitoreo de Combustible</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Nivel Inicial (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.monitoreoCombustible.nivelInicial}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    monitoreoCombustible: {
                      ...formData.monitoreoCombustible,
                      nivelInicial: parseFloat(e.target.value),
                    },
                  })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Nivel Final (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.monitoreoCombustible.nivelFinal}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    monitoreoCombustible: {
                      ...formData.monitoreoCombustible,
                      nivelFinal: parseFloat(e.target.value),
                    },
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Consumo (Lts)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.monitoreoCombustible.consumo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    monitoreoCombustible: {
                      ...formData.monitoreoCombustible,
                      consumo: parseFloat(e.target.value),
                    },
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Observaciones</label>
          <textarea
            value={formData.observaciones}
            onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            rows={4}
            placeholder="Notas adicionales sobre el viaje..."
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
          >
            {loading ? 'Guardando...' : viajePorEditar ? 'Actualizar' : 'Crear'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};
