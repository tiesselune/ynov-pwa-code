const FILE_CACHE_NAME = "files";
const FILE_CACHE_VERSION = "3";
const FILE_CACHE_HANDLE = `${FILE_CACHE_NAME}-${FILE_CACHE_VERSION}`;
const DOG_CACHE_NAME = "dogs";
const DOGS_IN_CACHE = 14;
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
};

const clearUnusedCaches = async () => {
    const keys = await caches.keys();
    const promises = [];
    const cachesInUse = [FILE_CACHE_HANDLE, DOG_CACHE_NAME];
    for(const key of keys){
        if(!cachesInUse.includes(key)){
            promises.push(caches.delete(key));
        }
    }
    await Promise.all(promises);
};



self.addEventListener("install", (event) => {
    event.waitUntil(cacheFiles())
});

self.addEventListener("activate",(event) => {
    event.waitUntil(clearUnusedCaches());
})

self.addEventListener("fetch", (event) => {
    event.respondWith(getResponse(event.request));
});

self.addEventListener('push', (event) => {
    const message = event.data.json();
    self.registration.showNotification(message.woof, { body : "The app has barked at you!", icon : "/assets/icon_maskable.png", badge : "/assets/logo.svg", actions : [ {"action" : "action1", "title" : "Action 1"},  {"action" : "action2", "title" : "Action 2"}]});
});

self.addEventListener("notificationclick", (event) => {
    event.preventDefault();
    event.notification.close();
    if(event.action){
        event.waitUntil(self.clients.openWindow(`/?origin=${event.action}`));
    }
    else{
        event.waitUntil(self.clients.openWindow("/?origin=noaction"));
    }
    
});