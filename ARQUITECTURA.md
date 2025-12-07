# Arquitectura - Monitoreo de Rutas de Buses

## Diagrama General

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE (FRONTEND)                        │
│              React 18 + TypeScript + Tailwind                │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Páginas React                           │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌───────────────┐ │   │
│  │  │ Login        │ │ Dashboard    │ │ Monitoreo     │ │   │
│  │  │ Register     │ │              │ │ (CRUD Viajes) │ │   │
│  │  └──────────────┘ └──────────────┘ └───────────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ▼                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Context + API Utils                        │   │
│  │  AuthContext │ apiCall() │ useNavigate()            │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ▼                                   │
│          HTTP Requests con Authorization JWT                │
└──────────────────────────────────────────────────────────────┘
                           ▼▼▼
                        HTTP/CORS
                           ▼▼▼
┌──────────────────────────────────────────────────────────────┐
│                    SERVIDOR (BACKEND)                        │
│              Node.js + Express + Mongoose                    │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Rutas / Endpoints                          │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌───────────────┐ │   │
│  │  │ /auth        │ │ /buses       │ │ /viajes-      │ │   │
│  │  │ POST reg.    │ │ GET/POST     │ │  diarios      │ │   │
│  │  │ POST login   │ │              │ │ GET/POST/PUT/ │ │   │
│  │  │              │ │              │ │ DELETE        │ │   │
│  │  └──────────────┘ └──────────────┘ └───────────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ▼                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │        Middleware (Autenticación JWT)                │   │
│  │  verifyToken() - Valida headers Authorization       │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ▼                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Modelos Mongoose (Schemas)                   │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │ Usuario (nombre, email, password, rol)         │  │   │
│  │  │ Bus (placa, modelo, capacidad, mantenimiento)  │  │   │
│  │  │ Ruta (nombreRuta, origen, destino, duracion)   │  │   │
│  │  │ ViajeDiario (rutaId, busId, conductorId,       │  │   │
│  │  │   horario{}, monitoreoCombustible{}, estado)   │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ▼                                   │
└──────────────────────────────────────────────────────────────┘
                           ▼▼▼
                    MongoDB Queries
                           ▼▼▼
┌──────────────────────────────────────────────────────────────┐
│                   BASE DE DATOS (MongoDB)                    │
│                                                               │
│  ┌──────────────┐ ┌──────────────┐ ┌───────────────────┐   │
│  │ usuarios     │ │ buses        │ │ rutas             │   │
│  │ collection   │ │ collection   │ │ collection        │   │
│  └──────────────┘ └──────────────┘ └───────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ viajesdiarios (collection principal con CRUD)       │   │
│  │  - Almacena referencias a usuarios, buses, rutas    │   │
│  │  - Documentos anidados: horario, combustible       │   │
│  │  - Permite queries complejas                        │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

## Flujo de Autenticación

```
1. REGISTRO
   Usuario llena formulario (nombre, email, password, rol)
   ▼
   POST /api/auth/register con datos
   ▼
   Backend: Encripta password con bcryptjs (10 rounds)
   ▼
   Guarda documento en collection "usuarios"
   ▼
   Respuesta: { message: "Usuario registrado exitosamente" }

2. LOGIN
   Usuario ingresa email y password
   ▼
   POST /api/auth/login con credenciales
   ▼
   Backend: Busca usuario por email
   ▼
   Compara password ingresada con hash guardado
   ▼
   Genera JWT con: { id, email, rol }
   ▼
   Respuesta: { token: "eyJ...", usuario: {...} }
   ▼
   Frontend: Almacena token en localStorage

3. REQUESTS PROTEGIDOS
   Frontend agrega header: Authorization: Bearer <token>
   ▼
   Backend: Middleware verifyToken() valida JWT
   ▼
   Si válido: Procesa request
   Si inválido: Retorna 403 Forbidden
```

## Flujo CRUD - Viajes Diarios

