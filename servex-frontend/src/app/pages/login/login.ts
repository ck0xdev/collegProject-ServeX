import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';

  async onSignIn() {
    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/services']);
    } catch (err) {
      alert("Invalid credentials. Please try again.");
    }
  }

  async onGoogleLogin() {
    try {
      await this.authService.googleLogin();
      this.router.navigate(['/services']);
    } catch (err) {
      console.error(err);
    }
  }
}