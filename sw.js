const cacheName = 'veille-techno-1.0'

const cacheContent = [
    'index.html',
    'main.js',
    'style.css',
    'vendors/bootstrap-4.min.css',
    'add_techno.html',
    'add_techno.js',
    'contact.html',
    'contact.js',
    'js/loader.js',
    'js/swRegister.js',
]

//action executer a l'intallation du worker
self.addEventListener('install', (evt)=> {
    console.log('installer',evt)
    self.skipWaiting();
    const preCache = async () => {
        const cache = await caches.open(cacheName);
        return cache.addAll(cacheContent);
      };
      evt.waitUntil(preCache());
})

//action exécuté a l'activation du worker
self.addEventListener('activate', (evt)=> {
    console.log('activé', evt)

    //supprimer les caches existant différent du cache courant
    const newCache = async () => {
        const currentCache = await caches.keys()
        .then(lastCache => {
            lastCache.forEach(c => {
                if(c !== cacheName) return caches.delete(c);
            })
        })
    }

    evt.waitUntil(newCache())
})

//action exécuté a la détection d'une requete
self.addEventListener('fetch' , (evt) => {
    // if(!navigator.onLine) {
    //     const headers = {headers: {'Content-Type': 'text/html; charset=utf-8'}}
    //     evt.respondWith(new Response('<h1>pas de connexion internet</h1>', headers))
    // }
    
    console.log('fetch', evt.request.url)

    //######## STRATEGIE 1 ##########
    //stratégie cache only with network fallback (on sert d'abord le cache et s'il n'y a pas on tente avec le reseau)
    function cacheBefore() {
        evt.respondWith(
            // on vérifie si la requete est déja dans le cache, si c'est le cas on retourne la reponse
            caches.match(evt.request).then(res => {
                if(res){
                    console.log(`%curl recupéré depuis le cache:  ${evt.request.url}`,'color: blue; background: green; font-size: 16px', res)
                    return res
                } 
                //on s'assure que la requete vient est bient une requete http (évite les érreur d'extension chrome)
                if (!(evt.request.url.indexOf('http') === 0)) return;
    
                // si la requete n'est pas inclus dans le cache existant on l'ajoute et on renvoi un clone
                return fetch(evt.request)
                .then(newResponse => {
                    console.log(`%curl rajouté au cache:  ${evt.request.url}`, 'color: green; background: blue; font-size: 16px' , res)
                    caches.open(cacheName)
                    .then(cache => cache.put(evt.request, newResponse));
                    return newResponse.clone();
                })
            })
        )
    }
    //cacheBefore() //execution de la premiere strategie
    //######## FIN STRATEGIE 1 ##########

    //######## STRATEGIE 2 ##########
    //stratégie network first with cache fallback (on sert d'abord via le reseau et s'il n'y a pas on tente avec le cache)
    function networkBefore() {
        evt.respondWith(
            // on vérifie si la requete est déja dans le cache, si c'est le cas on retourne la reponse
            caches.match(evt.request)
            .then(res => {
                console.log(`%c${evt.request.url} récupéré depuis le réseau`, 'color: red; background: blue')
                //on s'assure que la requete vient est bient une requete http (évite les érreur d'extension chrome)
                if (!(evt.request.url.indexOf('http') === 0)) return;
    
                // si la requete n'est pas inclus dans le cache existant on l'ajoute et on renvoi un clone
                return fetch(evt.request)
                .then(newResponse => {
                    console.log(`%curl rajouté au cache:  ${evt.request.url}`, 'color: black; background: orange')
                    caches.open(cacheName)
                    .then(cache => cache.put(evt.request, newResponse));
                    return newResponse.clone();
                })
            })
            .catch( err => {
                console.log(`%c${evt.request.url} récupéré depuis le cache`, 'color: blue; background: red')
                return caches.match(evt.request)
            } )
        )
    }
    networkBefore() //execution de la seconde strategie
    //######## FIN STRATEGIE 2 ##########    
})

// possibilité d'envoyer des notification meme hors de la navigation
// self.registration.showNotification('Notif depuis sw.js', {
//     body: 'je suis une notif dite "persistante"',
//     actions: [
//         {action: 'accept', title: 'accepter'},
//         {action: 'refuse', title: 'refuser'},
//     ]
// })

//la notification précédente ayant des bouton d'action il est possible de détecter quel button a été cliqué
// self.addEventListener('notificationclick',evt => {
//     switch(evt.action) {
//         case 'accept':
//             console.log('bravo')
//         break;
//         case 'refuse':
//             console.log('tans pis')
//         break;
//         default:
//             console.log('fermé')
//     }
//     evt.notification.close()
// })

//utilisable si nous possedons un server push
self.addEventListener('push', evt => {
    console.log('push event', evt)
    console.log(evt.data.text())
    const options = {
        body: evt.data.text(),
        icon: './images/icons/icon-72x72.png',
        actions: [
            {action: 'accept', title: 'accepter'},
            {action: 'refuse', title: 'refuser'},
        ]
    }
    //afficher la notification push
    evt.waitUntil(self.registration.showNotification('Information importante', options))
})