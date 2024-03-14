'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "6b69313efa8c4e6dfcca84fdd6a07bc0",
"assets/AssetManifest.bin.json": "6cf49a3d2d56b025caf42cb00f7390c1",
"assets/AssetManifest.json": "59be37ce9fe631d0bbedec6eb4d83886",
"assets/assets/images/add_friend_icon.jpg": "068fbab83e3c2f2ee628edf215372ad9",
"assets/assets/images/back_icon.jpg": "1805f63b3cc6a4160c7a5131c644ea57",
"assets/assets/images/book_mark_off_icon.jpg": "e70373a9e7074daa8dc14d78765246d5",
"assets/assets/images/book_mark_on_icon.jpg": "ec2d2537f30435292f6058f58f18cb09",
"assets/assets/images/bottom_nav_active_off_icon.jpg": "8efdb0b024bfc7ebedf9b98ba472d19e",
"assets/assets/images/bottom_nav_active_on_icon.jpg": "bd79cc1604d9b81d30f8a79594267aa1",
"assets/assets/images/bottom_nav_home_off_icon.jpg": "1d2241b368ead666465b8c121edea7e7",
"assets/assets/images/bottom_nav_home_on_icon.jpg": "d74fa93752b9fcfdb95c4cc91e9348f7",
"assets/assets/images/bottom_nav_search_off_icon.jpg": "4d005c2115fabcc090de0afbd552bc57",
"assets/assets/images/bottom_nav_search_on_icon.jpg": "e63084a48a1574a75c79133f049853ca",
"assets/assets/images/bottom_nav_upload_icon.jpg": "53117c0d498a52ca94ad57897cd19031",
"assets/assets/images/camera_icon.jpg": "bb5b672bb861d2a3589ad3049c50cf02",
"assets/assets/images/close_icon.jpg": "6ce65f21aeabbec13f1667efaeaa62f2",
"assets/assets/images/default_image.png": "cf89e8e6daa9dabc8174c303e4d53d3a",
"assets/assets/images/direct_msg_icon.jpg": "3c300648dd10a35aa3ba7476448f5a76",
"assets/assets/images/down_arrow_icon.jpg": "4281c5c0380e83279543b247135d5c61",
"assets/assets/images/grid_view_off_icon.jpg": "e1247572e65856fd8ccf5d0ee853aaeb",
"assets/assets/images/grid_view_on_icon.jpg": "648164aad586833aea8a61f3f88b28b0",
"assets/assets/images/image_select_icon.jpg": "5fe3e7fa6fec880b14551956834cf5f9",
"assets/assets/images/like_off_icon.jpg": "8dcb10a4c2e8e888423e78def647ec07",
"assets/assets/images/like_on_icon.jpg": "f1c4316fe48f95208935b26e0039c93d",
"assets/assets/images/logo.jpg": "cd64e495df52b39b9bedd443a33ef740",
"assets/assets/images/menu_icon.jpg": "fcd5fd28c47d85f656de7c41846a809f",
"assets/assets/images/more_icon.jpg": "d00816c82ea77bb2086c3c4de2985d37",
"assets/assets/images/mypage_bottom_sheet_01.jpg": "3d99ac50ce931baa2e2a3cb57cece337",
"assets/assets/images/mypage_bottom_sheet_02.jpg": "4d330cd51901342a82fa7c51a3829d87",
"assets/assets/images/mypage_bottom_sheet_03.jpg": "82d47aca64a977d87fa53c4500906839",
"assets/assets/images/mypage_bottom_sheet_04.jpg": "529e4d25e50e9b4564964a297639794b",
"assets/assets/images/mypage_bottom_sheet_05.jpg": "022608527beb96e3b14cda23c042b30d",
"assets/assets/images/mypage_bottom_sheet_setting_01.jpg": "ac7e8f18430e20861c16b82030c51967",
"assets/assets/images/mypage_bottom_sheet_setting_02.jpg": "322f99a1ff0c08d328f3f350a5cf42ee",
"assets/assets/images/mypage_bottom_sheet_setting_03.jpg": "37fe5dee683268e1a9592b69b7a76842",
"assets/assets/images/mypage_bottom_sheet_setting_04.jpg": "4cc9613cbad6a413c6bc7da28b8934c4",
"assets/assets/images/mypage_bottom_sheet_setting_05.jpg": "32600278c12e7475418152693caa14d6",
"assets/assets/images/mypage_bottom_sheet_setting_06.jpg": "395a286b675366d816f1ab94b45cd014",
"assets/assets/images/mypage_bottom_sheet_setting_07.jpg": "96a3005eeedd8906e075b6776ed047f4",
"assets/assets/images/my_tag_image_off_icon.jpg": "6e94c3b0bf504ce0ee9c855231db0cb2",
"assets/assets/images/my_tag_image_on_icon.jpg": "811d7b7c29ca77eb68c54e04ddf1c080",
"assets/assets/images/plus_icon.png": "c9cc14ccaa957c452233a5db2fec49bb",
"assets/assets/images/reply_icon.jpg": "c4ed0bfef5c478dd64ad73c0e9408124",
"assets/assets/images/upload_complete_icon.jpg": "30cfa2e1db4732c394880bc5612b7b2d",
"assets/assets/images/upload_next_icon.jpg": "9da835c076a6f4326e37b8ce74640a4d",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "0db35ae7a415370b89e807027510caf0",
"assets/NOTICES": "e11493562a924220476e4ece8314ccdb",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "c86fbd9e7b17accae76e5ad116583dc4",
"canvaskit/canvaskit.js.symbols": "38cba9233b92472a36ff011dc21c2c9f",
"canvaskit/canvaskit.wasm": "3d2a2d663e8c5111ac61a46367f751ac",
"canvaskit/chromium/canvaskit.js": "43787ac5098c648979c27c13c6f804c3",
"canvaskit/chromium/canvaskit.js.symbols": "4525682ef039faeb11f24f37436dca06",
"canvaskit/chromium/canvaskit.wasm": "f5934e694f12929ed56a671617acd254",
"canvaskit/skwasm.js": "445e9e400085faead4493be2224d95aa",
"canvaskit/skwasm.js.symbols": "741d50ffba71f89345996b0aa8426af8",
"canvaskit/skwasm.wasm": "e42815763c5d05bba43f9d0337fa7d84",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "c71a09214cb6f5f8996a531350400a9a",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "9da0611a67af122786ef86c6b4e74d22",
"/": "9da0611a67af122786ef86c6b4e74d22",
"main.dart.js": "20b31f2043e69262893a292413ce39be",
"manifest.json": "70a8adcb719c542a6d1175ce98af62a4",
"version.json": "b8743fc03b606fd70cd9d25471ae3aa3"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
