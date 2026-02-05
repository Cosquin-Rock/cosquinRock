# Ejemplos de Uso y Personalización

## Ejemplo 1: Excluir URLs específicas del Loading

Si quieres que ciertas URLs NO muestren el loading (por ejemplo, peticiones de polling):

```typescript
// interceptors/loading.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // URLs que no deben mostrar loading
  const skipLoadingUrls = ['/api/health', '/api/ping', '/api/polling'];
  
  const shouldSkipLoading = skipLoadingUrls.some(url => req.url.includes(url));

  if (shouldSkipLoading) {
    return next(req);
  }

  loadingService.show();
  return next(req).pipe(finalize(() => loadingService.hide()));
};
```

## Ejemplo 2: Delay Mínimo para Evitar Parpadeos

Si las peticiones son muy rápidas a veces, puedes agregar un delay mínimo:

```typescript
// interceptors/loading.interceptor.ts
import { HttpInterceptorFn } from '@angular/core';
import { inject } from '@angular/core';
import { finalize, delay, tap } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  const MIN_LOADING_TIME = 300; // ms
  
  const startTime = Date.now();
  loadingService.show();

  return next(req).pipe(
    finalize(() => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);
      
      if (remainingTime > 0) {
        setTimeout(() => loadingService.hide(), remainingTime);
      } else {
        loadingService.hide();
      }
    })
  );
};
```

## Ejemplo 3: Header Personalizado para Controlar el Loading

Agrega un header a tus peticiones para controlar el loading:

```typescript
// interceptors/loading.interceptor.ts
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // Buscar header personalizado
  const skipLoading = req.headers.get('X-Skip-Loading') === 'true';

  if (skipLoading) {
    // Remover el header antes de enviar
    const newReq = req.clone({
      headers: req.headers.delete('X-Skip-Loading')
    });
    return next(newReq);
  }

  loadingService.show();
  return next(req).pipe(finalize(() => loadingService.hide()));
};

// En tu servicio
getData() {
  const headers = new HttpHeaders().set('X-Skip-Loading', 'true');
  return this.http.get('/api/data', { headers });
}
```

## Ejemplo 4: Diferentes Estilos de Spinner

### Spinner de Puntos
```scss
// loading.component.scss
.spinner {
  display: flex;
  gap: 8px;
  
  .dot {
    width: 12px;
    height: 12px;
    background-color: #3498db;
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out both;
    
    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
  }
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}
```

```html
<!-- loading.component.html -->
<div class="spinner">
  <div class="dot"></div>
  <div class="dot"></div>
  <div class="dot"></div>
</div>
```

### Barra de Progreso Indeterminada
```scss
// loading.component.scss
.progress-bar {
  width: 200px;
  height: 4px;
  background-color: #e0e0e0;
  border-radius: 2px;
  overflow: hidden;
  
  .progress-bar-fill {
    width: 40%;
    height: 100%;
    background-color: #3498db;
    animation: progress 1.5s infinite ease-in-out;
  }
}

@keyframes progress {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(350%); }
}
```

## Ejemplo 5: Loading con Mensaje Dinámico

```typescript
// services/loading.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LoadingState {
  isLoading: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<LoadingState>({
    isLoading: false,
    message: 'Cargando...'
  });
  private requestCount = 0;

  public loading$: Observable<LoadingState> = this.loadingSubject.asObservable();

  show(message: string = 'Cargando...'): void {
    this.requestCount++;
    if (this.requestCount === 1) {
      this.loadingSubject.next({ isLoading: true, message });
    }
  }

  hide(): void {
    this.requestCount--;
    if (this.requestCount <= 0) {
      this.requestCount = 0;
      this.loadingSubject.next({ isLoading: false, message: '' });
    }
  }
}

// loading.component.ts
export class LoadingComponent implements OnInit {
  loading$!: Observable<LoadingState>;
  // ...
}

// loading.component.html
<div class="loading-overlay" *ngIf="(loading$ | async)?.isLoading">
  <div class="loading-container">
    <div class="spinner"></div>
    <p class="loading-text">{{ (loading$ | async)?.message }}</p>
  </div>
</div>

// En tu servicio
saveData(data: any) {
  this.loadingService.show('Guardando datos...');
  return this.http.post('/api/data', data).pipe(
    finalize(() => this.loadingService.hide())
  );
}
```

## Ejemplo 6: Timeout para Peticiones Lentas

Mostrar un mensaje si la petición tarda mucho:

```typescript
// interceptors/loading.interceptor.ts
import { timer } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  const SLOW_REQUEST_THRESHOLD = 3000; // 3 segundos

  loadingService.show('Cargando...');

  // Timer para detectar peticiones lentas
  const slowTimer = timer(SLOW_REQUEST_THRESHOLD).subscribe(() => {
    loadingService.show('Esto está tardando más de lo esperado...');
  });

  return next(req).pipe(
    finalize(() => {
      slowTimer.unsubscribe();
      loadingService.hide();
    })
  );
};
```

## Ejemplo 7: Loading Solo en Ciertas Rutas

```typescript
// interceptors/loading.interceptor.ts
import { Router } from '@angular/router';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  const router = inject(Router);

  // Solo mostrar loading en estas rutas
  const loadingRoutes = ['/dashboard', '/calendar'];
  const currentRoute = router.url;
  
  const shouldShowLoading = loadingRoutes.some(route => 
    currentRoute.startsWith(route)
  );

  if (!shouldShowLoading) {
    return next(req);
  }

  loadingService.show();
  return next(req).pipe(finalize(() => loadingService.hide()));
};
```

## Ejemplo 8: Loading con Progress Bar Real

Para peticiones con progreso de descarga:

```typescript
// En tu componente
downloadFile() {
  this.http.get('/api/download', {
    reportProgress: true,
    observe: 'events'
  }).subscribe(event => {
    if (event.type === HttpEventType.DownloadProgress) {
      const percentDone = Math.round(100 * event.loaded / (event.total || 1));
      console.log(`Descarga: ${percentDone}%`);
    }
  });
}
```

## Ejemplo 9: Deshabilitar Interacciones Durante Loading

```scss
// loading.component.scss
.loading-overlay {
  // ... estilos existentes ...
  
  // Deshabilitar interacciones
  pointer-events: all;
  cursor: wait;
}
```

## Ejemplo 10: Loading con Animación de Fade

```scss
// loading.component.scss
.loading-overlay {
  animation: fadeIn 0.2s ease-in;
  
  &.fade-out {
    animation: fadeOut 0.2s ease-out;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}
```

```typescript
// loading.component.ts
export class LoadingComponent implements OnInit {
  loading$!: Observable<boolean>;
  isVisible = false;

  ngOnInit(): void {
    this.loading$ = this.loadingService.loading$.pipe(
      tap(loading => {
        if (loading) {
          this.isVisible = true;
        } else {
          setTimeout(() => this.isVisible = false, 200); // Esperar animación
        }
      })
    );
  }
}
```
