// Si cambias index.html, subí el número de versión para que los celulares se actualicen.
const C='mi-entreno-v19',SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const q=e.request;
  if(q.method!=='GET')return;
  if(/open-meteo\.com$|nolaborables\.com\.ar$/.test(new URL(q.url).hostname))return; // el clima siempre en vivo
  const save=r=>{if(r.ok||r.type==='opaque'){const cp=r.clone();caches.open(C).then(c=>c.put(q,cp))}return r};
  if(q.mode==='navigate'){ // la app: primero la versión nueva de internet, si no hay, la guardada
    e.respondWith(fetch(q).then(save).catch(()=>caches.match('index.html')));return}
  e.respondWith(caches.match(q).then(h=>h||fetch(q).then(save).catch(()=>caches.match('index.html'))));
});
