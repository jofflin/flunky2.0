export const check = () => {
  if (!('serviceWorker' in navigator)) {
    console.log('No Service Worker support!')
    postMessage({ message: 'No Service Worker support!' })
    // throw new Error('No Service Worker support!')
  }
  if (!('PushManager' in window)) {
    console.log('No Push API Support!')
    postMessage({ message: 'No Push API Support!' })
    // throw new Error('No Push API Support!')
  }
}
export const registerServiceWorker = async (userId: string) => {
  const swRegistration = await navigator.serviceWorker.register(
    `service.js?userId=${userId}`
  ) //notice the file name
  return swRegistration
}

export const requestNotificationPermission = async (
  swRegistration: ServiceWorkerRegistration
) => {
  const permission = await window.Notification.requestPermission()
  const subscription = await swRegistration.pushManager.getSubscription()

  return subscription
}

const urlB64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export const registerPushManager = async (
  swRegistration: ServiceWorkerRegistration
) => {
  const applicationServerKey = urlB64ToUint8Array(
    'BExXerzHJ15OzrKD2gXNpxXW9ZCnhwEiG26VN9x7hWdzD018mlatI5iJv-79zTku67w5Zyo_ycifhy7dbohnWEQ'
  )
  const pushSubscription = await swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey,
  })
  return pushSubscription
}

export const setupPushManager = async (userId: string) => {
  check()

  const permission = await window.Notification.requestPermission()
  postMessage({ permission, type: 'PERMISSION', userId })
  if (permission !== 'granted') {
    throw new Error('Permission not granted for Notification')
  }
  await registerServiceWorker(userId)
}

export const isWorkerInstalled = async () => {
  const swRegistration = await navigator.serviceWorker.getRegistration()

  return swRegistration ? true : false
}

export const checkAndUpdateSubscription = async (userId: string) => {
  postMessage({ message: 'Waiting for service worker to be ready' })
  await setupPushManager(userId)
  await navigator.serviceWorker.ready
  postMessage({ message: 'Service worker is ready' })
  let swRegistration = await navigator.serviceWorker.getRegistration()
  const unregistered = await swRegistration?.unregister()
  postMessage({ message: 'Service worker is unregistered', unregistered })
  swRegistration = await navigator.serviceWorker.register(
    `/service.js?userId=${userId}`
  )
  postMessage({
    type: 'CLIENT_READY',
    payload: { userId },
    registration: swRegistration,
  })
  if (!swRegistration) {
    return
  }
  postMessage({
    type: 'AFTER_CHECK',
  })
  const databaseSubscription = await fetch('/api/get-subscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
    }),
  })
  const data = await databaseSubscription.json()

  let subscription = await requestNotificationPermission(swRegistration)
  postMessage({
    type: 'PERMISSION',
    payload: { permission: subscription },
  })
  if (!subscription) {
    subscription = await registerPushManager(swRegistration)
  }
  postMessage({
    type: 'SUBSCRIPTION',
    payload: { subscription },
  })
  postMessage({
    type: 'DATABASE_SUBSCRIPTION',
    payload: { data },
  })
  if (JSON.stringify(subscription) !== JSON.stringify(data)) {
    await fetch('/api/save-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        subscription,
      }),
    })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const postMessage = (message: any) => {
  fetch('/api/logging', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  })
}
