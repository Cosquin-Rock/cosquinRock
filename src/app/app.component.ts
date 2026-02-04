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
