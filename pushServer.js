const webPush = require('web-push');
const vapidKeys = require('./pushServerKeys');
const pushClientSubscription = require('./pushClientSubscription');

// VAPID keys should be generated only once.
// const vapidKeys = webPush.generateVAPIDKeys();

webPush.setVapidDetails(
  'mailto:g.batte@outlook.fr',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// This is the same output of calling JSON.stringify on a PushSubscription
const pushSubscription = {
  endpoint: pushClientSubscription.endpoint,
  keys: {
    auth: pushClientSubscription.keys.auth,
    p256dh: pushClientSubscription.keys.p256dh
  }
};

webPush.sendNotification(pushSubscription, 'notif depuis le server push node')
.then(res => console.log('notification envoyer', res))
.catch(err => console.error)
