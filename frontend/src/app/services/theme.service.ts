import { Injectable, signal, effect } from '@angular/core';

export interface ThemeColor {
  name: string;
  primary: string;
  hover: string;
  gradient: string;
}

export const THEME_COLORS: ThemeColor[] = [
  { name: 'Indigo', primary: '#6366f1', hover: '#4f46e5', gradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' },
  { name: 'Emerald', primary: '#10b981', hover: '#059669', gradient: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)' },
  { name: 'Rose', primary: '#f43f5e', hover: '#e11d48', gradient: 'linear-gradient(135deg, #f43f5e 0%, #f97316 100%)' },
  { name: 'Amber', primary: '#f59e0b', hover: '#d97706', gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' }
];

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal<boolean>(localStorage.getItem('theme') === 'dark');
  primaryColor = signal<ThemeColor>(
    THEME_COLORS.find(c => c.name === localStorage.getItem('primary_color')) || THEME_COLORS[0]
  );

  constructor() {
    effect(() => {
      const theme = this.isDarkMode() ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    });

    effect(() => {
      const color = this.primaryColor();
      localStorage.setItem('primary_color', color.name);
      document.documentElement.style.setProperty('--primary-color', color.primary);
      document.documentElement.style.setProperty('--primary-hover', color.hover);
      document.documentElement.style.setProperty('--primary-gradient', color.gradient);
    });
  }

  toggleTheme() {
    this.isDarkMode.update(v => !v);
  }

  setPrimaryColor(color: ThemeColor) {
    this.primaryColor.set(color);
  }
}