```
CREATE (POST /api/viajes-diarios)
┌─────────────────────────────────────┐
│ 1. Usuario llena formulario          │
│    - Selecciona Ruta (rutaId)        │
│    - Selecciona Bus (busId)          │
│    - Selecciona Conductor (conductor │)
│    - Horarios (sub-schema anidado)   │
│    - Combustible (sub-schema anidado)│
└─────────────────────────────────────┘
         ▼
┌─────────────────────────────────────┐
│ 2. Frontend valida datos            │
│    - Campos requeridos               │
│    - Formato de fechas               │
│    - Números válidos                 │
└─────────────────────────────────────┘
         ▼
┌─────────────────────────────────────┐
│ 3. POST con JWT                     │
│    Headers: Authorization: Bearer... │
│    Body: { rutaId, busId, conductor │
│      horario: {...},                │
│      monitoreoCombustible: {...} }   │
└─────────────────────────────────────┘
         ▼
┌─────────────────────────────────────┐
│ 4. Backend guarda en MongoDB         │
│    - Crea nuevo documento            │
│    - Referencia IDs de otras colls   │
│    - Indexa por fecha, estado        │
└─────────────────────────────────────┘
         ▼
┌─────────────────────────────────────┐
│ 5. Respuesta con datos completos    │
│    (populate con datos reales)       │
└─────────────────────────────────────┘

READ (GET /api/viajes-diarios)
┌─────────────────────────────────────┐
│ 1. Frontend solicita lista           │
│    GET con JWT en header             │
└─────────────────────────────────────┘
         ▼
┌─────────────────────────────────────┐
│ 2. Backend:                         │
│    - Valida JWT                      │
│    - Query base de datos             │
│    - populate() para relaciones      │
│    - Retorna array de viajes         │
└─────────────────────────────────────┘

UPDATE (PUT /api/viajes-diarios/:id)
┌─────────────────────────────────────┐
│ 1. Usuario abre viaje para editar    │
│    Formulario pre-poblado con datos  │
└─────────────────────────────────────┘
         ▼
┌─────────────────────────────────────┐
│ 2. Usuario modifica campos           │
│    Valida datos nuevamente           │
└─────────────────────────────────────┘
         ▼
┌─────────────────────────────────────┐
│ 3. PUT /api/viajes-diarios/:id      │
│    Con datos actualizados + JWT      │
└─────────────────────────────────────┘
         ▼
┌─────────────────────────────────────┐
│ 4. Backend:                         │
│    - Valida JWT y permisos           │
│    - findByIdAndUpdate()             │
│    - Retorna documento actualizado   │
└─────────────────────────────────────┘

DELETE (DELETE /api/viajes-diarios/:id)
┌─────────────────────────────────────┐
│ 1. Usuario confirma eliminación      │
│    Modal de confirmación             │
└─────────────────────────────────────┘
         ▼
┌─────────────────────────────────────┐
│ 2. DELETE /api/viajes-diarios/:id   │
│    Con JWT en header                 │
└─────────────────────────────────────┘
         ▼
┌─────────────────────────────────────┐
│ 3. Backend:                         │
│    - Valida JWT                      │
│    - findByIdAndDelete()             │
│    - Retorna confirmación            │
└─────────────────────────────────────┘
         ▼
┌─────────────────────────────────────┐
│ 4. Frontend actualiza lista          │
│    Remueve viaje de vista             │
└─────────────────────────────────────┘
```

## Estructura de Documentos MongoDB

### Colección: usuarios
```json
{
  "_id": ObjectId,
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "$2a$10$...", // bcryptjs hash
  "rol": "Conductor",
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

### Colección: buses
```json
{
  "_id": ObjectId,
  "placa": "ABC-123",
  "modelo": "Mercedes Benz 1729",
  "capacidad": 45,
  "mantenimiento": ISODate("2024-12-31"),
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

### Colección: rutas
```json
{
  "_id": ObjectId,
  "nombreRuta": "Lima - Arequipa",
  "origen": "Lima",
  "destino": "Arequipa",
  "duracionEstimada": 16,
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

### Colección: viajesdiarios (PRINCIPAL)
```json
{
  "_id": ObjectId,
  "rutaId": ObjectId("ref to rutas"),
  "busId": ObjectId("ref to buses"),
  "conductorId": ObjectId("ref to usuarios"),

  // DOCUMENTO ANIDADO 1
  "horario": {
    "salidaProgramada": ISODate("2024-12-20T06:00:00Z"),
    "salidaReal": ISODate("2024-12-20T06:15:00Z"),
    "llegadaProgramada": ISODate("2024-12-21T22:00:00Z"),
    "llegadaReal": ISODate("2024-12-21T21:45:00Z")
  },

  // DOCUMENTO ANIDADO 2
  "monitoreoCombustible": {
    "nivelInicial": 100,
    "nivelFinal": 25,
    "consumo": 75
  },

  "estado": "Completado",
  "observaciones": "Viaje sin incidentes",
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

## Seguridad

### Frontend
- JWT almacenado en localStorage
- CORS configurado
- Validación de entrada
- Manejo de errores

### Backend
- Autenticación JWT en cada request
- Encriptación bcryptjs (10 rounds)
- CORS restrictivo
- Validación de schema con Mongoose
- Tratamiento de errores

### MongoDB
- Índices en email (único)
- Índices en placa (única)
- Queries con populate para evitar información sensible

## Rendimiento

- Queries optimizadas
- Índices en campos frecuentes
- Lazy loading en frontend
- Caché de token en localStorage
- Bundling con Vite

## Escalabilidad

- Servicios separados (front/back)
- Modelos reutilizables
- Fácil agregar más colecciones
- Variables de entorno para config
- Preparado para microservicios

## Requisitos No-Funcionales

✅ Responsive (Mobile, Tablet, Desktop)
✅ Autenticación JWT
✅ 4 schemas Mongoose
✅ CRUD completo para ViajeDiario
✅ Documentos anidados
✅ Filtros dinámicos
✅ Validación frontend y backend
✅ Manejo de errores
