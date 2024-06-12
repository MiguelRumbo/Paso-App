const CACHE_NAME = 'paso-app-cache-v1';
const urlsToCache = [
    '/Paso-App/',
    '/Paso-App/index.html',
    '/Paso-App/paso-frontend/pages/register.html',
    '/Paso-App/paso-frontend/pages/register_email.html',
    '/Paso-App/paso-frontend/pages/register_password.html',
    '/Paso-App/paso-frontend/pages/register_profile.html',
    '/Paso-App/paso-frontend/pages/login.html',
    '/Paso-App/paso-frontend/pages/dashboard.html',
    '/Paso-App/manifest.json',
    '/Paso-App/paso-frontend/Icons/Logo-192.png',
    '/Paso-App/paso-frontend/Icons/Logo.svg',
    '/Paso-App/paso-frontend/Icons/Logo-512.png',
    '/Paso-App/paso-backend/login.js',
    '/Paso-App/paso-backend/register.js'
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
