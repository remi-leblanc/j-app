var cacheName = 'j-app-v1.0.0';
var contentToCache = [
	"/",
];

self.addEventListener('install', (e) => {

});

self.addEventListener('install', (e) => {
	e.waitUntil(
		caches.open(cacheName).then((cache) => {
			return cache.addAll(contentToCache);
		})
	);
});

self.addEventListener('fetch', (e) => {
	e.respondWith(
		caches.match(e.request).then((r) => {
			return r || fetch(e.request).then((response) => {
				return caches.open(cacheName).then((cache) => {
					cache.put(e.request, response.clone());
					return response;
				});
			});
		})
	);
});

self.addEventListener('activate', (e) => {
	e.waitUntil(
		caches.keys().then((keyList) => {
			return Promise.all(keyList.map((key) => {
				if(cacheName.indexOf(key) === -1) {
					return caches.delete(key);
				}
			}));
		})
	);
});