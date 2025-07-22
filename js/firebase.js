import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import {
  getFirestore, collection, addDoc, query, orderBy, onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

let db;
export function initFirebase(){
  const firebaseConfig = {
    apiKey: 'AIzaSyCfJ2xA0htQIlwvnFp5oTcKmEjXJLcj9Cs', authDomain: 'wedding-invitation-46ad9.web.app', projectId: 'wedding-invitation-46ad9'
  };
  db = getFirestore(initializeApp(firebaseConfig));
}

export const addGuestbook = (name,msg)=> addDoc(collection(db,'guestbook'),{name,msg,ts:Date.now()});
export const addRsvp = data => addDoc(collection(db,'rsvp'),{...data,ts:Date.now()});
export const listenGuestbook = cb => {
  const q = query(collection(db,'guestbook'), orderBy('ts','desc'));
  return onSnapshot(q, snap => cb(snap.docs.map(d=>d.data())));
};
