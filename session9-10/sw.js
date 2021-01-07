const FILE_CACHE_NAME = "files";
const FILE_CACHE_VERSION = "1";
const FILE_CACHE_HANDLE = `${FILE_CACHE_NAME}-${FILE_CACHE_VERSION}`;
const DOG_CACHE_NAME = "dogs";
const DOGS_IN_CACHE = 10;
const DOG_URL = "https://dog.ceo/api/breeds/image/random";
const appShell = [
    "/",
    "/assets/main.js",
    "/assets/style.css",
    "/assets/logo.svg",
];

const cacheDogs = async () => {
    const requestsP = [];
    for(let i = 0 ; i< DOGS_IN_CACHE; i++){
        requestsP.push(
            fetch(DOG_URL)
            .then((response) => response.json())
            .then((json) => fetch(json.message))
        );
    }
    const dogsResponses = await Promise.all(requestsP);
    const cacheDogs = [];
    const dogCache = await caches.open(DOG_CACHE_NAME);
    for(let i = 0; i < dogsResponses.length; i++){
        cacheDogs.push(dogCache.put(`/dogs/${i + 1}`,dogsResponses[i]));
    }
    await Promise.all(cacheDogs);
};

const cacheFiles = async () => {
    const fileCache = await caches.open(FILE_CACHE_HANDLE);
    await fileCache.addAll(appShell);
    await cacheDogs();
};

const getResponse = async (req) => {
    if(!navigator.onLine && req.url === DOG_URL){
        const rand = Math.ceil(Math.random() * DOGS_IN_CACHE);
        const responseBody = { status : "success", message : `/dogs/${rand}`};
        return new Response(JSON.stringify(responseBody));
    }
    const response = await caches.match(req);
    if(response){
        return response;
    }
    else {
        return fetch(req);
    }
}

self.addEventListener("install", (event) => {
    console.log("Installing");
    event.waitUntil(cacheFiles())
});

self.addEventListener("fetch", (event) => {
    event.respondWith(getResponse(event.request));
});