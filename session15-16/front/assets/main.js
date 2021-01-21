const url = "https://dog.ceo/api/breeds/image/random";
const img = document.querySelector("#picture");
const button = document.querySelector("#randomizer");

const getPicture = async () => {
    try {
        const response = await fetch(url);
        const json = await response.json();
        if(json.status === "success"){
            img.src = json.message;
        }
        else {
            console.error("API responded with error code.");
        }
    }
    catch(error){
        console.error("Could not fetch dog picture from API",error);
    }
}

getPicture();

button.addEventListener("click", getPicture);

if("serviceWorker" in navigator){
    navigator.serviceWorker.register("/sw.js").then((regObject) => {
        console.log("Registration done",regObject);
    })
    .catch((error) => {
        console.error("Could not register service worker",error);
    });
}

let promptEvent = null;
const installButton = document.querySelector("#installButton");

window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    promptEvent = e;
    installButton.classList.remove("hidden");
    promptEvent.userChoice.then((choiceObject) => {
        if(choiceObject.outcome === "accepted"){
            installButton.classList.add("hidden");
        }
    });
});

installButton.addEventListener("click", () => {
    if(promptEvent){
        promptEvent.prompt();
    }
});

const notifyButton = document.querySelector("#notifyButton");

const publicVKey = "BGNpZuF8IDFzK-E24HbhtMPiqXGq9mqNHhmIXvQwjI-lPeyeqK_V1tiIxSBOmSydspJFdQIYF2vOXnjd5juRj_o";

const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

notifyButton.addEventListener("click", async (e) => {
    if(!('serviceWorker' in navigator)) return;
    const registration = await navigator.serviceWorker.ready;
    try {
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly : true, 
            applicationServerKey : urlBase64ToUint8Array(publicVKey)
        });
        await fetch("/subscription", { method : "POST", body : JSON.stringify(subscription), headers : {'content-type' : "application/json"}});
    }
    catch(e){
        console.log("La souscription a été refusée");
    }
    
});

/*const showNotification = () => {
    const notif = new Notification("Woof!",{ body : "The app has barked at you!", icon : "/assets/icon_maskable.png", badge : "/assets/logo.svg", actions : [ {"action" : "action1", "title" : "Action 1"},  {"action" : "action2", "title" : "Action 2"}]});
    notif.addEventListener("click", (e) => {
        window.open("/?woof=bark","_blank");
    });
}*/