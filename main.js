import { loadTechnologies } from "./js/loader.js";
import { registerServiceWorker } from "./js/swRegister.js";
import { notifier } from "./js/notification.js";

const technosDiv = document.querySelector('#technos');
const url = 'http://localhost:3001/technos'



loadTechnologies(technosDiv, url);
registerServiceWorker()


notifier('Veille-Tech', 'Super promo en cours')



