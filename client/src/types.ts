export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: 'Admin' | 'Programador' | 'Conductor';
}

export interface Bus {
  _id: string;
  placa: string;
  modelo: string;
  capacidad: number;
  mantenimiento?: string;
}

export interface Ruta {
  _id: string;
  nombreRuta: string;
  origen: string;
  destino: string;
  duracionEstimada: number;
}

export interface Horario {
  salidaProgramada: string;
  salidaReal?: string;
  llegadaProgramada: string;
  llegadaReal?: string;
}

export interface MonitoreoCombustible {
  nivelInicial: number;
  nivelFinal?: number;
  consumo?: number;
}

export interface ViajeDiario {
  _id: string;
  rutaId: Ruta;
  busId: Bus;
  conductorId: Usuario;
  horario: Horario;
  monitoreoCombustible: MonitoreoCombustible;
  estado: 'Programado' | 'En Curso' | 'Completado' | 'Cancelado';
  observaciones?: string;
  createdAt: string;
}
