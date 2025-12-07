# Backend - Monitoreo de Rutas de Buses

Servidor API REST con Node.js, Express y MongoDB usando Mongoose.

## Requisitos

- Node.js 18+
- MongoDB Atlas (cuenta gratuita en https://www.mongodb.com/cloud/atlas)
- npm

## Instalación

1. Clonar el repositorio y entrar en la carpeta `server`:

```bash
cd server
npm install
```

2. Crear archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

3. Configurar las variables de entorno en `.env`:

```
MONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/monitoreo_buses
JWT_SECRET=tu_secret_key_super_seguro_aqui
PORT=5000
NODE_ENV=development
```

## Obtener MongoDB URI

1. Ir a https://www.mongodb.com/cloud/atlas
2. Crear cuenta gratuita
3. Crear un cluster
4. En "Database" → "Connect" → "Drivers" → copiar la URI
5. Reemplazar `<password>` y `<username>` con tus credenciales

## Ejecutar el servidor

**Desarrollo:**
```bash
npm run dev
```

**Producción:**
```bash
npm start
```

El servidor correrá en `http://localhost:5000`

## Endpoints de la API

### Autenticación (Sin JWT requerido)

- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión

### Buses (JWT requerido)

- `GET /api/buses` - Obtener todos los buses
- `POST /api/buses` - Crear nuevo bus

### Rutas (JWT requerido)

- `GET /api/rutas` - Obtener todas las rutas
- `POST /api/rutas` - Crear nueva ruta

### Viajes Diarios (JWT requerido)

- `POST /api/viajes-diarios` - Crear nuevo viaje
- `GET /api/viajes-diarios` - Obtener todos los viajes
- `GET /api/viajes-diarios/:id` - Obtener viaje por ID
- `PUT /api/viajes-diarios/:id` - Actualizar viaje
- `DELETE /api/viajes-diarios/:id` - Eliminar viaje

## Estructura del Proyecto

```
server/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Usuario.js
│   │   ├── Bus.js
│   │   ├── Ruta.js
│   │   └── ViajeDiario.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── buses.js
│   │   ├── rutas.js
│   │   └── viajeDiario.js
│   └── server.js
├── .env
├── .env.example
└── package.json
```

## Modelos de Datos

### Usuario
- nombre: String
- email: String (único)
- password: String (encriptado)
- rol: String (Admin, Programador, Conductor)

### Bus
- placa: String (única)
- modelo: String
- capacidad: Number
- mantenimiento: Date

### Ruta
- nombreRuta: String
- origen: String
- destino: String
- duracionEstimada: Number

### ViajeDiario
- rutaId: ObjectId (referencia a Ruta)
- busId: ObjectId (referencia a Bus)
- conductorId: ObjectId (referencia a Usuario)
- horario: Object (salidaProgramada, salidaReal, llegadaProgramada, llegadaReal)
- monitoreoCombustible: Object (nivelInicial, nivelFinal, consumo)
- estado: String (Programado, En Curso, Completado, Cancelado)
- observaciones: String

## Testing

Puedes usar Postman o Thunder Client para probar los endpoints:

### Ejemplo: Registrar Usuario

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456",
  "rol": "Conductor"
}
```

### Ejemplo: Iniciar Sesión

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "123456"
}
```

Respuesta:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": "...",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "Conductor"
  }
}
```

### Usar Token en Requests

Incluir el header en todas las peticiones protegidas:

```
Authorization: Bearer <token>
```
