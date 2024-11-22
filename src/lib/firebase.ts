import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBbyeo9mJEvXGdutbPwFrq6bypCgSJKqrs",
  authDomain: "portal-de-portarias.firebaseapp.com",
  projectId: "portal-de-portarias",
  storageBucket: "portal-de-portarias.firebasestorage.app",
  messagingSenderId: "710435778529",
  appId: "1:710435778529:web:cb48b70704ac39d494aca0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export interface Ordinance {
  id: string;
  number: string;
  date: string;
  summary: string;
  link: string;
  createdAt: string;
  municipalities?: string[];
}

export interface Municipality {
  id: string;
  ibgeCode: string;
  name: string;
  state: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  email: string;
  whatsapp: string;
  municipalities: string[];
  createdAt: string;
}