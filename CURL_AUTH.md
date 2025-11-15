# Comandos cURL para Endpoints de Autenticación

Base URL: `http://localhost:3000` (ajusta según tu configuración)

## 1. Registro de Usuario
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "123456",
    "age": 25,
    "city": "La Paz",
    "rubro": "Tecnología",
    "roles": "user"
  }'
```

### Registro con todos los campos opcionales
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "123456",
    "age": 30,
    "city": "Cochabamba",
    "rubro": "Administración",
    "moduleId": "uuid-del-modulo",
    "roles": "admin"
  }'
```

## 2. Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "123456"
  }'
```

**Respuesta esperada:**
```json
{
  "id": "uuid",
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "roles": "user",
  "token": "jwt-token-aqui"
}
```

## 3. Verificar Contraseña (Requiere Token)
```bash
curl -X POST http://localhost:3000/auth/verify-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_JWT_AQUI" \
  -d '{
    "password": "123456"
  }'
```

## 4. Establecer Contraseña (Requiere Token - Solo para usuarios sin contraseña)
```bash
curl -X POST http://localhost:3000/auth/set-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_JWT_AQUI" \
  -d '{
    "password": "nueva123456",
    "confirmPassword": "nueva123456"
  }'
```

## 5. Verificar si tiene Contraseña (Requiere Token)
```bash
curl -X GET http://localhost:3000/auth/check-password \
  -H "Authorization: Bearer TU_TOKEN_JWT_AQUI"
```

## 6. Refrescar Token (Requiere Token)
```bash
curl -X GET http://localhost:3000/auth/refresh-token \
  -H "Authorization: Bearer TU_TOKEN_JWT_AQUI"
```

## 7. Ruta Privada de Prueba (Requiere Token)
```bash
curl -X GET http://localhost:3000/auth/private \
  -H "Authorization: Bearer TU_TOKEN_JWT_AQUI"
```

## 8. Ruta Privada Solo Admin (Requiere Token + Rol Admin)
```bash
curl -X GET http://localhost:3000/auth/private2 \
  -H "Authorization: Bearer TU_TOKEN_JWT_AQUI"
```

## 9. Ruta Privada Solo Admin (Alternativa) (Requiere Token + Rol Admin)
```bash
curl -X GET http://localhost:3000/auth/private3 \
  -H "Authorization: Bearer TU_TOKEN_JWT_AQUI"
```

---

## Ejemplo de Flujo Completo

### Paso 1: Registrar un usuario
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "123456",
    "roles": "user"
  }'
```

### Paso 2: Guardar el token de la respuesta y hacer login
```bash
# Guarda el token de la respuesta anterior o haz login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456"
  }'
```

### Paso 3: Usar el token para acceder a rutas protegidas
```bash
# Reemplaza TU_TOKEN_JWT_AQUI con el token obtenido
TOKEN="tu-token-jwt-aqui"

curl -X GET http://localhost:3000/auth/private \
  -H "Authorization: Bearer $TOKEN"
```

---

## Notas Importantes

- **Token JWT**: Todos los endpoints protegidos requieren el token en el header `Authorization: Bearer <token>`
- **Roles**: Los roles válidos son `user` y `admin`
- **Email**: Se normaliza automáticamente a minúsculas
- **Contraseña**: Mínimo 6 caracteres, máximo 50 caracteres
- **Set Password**: Solo funciona para usuarios que no tienen contraseña (usuarios de Google)

---

## Variables de Entorno para Testing

Puedes crear un archivo `.env.test` o usar variables en tu terminal:

```bash
export BASE_URL="http://localhost:3000"
export TOKEN="tu-token-jwt-aqui"
export USER_EMAIL="test@example.com"
export USER_PASSWORD="123456"
```

Luego usar en los comandos:
```bash
curl -X GET $BASE_URL/auth/private \
  -H "Authorization: Bearer $TOKEN"
```

