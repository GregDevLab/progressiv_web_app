export function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
        .then(registration => {

            registration.pushManager.getSubscription().then(subsription => {

                // const vapidKeys = webpush.generateVAPIDKeys(); utilisable coté back (nodejs)
                const vapidKeys = {
                    "publicKey":"BNOC-qpUsJiSG42dZzNYFKVoeP1lQqhMDm1ejlBRCFTqBhRhPxh1lWrfMmCBKoP48a-ilAFz2TMC4Uhga8AvUI0",
                    "privateKey":"8jO65N0EuTkaV9d-H1lwUVdGhEywXxmp5-78U0jTnds"
                }
                if(subsription) {
                    console.log('souscription', subsription)

                    const keyArrayBuffer = subsription.getKey('p256dh')
                    const p256dh = window.btoa(String.fromCharCode.apply(null, new Uint8Array(keyArrayBuffer)))

                    const authArrayBuffer = subsription.getKey('auth')
                    const auth = window.btoa(String.fromCharCode.apply(null, new Uint8Array(authArrayBuffer)))
                    console.log('auth',authArrayBuffer, auth)
                    console.log('key',keyArrayBuffer, p256dh)
                    return subsription
                } else {
                    return registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: vapidKeys.publicKey
                    })
                    .then(newSubscription => {
                        console.log('nouvelle souscription', newSubscription)
                    })
                }
            }) 

        })

    }
}