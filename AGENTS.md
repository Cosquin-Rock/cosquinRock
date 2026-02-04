# AGENTS.md - Development Guidelines for CosquinRock

## Build Commands

### Core Commands
```bash
npm start                # Development server (ng serve) - localhost:4200
npm run build           # Production build to dist/cosquin-rock
npm run watch           # Watch mode build (development config)
npm test                # Run all unit tests via Karma
```

### Server-Side Rendering (SSR)
```bash
npm run build:ssr       # Build both browser and server versions
npm run serve:ssr       # Run SSR server - localhost:4000
npm run serve:ssr:cosquinRock  # Alternative SSR command
```

### Testing Commands
```bash
npm test                # Run all tests
ng test                 # Alternative test command (Karma)
ng test --watch         # Run tests in watch mode
ng test --code-coverage # Generate coverage report
```

### Angular CLI Commands
```bash
ng generate component components/my-component --standalone  # Create standalone component
ng generate service services/my-service                      # Create service
ng generate module features/my-feature                       # Create feature module
ng build --configuration development                        # Development build
ng build --configuration production                         # Production build
```

## Code Style Guidelines

### Project Architecture
- **Framework**: Angular 18 with Standalone Components (required)
- **Rendering**: Server-Side Rendering (SSR) enabled
- **Language**: TypeScript with strict mode enabled
- **Styling**: SCSS (configured in angular.json)
- **Testing**: Jasmine + Karma

### Standalone Components (REQUIRED)
All components MUST be standalone. Pattern:
```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, RouterModule, OtherNeededComponents],
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss'
})
export class ExampleComponent {}
```

### Import Organization
1. Angular core imports first
2. Third-party libraries (RxJS, FullCalendar, etc.)
3. Internal application imports (use relative paths with @app alias when available)
4. Feature-specific imports last

```typescript
// Angular
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// Third-party
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

// Internal
import { CalendarEventService } from '../services/calendar-event.service';
import { CalendarEventDB, FullCalendarEvent } from '../models/calendar-event.interface';
```

### TypeScript Guidelines
- **Strict Mode**: Enforced - no implicit any, strict null checks
- **Interfaces**: Use for all data structures, prefer over types
- **Optional Properties**: Use `?` for optional fields
- **Union Types**: Use literal unions for status fields: `'confirmed' | 'tentative' | 'cancelled'`
- **Date Handling**: Use ISO 8601 strings for API communication
- **No Implicit Returns**: Required in tsconfig.json

### Naming Conventions
- **Components**: PascalCase with descriptive names (e.g., `CalendarEventListComponent`)
- **Services**: PascalCase ending with `Service` (e.g., `CalendarEventService`)
- **Interfaces**: PascalCase, often ending with type (e.g., `CalendarEventDB`, `FullCalendarEvent`)
- **Properties**: camelCase, descriptive names
- **Methods**: camelCase, verb-first for actions (e.g., `getEvents()`, `createEvent()`)
- **Constants**: UPPER_SNAKE_CASE
- **Files**: kebab-case for components/services, interfaces in separate files

### Dependency Injection Pattern
- **Services**: Use `providedIn: 'root'` for application-wide services
- **HTTP Client**: Provide via `provideHttpClient()` in both app.config.ts and app.config.server.ts
- **Configuration**: Dual config pattern - client config + merged server config for SSR

### Error Handling
- **RxJS**: Use `catchError` operator with meaningful error messages
- **Fallbacks**: Provide mock data when API calls fail (see CalendarEventService)
- **Logging**: Use `console.warn()` for expected failures, `console.error()` for unexpected
- **User Feedback**: Implement user-friendly error messages, avoid exposing stack traces

### Observable Patterns
- **Services**: Return Observables from API methods
- **State Management**: Use BehaviorSubject for reactive state streams
- **Async Pipeline**: Prefer RxJS operators over manual subscriptions
- **Cleanup**: Use takeUntil or destroy patterns for component cleanup

### SSR Considerations
- **Platform Detection**: Use `isPlatformBrowser()`/`isPlatformServer()` for platform-specific code
- **DOM APIs**: Avoid direct DOM manipulation; use Angular's platform abstraction
- **Browser APIs**: Avoid localStorage, sessionStorage, window APIs without platform checks
- **HTTP Calls**: Ensure APIs are accessible during server build process

### Styling Guidelines
- **File Extensions**: Use `.scss` for all stylesheets
- **Global Styles**: Edit `src/styles.scss` for application-wide styles
- **Component Styles**: Use `styleUrl` in component decorator
- **CSS Classes**: Use BEM-like naming conventions when applicable
- **Responsive**: Design mobile-first with media queries

### Testing Patterns
- **File Naming**: `.spec.ts` suffix (e.g., `calendar.component.spec.ts`)
- **Test Structure**: Use `describe()`, `beforeEach()`, `it()` pattern
- **Component Testing**: Import component in TestBed.configureTestingModule
- **Service Testing**: Mock HTTP client using HttpClientTestingModule
- **Coverage**: Aim for >80% coverage for critical paths

### File Organization
```
src/app/
├── features/           # Feature-based organization
│   ├── calendar/
│   │   ├── components/
│   │   ├── services/
│   │   ├── models/
│   │   └── index.ts
├── shared/             # Shared components/utilities
├── core/               # Core services/guards
├── app.component.ts
├── app.config.ts       # Client providers
├── app.config.server.ts # Server providers (SSR)
└── app.routes.ts       # Standalone routing
```

### API Integration
- **HTTP Module**: Use HttpClient from @angular/common/http
- **Base URL**: Store in environment-specific configuration
- **Error Handling**: Implement consistent error response structure
- **Type Safety**: Define interfaces for all API request/response objects
- **Mock Fallbacks**: Provide mock data for development/offline scenarios

### Performance Guidelines
- **Lazy Loading**: Use route-based code splitting for large features
- **Bundle Size**: Monitor budgets (700KB warning, 1.5MB error for initial)
- **Change Detection**: Use OnPush strategy when appropriate
- **Async Operations**: Prefer async pipe over manual subscriptions where possible

### Code Quality Tools
- **Linting**: Use Angular CLI built-in linting (`ng lint`)
- **Type Checking**: Strict TypeScript compilation enforced
- **Formatting**: Follow .editorconfig settings (2 spaces, single quotes for TypeScript)
- **Pre-commit**: Consider husky for code quality gates

## Development Workflow

1. **Create Component**: `ng generate component features/my-feature/components/my-component --standalone`
2. **Add Route**: Update `src/app/app.routes.ts` with new route
3. **Create Service**: `ng generate service features/my-feature/services/my-service`
4. **Configure DI**: Add providers to `app.config.ts` (and server config if needed)
5. **Write Tests**: Create `.spec.ts` file following established patterns
6. **Run Tests**: `npm test` before committing changes
7. **SSR Testing**: Test both development and SSR builds

## Calendar Feature Integration

When working with the existing calendar feature:
- **Service**: `CalendarEventService` provides CRUD operations and real-time updates
- **API Endpoints**: Expects REST endpoints at `/api/events` (GET, POST, PUT, DELETE)
- **Event Model**: Use `CalendarEventDB` for API communication, `FullCalendarEvent` for UI
- **State Management**: Events managed via BehaviorSubject in service layer