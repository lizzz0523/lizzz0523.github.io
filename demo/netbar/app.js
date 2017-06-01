let cacheKey = "netbar-app-6";
let cacheList = [
    "install.html",
    "index.html",
    "assets/css/common.css",
    "assets/css/index.css",
    "assets/img/banner.jpg",
    "assets/img/food.jpg",
    "assets/img/index.png",
    "assets/img/netbar1.jpg",
    "assets/img/netbar2.jpg",
    "assets/img/netbar3.jpg",
    "assets/img/netbar4.jpg",
    "assets/img/netbar5.jpg",
    "assets/img/netbar6.jpg",
    "assets/img/netbar7.jpg",
    "assets/img/netbar8.png",
    "assets/img/netbar9.jpg",
    "assets/img/netbar10.jpg"
];

self.addEventListener("install", function (event) {
    event.waitUntil(
        caches
            .open(cacheKey)
            .then(function (cache) {
                cache.addAll(cacheList)
            })
    );
});

self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches
        .keys()
        .then(function (keys) {
            return Promise.all(
                keys.map(function (key) {
                    if (key !== cacheKey) {
                        return caches.delete(key);
                    } else {
                        return Promise.resolve();
                    }
                })
            );
        })
    );
});

self.addEventListener("fetch", function (event) {
    var request = event.request;
    var url = request.url;

    var match = url.match(/^https:\/\/lizzz0523.github.io\/demo\/netbar\/(.*)$/);
    if (!match) return;

    var path = match[1];

    if (cacheList.indexOf(path) > -1) {
        event.respondWith(
            respondWithCache(request)
        );
    }
});

self.addEventListener("message", function (event) {
    var name = event.data.name;

    if (name === "hello") {
        self.clients.get(event.source.id).then(function (client) {
            client.postMessage({
                name: "hello",
                user: "world"
            });
        });
    }
});

function respondWithCache(request) {
    return caches
    .match(request)
    .then(function (response) {
        if (!response) {
            throw Error("no response");
        }

        return response.clone();
    })
    .catch(function () {
        var req = request.clone();

        return fetch(req)
        .then(function (res) {
            if (!res || res.status != 200 || res.type != "basic") {
                return res;
            } else {
                var response = res.clone();

                return caches
                .open(cacheKey)
                .then(function (cache) {
                    return cache.put(request, response);
                })
                .then(function () {
                    return res;
                });
            }
        });
    });
}