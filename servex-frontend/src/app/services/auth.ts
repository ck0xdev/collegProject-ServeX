import { Injectable, inject } from '@angular/core';
import { Auth, authState, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  
  // Observable to track user login status globally
  user$: Observable<User | null> = authState(this.auth);

  // Login with Email
  login(email: string, pass: string) {
    return signInWithEmailAndPassword(this.auth, email, pass);
  }

  // Register with Email
  register(email: string, pass: string) {
    return createUserWithEmailAndPassword(this.auth, email, pass);
  }

  // Google Login (Premium iOS feel)
  googleLogin() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  // Logout
  logout() {
    return signOut(this.auth);
  }

  // Get Token for Backend (Crucial for Phase 4)
  async getToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    return user ? await user.getIdToken() : null;
  }
}