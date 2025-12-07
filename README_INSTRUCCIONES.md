# Monitoreo de Rutas de Buses Interprovinciales - CRUD Full Stack

Aplicación completa para gestionar y monitorear viajes diarios de buses interprovinciales con autenticación JWT.

## Requisitos Previos

- Node.js 18+ (descargar de https://nodejs.org/)
- npm (incluido con Node.js)
- MongoDB Atlas (cuenta gratuita en https://www.mongodb.com/cloud/atlas)
- Postman o Thunder Client (opcional, para testing)

## Stack Tecnológico

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express
- **Base de Datos**: MongoDB con Mongoose
- **Autenticación**: JWT (JSON Web Tokens)

## Estructura de Carpetas

```
proyecto/
├── server/          # Backend Node.js/Express
│   ├── src/
│   ├── .env.example
│   └── package.json
├── client/          # Frontend React
│   ├── src/
│   ├── .env.example
│   └── package.json
```

## Instalación Paso a Paso

### 1. Configurar MongoDB Atlas

1. Ir a https://www.mongodb.com/cloud/atlas
2. Crear una cuenta gratuita
3. Crear un cluster (seleccionar "Free tier")
4. Esperar a que se configure (5-10 minutos)
5. En "Database" → "Collections" → crear una base de datos nueva:
   - Database name: `monitoreo_buses`
   - Collection name: `usuarios`
6. Ir a "Connect" → "Drivers" → Node.js
7. Copiar la URI de conexión (example):
   ```
   mongodb+srv://usuario:password@cluster0.mongodb.net/?retryWrites=true&w=majority
   ```
8. Cambiar la URI a:
   ```
   mongodb+srv://usuario:password@cluster0.mongodb.net/monitoreo_buses
   ```

### 2. Configurar Backend

1. Abrir terminal en la carpeta `server`:
   ```bash
   cd server
   npm install
   ```

2. Crear archivo `.env`:
   ```bash
   cp .env.example .env
   ```

3. Editar `.env` y reemplazar valores:
   ```
   MONGO_URI=mongodb+srv://usuario:password@cluster0.mongodb.net/monitoreo_buses
   JWT_SECRET=tu_secret_key_muy_seguro_2024
   PORT=5000
   NODE_ENV=development
   ```

4. Iniciar servidor:
   ```bash
   npm run dev
   ```

   Deberías ver:
   ```
   Server running on port 5000
   MongoDB connected successfully
   ```

### 3. Configurar Frontend

1. En otra terminal, ir a carpeta `client`:
   ```bash
   cd client
   npm install
   ```

2. Crear archivo `.env`:
   ```bash
   cp .env.example .env
   ```

3. Editar `.env` (dejar por defecto):
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. Iniciar aplicación:
   ```bash
   npm run dev
   ```

   Deberías ver algo como:
   ```
   VITE v5.4.2  ready in 123 ms
   ➜  Local:   http://localhost:3000/
   ```

## Uso de la Aplicación

### Acceso Inicial

1. Abrir navegador en: http://localhost:3000
2. Seleccionar "Crear nueva cuenta"
3. Registrarse con datos:
   - Nombre: Tu nombre
   - Email: usuario@example.com
   - Contraseña: 123456
   - Rol: Conductor (o Admin/Programador)

4. Hacer clic en "Registrarse"
5. Ahora "Iniciar Sesión" con los mismos datos

### Flujo de Uso

**Dashboard (Página Principal)**
- Ver información del usuario logueado
- Acceso a "Gestionar Viajes" y "Gestionar Buses"

**Gestionar Buses**
- Click en "Nuevo Bus"
- Llenar datos (Placa: ABC-123, Modelo, Capacidad, etc.)
- Click en "Guardar"

**Gestionar Viajes (CRUD Principal)**
- Click en "Nuevo Viaje"
- Seleccionar Bus, Ruta, Conductor
- Llenar horarios y monitoreo de combustible
- Click en "Crear"
- Filtrar por fecha, ruta o conductor
- Editar o eliminar viajes según sea necesario

## Modelos de Datos

### Usuario
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "rol": "Conductor"
}
```

### Bus
```json
{
  "placa": "ABC-123",
  "modelo": "Mercedes Benz 1729",
  "capacidad": 45,
  "mantenimiento": "2024-12-31"
}
```

### Ruta
```json
{
  "nombreRuta": "Lima - Arequipa",
  "origen": "Lima",
  "destino": "Arequipa",
  "duracionEstimada": 16
}
```

### ViajeDiario (CRUD Principal)
```json
{
  "rutaId": "...",
  "busId": "...",
  "conductorId": "...",
  "horario": {
    "salidaProgramada": "2024-12-20",
    "salidaReal": "2024-12-20",
    "llegadaProgramada": "2024-12-21",
    "llegadaReal": "2024-12-21"
  },
  "monitoreoCombustible": {
    "nivelInicial": 100,
    "nivelFinal": 25,
    "consumo": 75
  },
  "estado": "Completado"
}
```

## Endpoints de API

### Autenticación (Sin JWT)
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión

### Buses (Requiere JWT)
- `GET /api/buses` - Listar buses
- `POST /api/buses` - Crear bus

### Rutas (Requiere JWT)
- `GET /api/rutas` - Listar rutas
- `POST /api/rutas` - Crear ruta

### Viajes (Requiere JWT) - CRUD Completo
- `GET /api/viajes-diarios` - Listar viajes
- `POST /api/viajes-diarios` - Crear viaje
- `GET /api/viajes-diarios/:id` - Obtener viaje
- `PUT /api/viajes-diarios/:id` - Actualizar viaje
- `DELETE /api/viajes-diarios/:id` - Eliminar viaje

## Solución de Problemas

### "Cannot connect to MongoDB"
- Verificar URI en `.env`
- Asegúrate de que el cluster esté activo en MongoDB Atlas
- Agregar tu IP a "Network Access" en MongoDB Atlas

### "Port 5000 already in use"
- Cambiar PORT en `.env` del servidor
- O matar proceso: `lsof -ti:5000 | xargs kill -9` (Mac/Linux)

### "VITE_API_URL not found"
- Verificar que `.env` existe en carpeta `client`
- Reiniciar servidor dev con `npm run dev`

### CORS errors
- Backend CORS está configurado correctamente
- Verificar que URLs coincidan en `.env`

## Características Principales

✅ Autenticación JWT segura
✅ 4 modelos Mongoose (Usuario, Bus, Ruta, ViajeDiario)
✅ CRUD completo para Viajes Diarios
✅ Documentos anidados (horario, monitoreoCombustible)
✅ Selectores dinámicos en formularios
✅ Filtros (fecha, ruta, conductor)
✅ Interfaz responsive (mobile, tablet, desktop)
✅ Validación de datos en frontend y backend
✅ Manejo de errores
✅ Encriptación de contraseñas con bcryptjs

## Desarrollo y Testing

### Testing con Postman

1. Descargar Postman (https://www.postman.com/downloads/)
2. Crear nueva colección
3. Agregar requests:

**Registro:**
```
POST http://localhost:5000/api/auth/register
Body (JSON):
{
  "nombre": "Test User",
  "email": "test@example.com",
  "password": "123456",
  "rol": "Admin"
}
```

**Login:**
```
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "test@example.com",
  "password": "123456"
}
```

**Obtener Buses (copiar token del login):**
```
GET http://localhost:5000/api/buses
Headers:
Authorization: Bearer <token_aqui>
```

## Performance

- Frontend: ~50KB bundle (minificado)
- Backend: Lightweight con Express
- BD: Queries optimizadas con índices
- Caché: LocalStorage para token

## Seguridad

- Contraseñas encriptadas con bcryptjs (10 rounds)
- JWT con expiración de 24 horas
- CORS habilitado solo para frontend
- Validación en frontend y backend
- Variables sensibles en .env

## Scripts Disponibles

### Backend
```bash
npm run dev      # Desarrollo con auto-reload
npm start        # Producción
```

### Frontend
```bash
npm run dev      # Desarrollo
npm run build    # Build producción
npm run preview  # Previsualizar build
npm run lint     # ESLint
npm run typecheck # TypeScript check
```

## Próximos Pasos (Opcionales)

- Agregar validación con Zod/Yup
- Implementar refresh tokens
- Agregar roles más granulares
- Caching con Redis
- Tests unitarios
- Deploying a producción

## Documentación

- React: https://react.dev
- Express: https://expressjs.com
- Mongoose: https://mongoosejs.com
- JWT: https://jwt.io
- MongoDB Atlas: https://docs.atlas.mongodb.com

## Soporte

Si encuentras errores:
1. Revisa la consola del navegador (F12)
2. Revisa logs del servidor terminal
3. Verifica conexión a MongoDB
4. Confirma que ambos servidores corren en puertos correctos

## Licencia

MIT
