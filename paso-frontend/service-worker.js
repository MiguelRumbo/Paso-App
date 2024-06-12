const CACHE_NAME = 'paso-app-cache-v1';
const urlsToCache = [
    '/PASO-APP/',
    '/PASO-APP/index.html',
    '/PASO-APP/paso-frontend/pages/signup.html',
    '/PASO-APP/paso-frontend/pages/signup_email.html',
    '/PASO-APP/paso-frontend/pages/signup_password.html',
    '/PASO-APP/manifest.json',
    '/PASO-APP/paso-frontend/Icons/Logo-192.png',
    '/PASO-APP/paso-frontend/Icons/Logo.svg',
    '/PASO-APP/paso-frontend/Icons/Logo-512.png'
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
