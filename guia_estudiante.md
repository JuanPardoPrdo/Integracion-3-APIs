# Guía del Estudiante: Integración de 3 APIs de Google

¡Bienvenido! Esta guía te ayudará a completar la actividad académica de integrar y consumir al menos 3 servicios web (APIs) proporcionados por Google.

## Paso 1: Obtener las credenciales (API Keys)

Para que los servicios de Google Maps y YouTube funcionen en esta aplicación, necesitas generar una "API Key" desde Google Cloud Console.

1. Ingresa a [Google Cloud Console](https://console.cloud.google.com/).
2. Crea un **Proyecto Nuevo** (ej. "Actividad APIs Google").
3. Ve a la sección **APIs y Servicios > Biblioteca habilitada**.
4. Busca y habilita las siguientes APIs:
   - **YouTube Data API v3**
   - **Maps JavaScript API**
   - (La *Google Books API* no requiere habilitación estricta para búsquedas públicas básicas, pero puedes habilitarla también).
5. Ve a **APIs y Servicios > Credenciales**.
6. Haz clic en **Crear Credenciales > Clave de API**.
7. Copia la clave generada. ```AIzaSyCoxmFqHReT4v2Nx7zr8d44kVvOYuc0ojo```

## Paso 2: Configurar tu Proyecto Local

1. Abre el archivo `index.html`.
2. Busca la etiqueta `<script>` cerca del final del archivo que contiene `https://maps.googleapis.com/maps/api/js?key=TU_API_KEY_AQUI&callback=initMap`.
3. Reemplaza `TU_API_KEY_AQUI` por tu clave de API generada.
4. Abre el archivo `app.js`.
5. En la línea 4, busca `const YOUTUBE_API_KEY = 'TU_YOUTUBE_API_KEY_AQUI';`.
6. Reemplaza `TU_YOUTUBE_API_KEY_AQUI` por tu misma clave de API de Google.

> **¡Importante!** Por motivos de seguridad, nunca subas tu API Key a repositorios públicos como GitHub sin restricciones.

## Paso 3: Probando la Aplicación

Abre el archivo `index.html` en tu navegador web.
1. **Búsqueda Global:** Ingresa un término general en la barra principal (ej. "Inteligencia Artificial") y haz clic en "Buscar en API".
2. Verifica que las secciones de **Google Books** y **YouTube** muestren resultados relacionados simultáneamente.
3. **Google Maps:** Desplázate a la sección del mapa y comprueba que cargue correctamente sin mensajes de error de desarrollo.

---

## Sugerencia de Guion para el Video (3 minutos)

Para cumplir con el requerimiento de grabar un video mostrando la funcionalidad:

**[0:00 - 0:30] Portada e Introducción**
- Muestra una diapositiva o la pantalla de inicio con tu nombre completo y programa.
- *"Hola, soy [Tu Nombre]. En este video presentaré la actividad de integración de tres APIs de Google, desarrolladas con HTML, CSS y JavaScript Vanilla."*

**[0:30 - 2:00] Demostración de las APIs (Desarrollo)**
- Muestra la página web funcionando.
- *"Como podemos observar, el sitio incluye tres secciones:"*
- **Búsqueda Global:** *"Como podemos observar, he implementado una barra de búsqueda global. Al ingresar un tema, se realizan dos peticiones `fetch` de forma simultánea."* (Muestra cómo hacer una búsqueda).
- **Books y YouTube:** *"Una petición va al API de Google Books que devuelve los libros relacionados, y la otra a la YouTube Data API v3 usando mi API Key para insertar un video embebido en iframe."* (Muestra cómo carga y reprodúcelo unos segundos).
- **Maps:** *"Finalmente, el Google Maps JavaScript API. Está incrustado aquí mostrando unas coordenadas de referencia. Modifiqué los estilos del mapa para que combinen con el diseño 'Glassmorphism' oscuro de la página."*

**[2:00 - 3:00] Conclusiones y Despedida**
- *"La integración de estas APIs demuestra cómo podemos enriquecer un frontend estático obteniendo datos en tiempo real de servicios de terceros."*
- *"Una de las principales ventajas fue poder unificar todo bajo una misma interfaz dinámica."*
- *"Muchas gracias por su atención."*
