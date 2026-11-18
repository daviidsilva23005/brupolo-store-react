import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
const app = initializeApp({
  apiKey: 'AIzaSyDdZBSaVNpsH0q7yCIQBRvDjfaRD3xAgog',
  authDomain: 'brupolo-store.firebaseapp.com',
  projectId: 'brupolo-store',
  storageBucket: 'brupolo-store.firebasestorage.app',
  messagingSenderId: '662456167880',
  appId: '1:662456167880:web:dbaef3faf8dbd9be2be4fd',
})
export const db = getFirestore(app)
export const auth = getAuth(app)
// Copiar aquí el UID de tu usuario de Firebase Authentication.
export const ADMIN_UID = 'vfSjIsLcnYU0BQJDgq7d3bhxiL93'
// Cuentas autorizadas: propietario y cuenta de evaluación.
export const ADMIN_UIDS = [ADMIN_UID, 'KrPPsyyWz0ZovPcPRc7gWB5D5GI2']
