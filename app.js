// --- Configuración de APIs ---
// NOTA: Para YouTube y Google Maps es necesario usar una API Key válida.
// Reemplaza 'TU_API_KEY_AQUI' en el index.html para Maps, y aquí para YouTube.
const YOUTUBE_API_KEY = 'AIzaSyCoxmFqHReT4v2Nx7zr8d44kVvOYuc0ojo';

// --- Variables Mapa (Leaflet) ---
let map;
let markersLayer;
let userMarker;

// --- Elementos del DOM ---
const globalSearchBtn = document.getElementById('global-search-btn');
const globalSearchInput = document.getElementById('global-search-input');

const booksResults = document.getElementById('books-results');
const videoResults = document.getElementById('video-results');

// Manejador del botón global
globalSearchBtn.addEventListener('click', () => {
    const query = globalSearchInput.value.trim();
    if (!query) {
        alert('Por favor ingresa un término de búsqueda.');
        return;
    }
    
    // Lanzar ambas búsquedas simultáneamente
    fetchBooks(query);
    
    if (YOUTUBE_API_KEY === 'TU_YOUTUBE_API_KEY_AQUI') {
        videoResults.innerHTML = '<div class="placeholder-text" style="color: #fbbf24;">⚠️ Debes configurar tu YouTube API Key en app.js</div>';
    } else {
        fetchYouTubeVideo(query);
    }
    
    // Buscar librerías relacionadas o cercanas en el mapa
    findBookstores(query);
});

// ==========================================
// Funciones de Lógica de Mapa (Places) para incluir los bookmarks
// ==========================================
function findBookstores(query) {
    if (!map) return;
    
    // Limpiar marcadores previos del mapa
    if (markersLayer) {
        markersLayer.clearLayers();
    } else {
        markersLayer = L.layerGroup().addTo(map);
    }
    
    console.log("Iniciando búsqueda en mapa (Leaflet/Nominatim) para:", query);
    
    // Construimos la URL de búsqueda (Usamos Nominatim de OSM - Gratis y sin Key)
    // Agregamos 'Bogota Colombia' para forzar la búsqueda en el área local
    const searchUrl = `https://nominatim.openstreetmap.org/search?format=json&q=libreria+${encodeURIComponent(query)}+Bogota+Colombia&limit=20`;

    fetch(searchUrl)
        .then(response => response.json())
        .then(results => {
            console.log("Resultados Nominatim:", results);
            
            if (results && results.length > 0) {
                const group = [];

                results.forEach(place => {
                    const lat = parseFloat(place.lat);
                    const lon = parseFloat(place.lon);
                    
                    const marker = L.marker([lat, lon])
                        .bindPopup(`<b>${place.display_name.split(',')[0]}</b><br>${place.display_name}`)
                        .addTo(markersLayer);
                    
                    group.push([lat, lon]);
                });

                // Ajustar el zoom para ver todos los marcadores nuevos
                const bounds = L.latLngBounds(group);
                map.fitBounds(bounds, { padding: [50, 50] });

            } else {
                console.log("No se encontraron librerías específicas, intentando búsqueda genérica cercana...");
                // Búsqueda genérica si no hay resultados específicos
                const center = map.getCenter();
                const fallbackUrl = `https://nominatim.openstreetmap.org/search?format=json&q=libreria&bounded=1&viewbox=${center.lng-0.1},${center.lat+0.1},${center.lng+0.1},${center.lat-0.1}&limit=5`;
                
                fetch(fallbackUrl)
                    .then(r => r.json())
                    .then(fallbackResults => {
                        fallbackResults.forEach(place => {
                            L.marker([place.lat, place.lon])
                                .bindPopup(`<b>Librería Cercana</b><br>${place.display_name}`)
                                .addTo(markersLayer);
                        });
                    });
            }
        })
        .catch(error => {
            console.error("Error en búsqueda Nominatim:", error);
            alert("Error al buscar en el mapa. Revisa tu conexión.");
        });
}

// ==========================================
// 1. Google Books API
// ==========================================
async function fetchBooks(query) {
    // Mostrar loader
    booksResults.innerHTML = '<div class="loader"></div>';
    
    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=5`);
        if (!response.ok) throw new Error('Error al buscar libros');
        
        const data = await response.json();
        displayBooks(data.items);
    } catch (error) {
        booksResults.innerHTML = `<div class="placeholder-text" style="color: #ef4444;">Error: ${error.message}</div>`;
    }
}

function displayBooks(books) {
    if (!books || books.length === 0) {
        booksResults.innerHTML = '<div class="placeholder-text">No se encontraron libros para esta búsqueda.</div>';
        return;
    }

    booksResults.innerHTML = books.map(book => {
        const info = book.volumeInfo;
        const thumbnail = info.imageLinks?.smallThumbnail || 'https://via.placeholder.com/60x90?text=Sin+Imagen';
        const title = info.title || 'Título Desconocido';
        const publishedDate = info.publishedDate || 'Fecha desconocida';
        const previewLink = info.previewLink || '#';

        return `
            <div class="book-item">
                <img src="${thumbnail}" alt="Portada de ${title}">
                <div class="book-info">
                    <h4>${title}</h4>
                    <p>Publicado: ${publishedDate}</p>
                    <a href="${previewLink}" target="_blank">Ver previa</a>
                </div>
            </div>
        `;
    }).join('');
}


// ==========================================
// 2. YouTube Data API v3
// ==========================================

async function fetchYouTubeVideo(query) {
    videoResults.innerHTML = '<div class="loader"></div>';

    try {
        // Incrementamos maxResults a 3 para mostrar más videos
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&videoEmbeddable=true&maxResults=3&key=${YOUTUBE_API_KEY}`);
        if (!response.ok) throw new Error('Error al buscar video');

        const data = await response.json();
        if (data.items && data.items.length > 0) {
            videoResults.innerHTML = data.items.map(item => {
                const videoId = item.id?.videoId;
                if (!videoId) return '';
                const title = item.snippet?.title || 'Video de YouTube';
                
                return `
                    <div style="margin-bottom: 1rem;">
                        <iframe class="video-frame" 
                                src="https://www.youtube-nocookie.com/embed/${videoId}?origin=${window.location.origin}" 
                                title="${title}" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen>
                        </iframe>
                    </div>
                `;
            }).join('');
        } else {
            videoResults.innerHTML = '<div class="placeholder-text">No se encontraron videos.</div>';
        }
    } catch (error) {
        videoResults.innerHTML = `<div class="placeholder-text" style="color: #ef4444;">Error: ${error.message}</div>`;
    }
}


// ==========================================
// 3. Google Maps API
// ==========================================
// Esta función es llamada automáticamente por el script de Google Maps en el index.html usando el parámetro callback=initMap
// --- Función de Inicialización ---
function initMap() {
    const defaultCoords = [4.6097, -74.0817]; // Bogotá
    
    // Inicializar el mapa de Leaflet
    map = L.map('map').setView(defaultCoords, 13);

    // Cargar capa de mapa (OpenStreetMap CartoDB DarkMatter para mantener estética oscura)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    // Capa para marcadores de búsqueda
    markersLayer = L.layerGroup().addTo(map);

    // Marcador de referencia (Principal)
    userMarker = L.marker(defaultCoords).addTo(map)
        .bindPopup('<b>Ubicación de Referencia</b><br>Tú estás aquí.')
        .openPopup();
}

// Inicializar automáticamente al cargar el script
document.addEventListener('DOMContentLoaded', initMap);
