import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyAJnT9fdQkOrerNDnHfzKoOcll11LZaJJE",
  authDomain: "servex-2026.firebaseapp.com",
  projectId: "servex-2026",
  storageBucket: "servex-2026.firebasestorage.app",
  messagingSenderId: "863697989084",
  appId: "1:863697989084:web:f4bef887fe6786e27c7319"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    // Add these Firebase providers
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};