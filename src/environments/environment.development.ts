/**
 * Configuración de entorno para producción.
 * Este archivo reemplaza environment.development.ts cuando se ejecuta `ng build --configuration production`.
 * Actualizar la baseUrl con la URL del servidor de producción.
 */
export const environment = {
  production: true,
  baseUrl: 'https://ms-bands.onrender.com', // TODO: Reemplazar con la URL de producción
  // baseUrl: 'http://localhost:3000', 
};
