/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 */
workbox.core.setCacheNameDetails({ prefix: "vocabularyapp" });

workbox.core.skipWaiting();

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL("index.html"));

workbox.routing.registerRoute(/\.*/, new workbox.strategies.NetworkFirst(), "GET");

self.addEventListener("notificationclick", function(event) {
    const targetUrl = new URL("./#/" + event.notification.tag.split("|")[0], location).href;
    event.notification.close();
    console.log("in handler, i suppose", targetUrl, location);
    event.waitUntil(
        clients.matchAll().then(matchedClients => {
            for (let client of matchedClients) {
                if (client.url.indexOf(targetUrl) >= 0) {
                    return client.focus();
                }
            }

            return clients.openWindow(targetUrl).then(function(client) {
                client.focus();
            });
        })
    );
});
