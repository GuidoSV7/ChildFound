# Facebook Auth Module

Este módulo agrega autenticación con Facebook tanto para web (OAuth con redirecciones) como para móvil (enviando `accessToken` del SDK).

## Endpoints

- [POST] `/api/auth/facebook`
  - Autenticación directa con datos de Facebook
  - Body:
  ```json
  {
    "facebookId": "fb-user-id",
    "email": "user@example.com",
    "name": "Nombre Apellido",
    "picture": "https://graph.facebook.com/{id}/picture?type=large"
  }
  ```

- [POST] `/api/auth/facebook/mobile`
  - Autenticación móvil usando `accessToken` del SDK de Facebook (Android/iOS)
  - Body:
  ```json
  { "accessToken": "EAAGm0PX..." }
  ```
  - El backend valida el token con `debug_token` contra tu `FACEBOOK_APP_ID` y luego obtiene el perfil con `/me?fields=id,name,email,picture`.

- [GET] `/api/auth/facebook`
  - Inicia el flujo OAuth con Passport (redirección a Facebook)

- [GET] `/api/auth/facebook/callback`
  - Callback del flujo OAuth. Redirige a `FRONTEND_URL` con `userId` o `error`.

## Variables de Entorno

```env
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_CALLBACK_URL=http://localhost:3000/auth/facebook/callback
FRONTEND_URL=http://localhost:5173
```

## Notas

- Asegúrate de que la app de Facebook tenga el permiso `email` aprobado; de lo contrario, `email` puede no estar disponible.
- Para producción, agrega tus URLs autorizadas en Facebook for Developers.


