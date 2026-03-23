# Guía del Estudiante: Proyecto de Integración de 3 APIs

¡Bienvenido! Esta guía te ayudará a completar la actividad académica de integrar y consumir al menos 3 servicios web (APIs). Para este proyecto, hemos implementado una solución **híbrida** que combina servicios de Google con herramientas de Código Abierto (Open Source) para evitar problemas de facturación o necesidad de tarjetas de crédito.

## 🛠️ Tecnologías Aplicadas
1.  **Google Books API:** Para búsqueda de libros (Acceso público).
2.  **YouTube Data API v3:** Para visualización de videos relacionados (Requiere API Key).
3.  **Leaflet + Photon (OpenStreetMap):** Para el mapa interactivo y búsqueda de librerías locales (Gratuito, sin tarjeta).

---

## Paso 1: Obtener la credencial de YouTube
Para que la sección de videos funcione, necesitas una "API Key" de Google Cloud:

1.  Ingresa a [Google Cloud Console](https://console.cloud.google.com/).
2.  Crea un **Proyecto Nuevo** (ej. "Actividad APIs").
3.  Habilita la **YouTube Data API v3** en la biblioteca de APIs.
4.  Ve a **Credenciales > Crear Credenciales > Clave de API**.
5.  Copia la clave generada y pégala en el archivo `app.js` en la variable:
    `const YOUTUBE_API_KEY = 'TU_CLAVE_AQUI';`

---

## Paso 2: El Mapa Inteligente (Leaflet + Photon)
A diferencia de Google Maps, **esta implementación no requiere que registres una tarjeta de crédito**.
*   **Búsqueda Dual:** La aplicación busca simultáneamente tu término exacto (ej: UMB) y librerías en la zona.
*   **Iconos Diferenciados:** 
    *   **🟠 Marcador Naranja (Pulsante):** Indica el lugar exacto que buscaste.
    *   **🔵 Marcador Azul (Librerías):** Indica las librerías cercanas.
*   **Dato Clave:** El mapa se actualiza automáticamente al moverlo por la interfaz gracias a un sistema de *Debounce* que optimiza las peticiones asíncronas.

---

## Paso 3: Estructura de tu Presentación (Video de 3-5 min)

Para tu exposición o video, te sugiero este orden:

### 1. Introducción (30 seg)
*   Muestra tu nombre y el objetivo: "Desarrollo de una aplicación web dinámica que consume servicios de terceros mediante peticiones asíncronas (fetch)".
*   Menciona por qué elegiste esta combinación de APIs.

### 2. Demostración Técnica (2-3 min)
*   **Google Books:** Realiza una búsqueda (ej: "Robert Greene") y muestra cómo los resultados cargan al instante.
*   **YouTube:** Muestra los videos incrustados y explica que usaste una clave de API autenticada.
*   **Mapa Interactivo:** ¡Esta es la parte fuerte! Muestra cómo al mover el mapa por Bogotá aparecen marcadores de librerías con:
    *   Nombre de la librería.
    *   Dirección y Ciudad.
    *   Teléfono interactivo.
    *   Botón para visitar su página web oficial.
*   **Explicación técnica:** "Implementé un mapa con Leaflet para evitar las barreras de facturación de Google Maps, integrando Photon para búsquedas geográficas en tiempo real".

### 3. Conclusiones y Retos (1 min)
*   Habla sobre el reto de manejar errores como el **CORS** o el límite de peticiones (**429**), y cómo lo solucionaste cambiando de Nominatim a Photon.
*   Menciona la importancia de la experiencia de usuario (diseño *Glassmorphism* y mapas responsivos).

---

## 🚀 Repositorio del Proyecto
Tu código fue cargado y sincronizado en GitHub:
[https://github.com/JuanPardoPrdo/Integracion-3-APIs](https://github.com/JuanPardoPrdo/Integracion-3-APIs)

