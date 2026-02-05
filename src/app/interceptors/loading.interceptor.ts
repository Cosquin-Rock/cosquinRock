import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

/**
 * Interceptor HTTP que muestra/oculta el indicador de carga automáticamente
 * para todas las peticiones HTTP
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // Mostrar loading al iniciar la petición
  loadingService.show();

  // Continuar con la petición y ocultar loading cuando termine (éxito o error)
  return next(req).pipe(
    finalize(() => {
      loadingService.hide();
    })
  );
};
