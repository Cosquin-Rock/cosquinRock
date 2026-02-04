# CosquinRock - Copilot Instructions

## Project Overview

**CosquinRock** is an Angular 18 standalone application with **Server-Side Rendering (SSR)** enabled. The project uses a modern Angular architecture with client and server bootstrap configurations, requiring awareness of dual-environment contexts when implementing features.

## Architecture

### Key Structure
- **Client Entry**: [src/main.ts](src/main.ts) - Standard Angular bootstrapping
- **Server Entry**: [src/main.server.ts](src/main.server.ts) - SSR bootstrap with BootstrapContext
- **Express Server**: [server.ts](server.ts) - Handles SSR rendering via CommonEngine
- **Routing**: [src/app/app.routes.ts](src/app/app.routes.ts) - Standalone routing configuration
- **Root Component**: [src/app/app.component.ts](src/app/app.component.ts) - Standalone component with RouterOutlet

### Configuration Pattern
- **Client Config**: [src/app/app.config.ts](src/app/app.config.ts) - Basic providers: ZoneChangeDetection, Router, ClientHydration
- **Server Config**: [src/app/app.config.server.ts](src/app/app.config.server.ts) - Merges client config with ServerRendering provider
- **Dual-environment pattern**: Always provide both client and server providers when adding new injectable services

### SSR Implementation
The Express server ([server.ts](server.ts)):
- Uses CommonEngine to render Angular templates server-side
- Serves static assets from `/public` with `maxAge: '1y'` caching
- Routes all requests through Angular engine for dynamic rendering
- Supports REST API endpoints (see commented examples in server.ts)

## Development Workflow

### Build & Serve
```bash
npm start              # Development server (ng serve), localhost:4200
npm run build          # Production build to dist/cosquin-rock
npm run watch          # Watch mode build (development config)
npm run serve:ssr:*    # Run SSR server locally (port 4000)
npm test               # Run unit tests via Karma
```

### Key Configuration Files
- **angular.json**: SCSS styles, SSR entry via src/main.server.ts, prerender enabled
- **tsconfig.app.json**: App-specific TypeScript settings
- **karma.conf.js**: Unit test runner configuration (if present)

## Development Conventions

### Standalone Components (Required)
All new components must be **standalone**: include `standalone: true` and define imports explicitly. Example:
```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss'
})
```

### Styling
- **Language**: SCSS (configured in angular.json)
- **Entry point**: [src/styles.scss](src/styles.scss) - Global styles
- **Component styles**: Use `styleUrl` in component decorator
- **File extension**: `.scss` for all stylesheets

### Testing
- **Framework**: Jasmine
- **Runner**: Karma
- **Files**: `.spec.ts` pattern (e.g., `app.component.spec.ts`)
- **Run tests**: `npm test`

### TypeScript Strictness
- **Strict mode enabled** in tsconfig.json
- Enforce strict injection parameters and input access modifiers
- No implicit returns or falsy cases in switch statements

## SSR-Specific Patterns

When implementing features that run on both client and server:
- Avoid DOM APIs directly; use Angular's platform detection (e.g., `isPlatformBrowser`)
- Use `OnInit` and `OnDestroy` carefully; SSR will execute them on render
- Pass data via route params or providers, not browser APIs (localStorage, sessionStorage)
- For API calls: Import HttpClient and provide via DI in both client and server configs

## Angular 18 Specifics
- Minimum Angular version: 18.2.0
- **Signal inputs** may be used (modern pattern)
- **Async operators** from RxJS: prefer `async | toSignal()` pattern where applicable
- **Zone.js**: Required for change detection; already configured

## Common Tasks

### Adding a New Routed Component
1. Create component: `ng generate component pages/my-page --standalone`
2. Add to [src/app/app.routes.ts](src/app/app.routes.ts): `{ path: 'my-page', component: MyPageComponent }`
3. For SSR: Ensure no DOM-specific logic; use platform checks if needed

### Adding a Service
1. Create: `ng generate service services/my-service`
2. Provide in [src/app/app.config.ts](src/app/app.config.ts) (and server config if it calls APIs)
3. Inject into components via constructor DI

### API Integration
- Use HttpClient from @angular/common/http
- Provide via: `provideHttpClient()` in both app.config.ts and app.config.server.ts
- SSR renders with real API calls; ensure APIs are accessible during build

## External Dependencies
- **Express.js**: Server-side routing and static file serving
- **RxJS**: Reactive programming for async operations
- **Zone.js**: Change detection optimization
- No additional UI frameworks; build custom components or use Angular Material if needed

## Build Artifacts
- **Output**: `dist/cosquin-rock/`
- **Browser files**: `dist/cosquin-rock/browser/`
- **Server files**: `dist/cosquin-rock/server/server.mjs`
- **Budget**: 500KB initial (warning), 1MB (error) per angular.json configuration

## Calendar Module

A complete calendar feature has been implemented with Full Calendar integration.

### Features
- Full CRUD operations (Create, Read, Update, Delete)
- Automatic conversion between database and Full Calendar formats
- Real-time event synchronization via BehaviorSubject
- Create events by clicking dates
- Edit events by clicking existing events
- Drag-and-drop to reschedule
- Multiple views: Month, Week, Day, List

### Structure
- **Interfaces**: [src/app/features/calendar/models/calendar-event.interface.ts](src/app/features/calendar/models/calendar-event.interface.ts)
- **Service**: [src/app/features/calendar/services/calendar-event.service.ts](src/app/features/calendar/services/calendar-event.service.ts)
- **Component**: [src/app/features/calendar/components/calendar.component.ts](src/app/features/calendar/components/calendar.component.ts)
- **Documentation**: [src/app/features/calendar/README.md](src/app/features/calendar/README.md)

### API Endpoints Expected
```
GET    /api/events           # List all events
POST   /api/events           # Create event
PUT    /api/events/:id       # Update event
DELETE /api/events/:id       # Delete event
```

### Event Model (CalendarEventDB)
```typescript
{
  id: string;
  title: string;
  description?: string;
  startDate: string;      // ISO 8601
  endDate: string;        // ISO 8601
  color?: string;         // Hex color
  allDay?: boolean;
  location?: string;
  attendees?: string[];
  status?: 'confirmed' | 'tentative' | 'cancelled';
}
```

### Usage
```typescript
import { CalendarComponent, CalendarEventService } from '@app/features/calendar';

// Add to route
{ path: 'calendar', component: CalendarComponent }

// Or use the service directly
constructor(private eventService: CalendarEventService) {
  this.eventService.getEvents().subscribe(events => {
    // Handle events
  });
}
```

### Backend Implementation
See [src/app/features/calendar/BACKEND_EXAMPLES.md](src/app/features/calendar/BACKEND_EXAMPLES.md) for example implementations in Express, .NET, and Python.
