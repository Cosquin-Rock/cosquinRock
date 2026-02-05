# Guía de Despliegue en Netlify - CosquinRock

## 📋 Configuración Actual

El archivo `netlify.toml` está configurado para desplegar la aplicación Angular en modo **Client-Side Rendering (CSR/SPA)**.

### Comandos Configurados

```toml
[build]
  command = "yarn build --configuration=production"
  publish = "dist/cosquin-rock/browser"
```

**Nota:** Este proyecto usa **Yarn** como gestor de paquetes. Netlify detecta automáticamente `yarn.lock` y usará Yarn en lugar de npm.

## 🚀 Cómo Desplegar

### Opción 1: Deploy desde Git (Recomendado)

1. Conecta tu repositorio en Netlify:
   - Ve a https://app.netlify.com
   - Click en "Add new site" → "Import an existing project"
   - Conecta tu repositorio de Git (GitHub, GitLab, Bitbucket)

2. Netlify detectará automáticamente el `netlify.toml`

3. Cada push a tu rama principal desplegará automáticamente

### Opción 2: Deploy Manual con CLI

```bash
# Instalar Netlify CLI globalmente
npm install -g netlify-cli

# Login en Netlify
netlify login

# Deploy de prueba
netlify deploy

# Deploy a producción
netlify deploy --prod
```

### Opción 3: Deploy con Drag & Drop

```bash
# Build local con Yarn
yarn build --configuration=production

# Sube la carpeta dist/cosquin-rock/browser a Netlify
# https://app.netlify.com/drop
```

## 🔧 Configuración Incluida

### ✅ Redirecciones SPA
Todas las rutas (`/*`) redirigen a `index.html` para que Angular Router funcione correctamente.

### ✅ Headers de Seguridad
- **X-Frame-Options**: Protección contra clickjacking
- **X-Content-Type-Options**: Previene MIME type sniffing
- **X-XSS-Protection**: Protección XSS básica
- **Referrer-Policy**: Control de información de referrer
- **Content-Security-Policy**: Política de seguridad de contenido

### ✅ Cache Optimizado
- **Archivos con hash** (JS, CSS): Cache de 1 año (immutable)
- **Imágenes**: Cache de 7 días
- **index.html**: Sin cache (siempre actualizado)

### ✅ Variables de Entorno
- **Node.js**: Versión 18
- **NPM**: Versión 9

## 🌍 Variables de Entorno en Netlify

Para agregar variables de entorno personalizadas:

1. Ve a tu sitio en Netlify
2. Site settings → Environment variables
3. Agrega tus variables (ej: `API_URL`)

Luego actualiza tus archivos de environment:

```typescript
// src/environments/environment.production.ts
export const environment = {
  production: true,
  apiUrl: process.env['API_URL'] || 'https://tu-api-produccion.com'
};
```

## 📊 Estructura de Directorios en Build

```
dist/cosquin-rock/
├── browser/          ← Publicado en Netlify (CSR)
│   ├── index.html
│   ├── main.*.js
│   ├── styles.*.css
│   └── assets/
└── server/           ← No usado en CSR
    └── main.server.mjs
```

## 🔄 Server-Side Rendering (SSR) en Netlify

### Nota Importante
Netlify no soporta SSR de Angular de forma nativa. Para usar SSR necesitas:

### Opción 1: Netlify Functions + Angular Universal
Requiere configuración adicional con adaptadores:

1. Instalar `@netlify/functions`
2. Crear función serverless que ejecute Angular Universal
3. Configurar redirects a la función

### Opción 2: Usar Vercel o Render
Estas plataformas tienen soporte nativo para Angular SSR.

### Opción 3: Mantener CSR (Actual)
Para la mayoría de aplicaciones, CSR es suficiente. Considera SSR solo si necesitas:
- SEO crítico para todas las páginas
- Mejor performance en primera carga
- Renderizado del lado del servidor por regulaciones

## 🐛 Troubleshooting

### Error: "Page Not Found" en rutas
✅ **Solución**: Ya está configurado en `netlify.toml` con la redirección `/* → /index.html`

### Error: "Build failed"
Revisa:
- Versiones de Node.js y NPM en `netlify.toml`
- Logs de build en Netlify dashboard
- Variables de entorno necesarias

### Error: Archivos estáticos no cargan
Verifica que el `publish` directory sea correcto:
```toml
publish = "dist/cosquin-rock/browser"
```

### Error: CORS en llamadas API
Configura en Netlify:
1. Site settings → Build & deploy → Post processing
2. Agrega reglas de CORS o usa Netlify Proxy

Ejemplo en `netlify.toml`:
```toml
[[redirects]]
  from = "/api/*"
  to = "https://tu-api-backend.com/:splat"
  status = 200
  force = true
```

## 📈 Optimizaciones Adicionales

### 1. Habilitar Gzip/Brotli
Netlify lo hace automáticamente para archivos elegibles.

### 2. Configurar Build Plugins
```toml
[[plugins]]
  package = "@netlify/plugin-lighthouse"
```

### 3. Split Testing
Netlify permite A/B testing entre branches.

### 4. Deploy Previews
Cada PR genera un preview deploy automático.

## 🔒 Seguridad

### Content Security Policy (CSP)
El CSP actual permite:
- Scripts inline (necesario para Angular)
- Estilos inline
- Fuentes de Google Fonts
- Imágenes de cualquier origen HTTPS
- Conexiones HTTPS a APIs externas

**Ajusta según tus necesidades** editando el header en `netlify.toml`.

### HTTPS
Netlify proporciona SSL/TLS automático y gratuito con Let's Encrypt.

## 📝 Checklist Pre-Deploy

- [ ] Variables de entorno configuradas en Netlify
- [ ] API URLs actualizadas para producción
- [ ] Build local exitoso: `npm run build -- --configuration=production`
- [ ] Tests pasando: `npm test`
- [ ] Rutas de Angular funcionan correctamente
- [ ] Imágenes y assets cargando
- [ ] API calls funcionando
- [ ] Headers de seguridad configurados

## 🔗 Enlaces Útiles

- [Netlify Docs - Angular](https://docs.netlify.com/integrations/frameworks/angular/)
- [Angular Deployment Guide](https://angular.io/guide/deployment)
- [Netlify CLI Docs](https://docs.netlify.com/cli/get-started/)
- [Netlify Build Settings](https://docs.netlify.com/configure-builds/overview/)

## 💡 Tips

1. **Preview Deploys**: Cada branch genera una URL de preview
2. **Rollback**: Netlify permite rollback instantáneo a deploys anteriores
3. **Custom Domain**: Configurar dominio personalizado es gratuito
4. **Edge Functions**: Alternativa a Netlify Functions con mejor performance
5. **Analytics**: Netlify Analytics disponible (pago)

## 🆘 Soporte

Si tienes problemas:
1. Revisa los logs de build en Netlify dashboard
2. Consulta la documentación oficial de Netlify
3. Revisa este archivo de configuración
4. Verifica las variables de entorno
