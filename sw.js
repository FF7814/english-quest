/* 英语启航 - 离线缓存 Service Worker
 * 策略：网络优先、离线回退缓存。只要联网打开就是最新版本，断网时用已缓存的内容离线使用。
 */
const CACHE = 'englishquest-v32';
const FILES = [
  './',
  './index.html',
  './css/style.css',
  './js/cet4.js',
  './js/cet4_exam.js',
  './js/data.js',
  './js/app.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({ type: 'window' }).then(cs => cs.forEach(c => {
        try { c.postMessage({ type: 'NEW_VERSION' }); } catch (err) {}
      })))
  );
});
self.addEventListener('message', e => {
  if (e && e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  let url;
  try { url = new URL(e.request.url); } catch (err) { return; }
  if (url.origin !== self.location.origin) return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res && res.status === 200 && res.type === 'basic') {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      }
      return res;
    }).catch(() =>
      caches.match(e.request, { ignoreSearch: true })
        .then(r => r || caches.match('./index.html'))
    )
  );
});
