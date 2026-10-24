const C = 'math-stars-v1';
const CDN = [
  'https://cdn.tailwindcss.com/3.4.17',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/js/all.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/canvas-confetti/1.9.3/confetti.browser.min.js'
];
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(C).then(async c => {
    await c.add(new Request(self.registration.scope, {cache: 'reload'})).catch(() => {});
    await Promise.all(CDN.map(u => fetch(u, {mode: 'no-cors'}).then(r => c.put(u, r)).catch(() => {})));
  }));
});
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim())
));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, {ignoreSearch: true}).then(hit => hit || fetch(e.request).then(res => {
    if (res && (res.ok || res.type === 'opaque')) { const cp = res.clone(); caches.open(C).then(c => c.put(e.request, cp)); }
    return res;
  }).catch(() => e.request.mode === 'navigate' ? caches.match(self.registration.scope) : undefined)));
});
