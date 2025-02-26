const CACHE_NAME = 'paso-app-cache-v1';
const urlsToCache = [
    '/Paso-App/',
    '/Paso-App/index.html',
    '/Paso-App/paso-frontend/pages/dashboard.html',
    '/Paso-App/paso-frontend/pages/detail_travel.html',
    '/Paso-App/paso-frontend/pages/login.html',
    '/Paso-App/paso-frontend/pages/new_order.html',
    '/Paso-App/paso-frontend/pages/new_travel.html',
    '/Paso-App/paso-frontend/pages/new.html',
    '/Paso-App/paso-frontend/pages/profile.html',
    '/Paso-App/paso-frontend/pages/register.html',
    '/Paso-App/paso-frontend/pages/signup.html',
    '/Paso-App/manifest.json',
    '/Paso-App/paso-frontend/Icons/Logo-192.png',
    '/Paso-App/paso-frontend/Icons/Logo.svg',
    '/Paso-App/paso-frontend/Icons/Logo-512.png',
    '/Paso-App/paso-frontend/Icons/Agregar.png',
    '/Paso-App/paso-frontend/Icons/Casa.png',
    '/Paso-App/paso-frontend/Icons/Discover.png',
    '/Paso-App/paso-frontend/Icons/Paso.png',
    '/Paso-App/paso-frontend/Icons/Perfil.png',
    '/Paso-App/paso-backend/dashboard.js',
    '/Paso-App/paso-backend/detail_travel.js',
    '/Paso-App/paso-backend/login.js',
    '/Paso-App/paso-backend/new_order.js',
    '/Paso-App/paso-backend/new_travel.js',
    '/Paso-App/paso-backend/profile.js',
    '/Paso-App/paso-backend/register.js',
    '/Paso-App/paso-backend/img/Cajeta.png',
    '/Paso-App/paso-backend/img/Chimichurri.png',
    '/Paso-App/paso-backend/img/Fresa.png',
    '/Paso-App/paso-backend/img/Yoli.png'
];

// Instalación del service worker y almacenamiento en caché de recursos
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activación del service worker y limpieza de cachés antiguas
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Intercepción de solicitudes de red y respuesta con recursos de la caché si están disponibles
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    return response; // Devuelve el recurso desde la caché
                }
                return fetch(event.request); // Realiza la solicitud a la red
            })
    );
});
