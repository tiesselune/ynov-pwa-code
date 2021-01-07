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