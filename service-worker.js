// Service worker do mural GET.
// Guarda o "esqueleto" do app e o alvo (.mind) para abrir mais rápido.
// O vídeo NÃO é guardado aqui (o navegador já faz cache dele).
const CACHE = 'get-v1';
const ARQUIVOS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './targets.mind',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (req.headers.has('range') || req.url.endsWith('.mp4')) return; // vídeo: direto da rede

  // Rede primeiro (pega atualizações); se estiver offline, usa o cache.
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.ok && (res.type === 'basic' || res.type === 'cors')) {
          const copia = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copia));
        }
        return res;
      })
      .catch(() => caches.match(req))
  );
});
