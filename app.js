// --- Configuración de APIs ---
// NOTA: Para YouTube y Google Maps es necesario usar una API Key válida.
// Reemplaza 'TU_API_KEY_AQUI' en el index.html para Maps, y aquí para YouTube.
const YOUTUBE_API_KEY = 'TU_YOUTUBE_API_KEY_AQUI';

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
    
    if (markersLayer) {
        markersLayer.clearLayers();
    } else {
        markersLayer = L.layerGroup().addTo(map);
    }
    
    const bounds = map.getBounds();
    const north = bounds.getNorth();
    const south = bounds.getSouth();
    const east = bounds.getEast();
    const west = bounds.getWest();

    console.log(`Buscando librerías dinámicamente para: "${query}"...`);
    
    // Cambiamos a Photon (Komoot) - API mucho más flexible con CORS y límites de uso
    // bbox format: minLon, minLat, maxLon, maxLat
    const searchUrl = `https://photon.komoot.io/api/?q=libreria&bbox=${west},${south},${east},${north}&limit=15`;

    fetch(searchUrl)
        .then(response => response.json())
        .then(data => {
            const results = data.features || [];
            console.log(`Photon encontró ${results.length} librerías.`);
            
            if (results.length > 0) {
                results.forEach(feature => {
                    const [lon, lat] = feature.geometry.coordinates;
                    const props = feature.properties;
                    const name = props.name || "Librería";
                    const street = props.street || "";
                    const house = props.housenumber || "";
                    const city = props.city || "";
                    const address = `${street} ${house}`.trim() || city || "Dirección no disponible";
                    const phone = props.phone || "";
                    const website = props.website || props.url || "";
                    
                    L.marker([lat, lon])
                        .bindPopup(`
                            <div style="min-width: 220px; font-family: 'Inter', sans-serif; padding: 5px;">
                                <h3 style="color: #1a56db; font-size: 1.1rem; margin: 0 0 10px 0; font-weight: 700;">${name}</h3>
                                <div style="font-size: 0.85rem; color: #4b5563; line-height: 1.6;">
                                    <p style="margin: 5px 0;">📍 <b>Dirección:</b> ${address}</p>
                                    ${phone ? `<p style="margin: 5px 0;">📞 <b>Teléfono:</b> <a href="tel:${phone}" style="color: #2563eb; text-decoration: none;">${phone}</a></p>` : ''}
                                    ${website ? `<p style="margin: 12px 0 5px 0;"><a href="${website}" target="_blank" style="background: #2563eb; color: white; padding: 8px 12px; border-radius: 6px; text-decoration: none; display: inline-block; font-weight: 600; text-align: center; width: 100%; box-sizing: border-box;">🌐 Visitar Página Web</a></p>` : ''}
                                </div>
                                <div style="margin-top: 15px; border-top: 1px solid #e5e7eb; padding-top: 10px; font-size: 0.75rem; color: #9ca3af; font-style: italic; text-align: center;">
                                    Recomendado para: <strong>${query}</strong>
                                </div>
                            </div>
                        `)
                        .addTo(markersLayer);
                });
            } else {
                console.log("No hay librerías en esta vista exacta. Mueve el mapa para buscar en otra zona.");
            }
        })
        .catch(error => {
            console.error("Error en búsqueda Photon:", error);
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

    // Actualizar búsqueda automáticamente cuando el mapa se mueva (con Debounce)
    let moveTimeout;
    map.on('moveend', () => {
        const query = globalSearchInput.value.trim();
        if (query) {
            clearTimeout(moveTimeout);
            moveTimeout = setTimeout(() => {
                console.log("Mapa movido y quieto, refrescando marcadores...");
                findBookstores(query);
            }, 1000); // Esperamos 1000ms después de que dejó de moverse
        }
    });
}

// Inicializar automáticamente al cargar el script
document.addEventListener('DOMContentLoaded', initMap);
