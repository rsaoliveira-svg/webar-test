// Service worker do mural.
// O nome do cache é criado automaticamente a partir da pasta do mural,
// então NÃO precisa editar nada aqui ao copiar o modelo.
// Para forçar a atualização de um mural já publicado, aumente VERSAO (v1 -> v2).
const VERSAO = 'v1';
const PREFIXO = 'mural:' + self.registration.scope + ':';
const CACHE = PREFIXO + VERSAO;

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
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => Promise.allSettled(ARQUIVOS.map((a) => c.add(a))))
      .then(() => self.skipWaiting())
  );
});

// Apaga só as versões antigas DESTE mural (não mexe nos outros murais).
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(
        ks.filter((k) => k.startsWith(PREFIXO) && k !== CACHE).map((k) => caches.delete(k))
      ))
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
