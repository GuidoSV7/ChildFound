

export interface JwtPayload {
    id: string;
    sub: string; // Alias para id (estándar JWT)
    roles: string; // Rol del usuario
}
