# 🚀 Explorador Híbrido de Servicios (Google + OpenStreetMap)

Este proyecto es una aplicación web dinámica que integra tres servicios de datos mediante peticiones asíncronas (`fetch`). Diseñada con un estilo **Glassmorphism** moderno, permite a los usuarios buscar información sobre libros, videos y lugares geográficos de forma simultánea.

---

## ✨ Características Principales

*   **📚 Integración Google Books API:** Búsqueda en tiempo real de libros relacionados con el término ingresado.
*   **📺 YouTube Data API v3:** Visualización de videos educativos o informativos embebidos para cada búsqueda.
*   **🗺️ Mapa Inteligente (Leaflet + Photon/OSM):** 
    *   **Búsqueda Dual:** Localiza el lugar exacto especificado (ej: universidades, hitos) y también librerías cercanas.
    *   **Marcadores Diferenciados:** Marcador naranja pulsante para el lugar exacto y marcadores azules para librerías.
    *   **Área de Visión:** El mapa se actualiza automáticamente al desplazarse, buscando nuevos puntos de interés en la vista actual.
*   **🧩 Diseño Académico Híbrido:** Una solución que combina APIs de Google con herramientas Open Source para una implementación libre de bloqueos por facturación o tarjetas de crédito.

---

## 🛠️ Tecnologías Utilizadas

*   **HTML5 / CSS3 (Vanilla):** Diseño responsivo con efectos de desenfosque y gradientes modernos.
*   **JavaScript (ES6):** Manejo de promesas paralelas (`Promise.all`), sistema de *Debounce* para optimizar llamadas a APIs y manipulación dinámica del DOM.
*   **Leaflet.js:** Librería de mapas ligera y extensible.
*   **Photon API (Komoot):** Motor de búsqueda geográfica basado en OpenStreetMap sin restricciones de CORS.

---

## ⚙️ Guía de Uso para Desarrolladores

Para que las funcionalidades de Google funcionen correctamente en tu entorno local, sigue estos pasos:

### 1. Obtener API Key de YouTube
1.  Ingresa a [Google Cloud Console](https://console.cloud.google.com/).
2.  Crea un proyecto y habilita la **YouTube Data API v3**.
3.  Crea una **API Key** y agrégala en el archivo `app.js` en la variable:
    `const YOUTUBE_API_KEY = 'TU_CLAVE_AQUI';`

### 2. Ejecutar Localmente
Simplemente abre el archivo `index.html` en cualquier navegador moderno o utiliza un servidor local sencillo como:
```bash
# Ejemplo con Python
python -m http.server 8080
```

### 3. Mapa Dinámico
**Nota Importante:** A diferencia de Google Maps, el mapa utilizado en este proyecto **no requiere tarjeta de crédito ni facturación**. Funcionará de inmediato para cualquier usuario que clone el repositorio.

---

## 👨‍💻 Autor
Proyecto desarrollado para la actividad de Integración de Servicios Web.

---

## 📄 Licencia
Este proyecto se distribuye bajo fines académicos y de aprendizaje con código abierto.
