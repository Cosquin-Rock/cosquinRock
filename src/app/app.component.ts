import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <header class="app-header">
      <nav>
        <a routerLink="/">Dashboard</a>
        <a routerLink="/calendar">Calendar</a>
      </nav>
    </header>
    <div class="decor-overlay fractal-layer" aria-hidden="true">
      <svg width="1200" height="1200" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="gradFractal2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ffea00"/>
            <stop offset="50%" stop-color="#ff00ff"/>
            <stop offset="100%" stop-color="#00eaff"/>
          </linearGradient>
        </defs>
        <circle cx="600" cy="600" r="520" fill="url(#gradFractal2)" opacity="0.25"/>
        <path d="M0 1200 C400 800, 800 400, 1200 600" stroke="url(#gradFractal2)" stroke-width="2" fill="none" opacity="0.6"/>
      </svg>
    </div>
    <div class="decor-overlay mushroom-layer" aria-hidden="true">
      <svg width="900" height="900" viewBox="0 0 900 900" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="gradM3" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ff4d94"/>
            <stop offset="100%" stop-color="#8a2be2"/>
          </radialGradient>
        </defs>
        <circle cx="450" cy="450" r="420" fill="url(#gradM3)" opacity="0.35"/>
        <path d="M50 650 C250 350, 650 350, 850 650" stroke="url(#gradM3)" stroke-width="6" fill="none" opacity="0.55"/>
      </svg>
    </div>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `:host { display: block; font-family: Inter, system-ui, sans-serif; }
     .app-header { padding: 0.5rem 1rem; background: #f8f9fb; border-bottom: 1px solid #e6eef6 }
     .app-header nav a { margin-right: 1rem; color: #0b5cff; text-decoration: none }
    `
  ]
})
export class AppComponent {}
