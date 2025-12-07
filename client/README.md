# Frontend - Monitoreo de Rutas de Buses

Aplicación React responsive para gestionar viajes diarios de buses interprovinciales.

## Requisitos

- Node.js 18+
- npm

## Instalación

1. Entrar en la carpeta `client`:

```bash
cd client
npm install
```

2. Crear archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

3. Configurar la URL del API en `.env`:

```
VITE_API_URL=http://localhost:5000/api
```

## Ejecutar la aplicación

**Desarrollo:**
```bash
npm run dev
```

La aplicación correrá en `http://localhost:3000`

**Build para producción:**
```bash
npm run build
```

**Preview de producción:**
```bash
npm run preview
```

## Estructura del Proyecto

```
client/
├── src/
│   ├── components/
│   │   └── ViajeDiarioForm.tsx
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Monitoreo.tsx
│   │   └── Buses.tsx
│   ├── api.ts
│   ├── types.ts
│   ├── router.ts
│   ├── index.css
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── package.json
```

## Funcionalidades

### Autenticación
- Registro de nuevos usuarios con rol (Admin, Programador, Conductor)
- Login con email y contraseña
- Token JWT almacenado en localStorage
- Logout con limpieza de sesión

### Dashboard
- Página de bienvenida con información del usuario
- Acceso directo a gestión de viajes y buses

### Gestión de Viajes (CRUD)
- Listar todos los viajes diarios
- Filtros por: fecha, ruta, conductor
- Crear nuevo viaje con formulario completo
- Editar viajes existentes
- Eliminar viajes
- Campos anidados: horarios y monitoreo de combustible

### Gestión de Buses
- Listar todos los buses
- Crear nuevo bus con datos técnicos
- Visualización en tarjetas responsive

## Tecnologías

- **React 18**: Framework principal
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos
- **Vite**: Bundler
- **Lucide React**: Iconos

## Conectar con Backend

Asegúrate de que:

1. El backend esté corriendo en `http://localhost:5000`
2. La variable `VITE_API_URL` apunte a la URL correcta del API
3. Los headers de CORS estén configurados correctamente en el backend

## Responsive Design

La aplicación es completamente responsive con breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Variables de Entorno

```
VITE_API_URL=http://localhost:5000/api
```

## Notas

- Los tokens JWT se almacenan en localStorage
- Si el token expira (401), se redirige automáticamente al login
- Los formularios validan datos antes de enviar
- Los errores se muestran en mensajes descriptivos
