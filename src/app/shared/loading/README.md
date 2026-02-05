# Loading Component

Sistema de indicador de carga global para peticiones HTTP.

## Funcionalidad

Este módulo proporciona una pantalla de carga automática que se muestra cada vez que la aplicación realiza una petición HTTP al servidor. Es especialmente útil cuando el servidor responde lentamente.

## Componentes

### LoadingService (`services/loading.service.ts`)
Servicio que maneja el estado de carga de la aplicación.

**Características:**
- Mantiene un contador de peticiones activas
- Emite el estado de carga mediante un Observable
- Maneja múltiples peticiones simultáneas correctamente

**Métodos:**
- `show()`: Incrementa el contador e inicia la carga
- `hide()`: Decrementa el contador y oculta la carga cuando llega a 0
- `isLoading()`: Retorna el estado actual de carga
- `loading$`: Observable para suscribirse a cambios de estado

### LoadingInterceptor (`interceptors/loading.interceptor.ts`)
Interceptor HTTP funcional que automáticamente muestra/oculta el loading.

**Comportamiento:**
- Intercepta TODAS las peticiones HTTP
- Muestra el loading al iniciar la petición
- Oculta el loading cuando la petición termina (éxito o error)
- Usa el operador `finalize()` para asegurar que el loading se oculte siempre

### LoadingComponent (`shared/loading/loading.component.ts`)
Componente visual standalone que muestra la pantalla de carga.

**Características:**
- Overlay con fondo semitransparente
- Spinner animado
- Texto "Cargando..."
- z-index alto (9999) para estar sobre todo el contenido
- Backdrop blur para mejor efecto visual

## Uso

### Configuración (Ya implementada)

El sistema ya está configurado globalmente en:

1. **app.config.ts**: Registra el interceptor
2. **app.config.server.ts**: Registra el interceptor para SSR
3. **app.component.ts**: Incluye el componente de loading

### Uso Automático

No requiere ninguna acción adicional. Cada vez que uses `HttpClient` para hacer una petición, el loading se mostrará automáticamente:

```typescript
// En cualquier servicio
constructor(private http: HttpClient) {}

getData() {
  // El loading se muestra automáticamente
  return this.http.get('/api/data');
  // El loading se oculta cuando la petición termina
}
```

### Uso Manual (Opcional)

Si necesitas mostrar/ocultar el loading manualmente para operaciones no-HTTP:

```typescript
import { LoadingService } from './services/loading.service';

constructor(private loadingService: LoadingService) {}

async someOperation() {
  this.loadingService.show();
  
  try {
    // Tu operación larga
    await someAsyncOperation();
  } finally {
    this.loadingService.hide();
  }
}
```

### Excluir peticiones específicas

Si necesitas que alguna petición NO muestre el loading, puedes modificar el interceptor para detectar un header personalizado:

```typescript
// En el interceptor (loading.interceptor.ts)
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // Si la petición tiene el header 'X-Skip-Loading', no mostrar loading
  if (req.headers.has('X-Skip-Loading')) {
    return next(req);
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

## Personalización

### Cambiar el diseño

Edita `loading.component.scss` para modificar:
- Colores del spinner
- Tamaño del spinner
- Texto y fuentes
- Fondo del overlay
- Animaciones

### Cambiar el texto

Edita `loading.component.html` para cambiar "Cargando..." por otro mensaje.

### Cambiar el comportamiento

Edita `loading.interceptor.ts` para:
- Agregar delays mínimos/máximos
- Filtrar URLs específicas
- Agregar lógica condicional

## Testing

Los tests están incluidos:
- `loading.service.spec.ts`: Tests del servicio
- `loading.component.spec.ts`: Tests del componente

Ejecutar tests:
```bash
npm test
```

## Arquitectura

```
Petición HTTP
     ↓
LoadingInterceptor (intercepta)
     ↓
LoadingService.show() (incrementa contador)
     ↓
loading$ emite true
     ↓
LoadingComponent muestra overlay
     ↓
... petición HTTP se procesa ...
     ↓
LoadingInterceptor (finalize)
     ↓
LoadingService.hide() (decrementa contador)
     ↓
loading$ emite false
     ↓
LoadingComponent oculta overlay
```

## Manejo de Múltiples Peticiones

El sistema maneja correctamente múltiples peticiones simultáneas:

1. Primera petición: contador = 1, muestra loading
2. Segunda petición: contador = 2, loading sigue visible
3. Primera petición termina: contador = 1, loading sigue visible
4. Segunda petición termina: contador = 0, oculta loading

Esto evita que el loading parpadee cuando hay múltiples peticiones concurrentes.
