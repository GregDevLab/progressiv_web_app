export function notifier(title, msg) {
    if(window.Notification && window.Notification !== "denied") {
        Notification.requestPermission(perm => {
            if(perm === 'granted') {
                const options = {
                    body: msg,
                    icon: '../images/icons/icon-72x72.png'
                }
                const notif = new Notification(title, options)
            }
        })
    }
}