import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { ThemeService, THEME_COLORS, ThemeColor } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  router = inject(Router);

  themeColors = THEME_COLORS;
  isColorMenuOpen = signal<boolean>(false);

  get isAuthRoute(): boolean {
    return this.router.url === '/login' || this.router.url === '/signup';
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      }
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleColorMenu(): void {
    this.isColorMenuOpen.update(v => !v);
  }

  setPrimaryColor(color: ThemeColor): void {
    this.themeService.setPrimaryColor(color);
    this.isColorMenuOpen.set(false);
  }
}
