# Sistema Solar - Explorador de Planetas 🌎
[![Next.js](https://img.shields.io/badge/Next.js-15.1.7-000000?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-06B6D4?logo=tailwind-css)](https://tailwindcss.com/)

Aplicación web moderna desarrollada con Next.js que permite explorar información sobre los planetas del Sistema Solar, incluyendo sus características, distancias y visualizaciones.

## 🚀 Características Principales

- Visualización 3D interactiva de planetas
- Búsqueda inteligente con filtrado en tiempo real
- Diseño responsive y adaptable a dispositivos móviles
- Modo oscuro/claro con persistencia de preferencias
- Datos astronómicos actualizados en tiempo real
- Sistema de favoritos con almacenamiento local
- Imágenes de alta resolución desde Wikipedia
- Paginación optimizada para grandes conjuntos de datos
- Interfaz completamente en español
- Rendimiento optimizado con Server Components

## 🛠️ Tecnologías Utilizadas

- **Next.js 15.1.7** - Framework React para aplicaciones de producción
- **React 19** - Biblioteca para interfaces de usuario
- **TypeScript** - Tipado estático avanzado
- **Tailwind CSS** - Estilizado utility-first con dark mode
- **Framer Motion** - Animaciones fluidas e interactivas
- **Zustand** - Gestión de estado ligera y eficiente

## 📋 Prerrequisitos
 - Node.js (versión 18 o superior)
 - npm, yarn, pnpm o bun

## 🔧 Instalación
1. Clona el repositorio:
```bash 
git clone https://github.com/FoulTrip/tres_astronautas_app_test.git
cd tres_astronautas_app_test
```
2. Instala las dependencias:
```bash 
npm install
# o
yarn install
# o
pnpm install
# o
bun install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
```
4. Abre http://localhost:3000 en tu navegador.

## 🏗️ Estructura del Proyecto
```textplain 
src/
├── app/                    # Rutas y configuración de la aplicación
│   ├── api/                # Endpoints de la API
│   ├── planet/             # Páginas de planetas individuales
|   |   ├── hooks/          # Hooks personalizados para la gestión de datos
│   └── layout.tsx          # Layout principal
├── components/             # Componentes reutilizables
│   ├── planets/            # Componentes relacionados con planetas
│   └── ui/                 # Componentes de UI genéricos
├── context/                # Contextos de React
├── lib/                    # Utilidades y configuraciones
└── types/                  # Definiciones de tipos TypeScript
```

## 🌟 Funcionalidades avanzadas

### Sistema de Favoritos
- Persistencia en localStorage
- Sincronización entre pestañas
- Notificaciones visuales
- Acceso rápido desde cualquier vista

### Búsqueda inteligente
- Autocompletado predictivo
- Búsqueda difusa (fuzzy search)
- Filtrado por múltiples criterios
- Ordenamiento dinámico

## 🤔 Decisiones Técnicas

### Arquitectura
 - **App Router de Next.js:** Utilizado para aprovechar las últimas características de React Server Components y mejor SEO.
 - **Estrategia ISR:** Regeneración estática incremental para datos planetarios
 - **Caching inteligente:** Memoización de peticiones API para mejor performance
 - **Lazy Loading:** Carga diferida de imágenes y componentes
 - **Error Boundaries:** Manejo elegante de errores en componentes
 - **TypeScript:** Implementado para mayor seguridad de tipos y mejor mantenibilidad del código.

### Gestión de Estado
 - **React Context and Zustand:** Utilizado para manejar el tema oscuro/claro globalmente y consistencia de datos localmente.
 - **Custom Hooks:** Implementados para encapsular la lógica de negocio y estado local.

### Seguridad
- Validación estricta de tipos con TypeScript
- Sanitización de inputs de usuario
- Protección contra XSS y CSRF
- Rate limiting en endpoints API

### Integraciones
 - **API del Sistema Solar:** Integración con api.le-systeme-solaire.net para datos planetarios.
 - **Wikipedia API:** Utilizada para obtener imágenes de los planetas.

### Optimizaciones
 - **Paginación:** Implementada para manejar grandes conjuntos de datos eficientemente.
 - **Lazy Loading:** Imágenes cargadas de manera diferida para mejor rendimiento.
Caching: Implementado a nivel de API para reducir llamadas innecesarias.

## 🔄 Flujo de Datos
1. El usuario interactúa con la interfaz
2. Los componentes React manejan eventos
3. Las API Routes procesan las solicitudes
4. Se obtienen datos de APIs externas
5. Los datos se transforman y normalizan
6. La UI se actualiza con los nuevos datos

## ✨ Servicios
 - **Le Système Solaire API** para los datos planetarios
 - **Wikipedia API** para las imágenes
 - **Vercel** para el hosting