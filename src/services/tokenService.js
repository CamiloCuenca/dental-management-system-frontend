/**
 * Servicio para manejar operaciones relacionadas con tokens JWT
 */
class TokenService {
    /**
     * Obtiene el token almacenado en sessionStorage
     * @returns {string|null} El token JWT o null si no existe
     */
    static getToken() {
        return sessionStorage.getItem('token');
    }

    /**
     * Establece el token en sessionStorage
     * @param {string} token - El token JWT a almacenar
     */
    static setToken(token) {
        sessionStorage.setItem('token', token);
    }

    /**
     * Decodifica el payload del token JWT
     * @returns {Object|null} El payload decodificado o null si hay error
     */
    static decodeToken() {
        const token = this.getToken();
        if (!token) return null;

        try {
            const payloadBase64 = token.split('.')[1];
            return JSON.parse(atob(payloadBase64));
        } catch (error) {
            console.error("Error al decodificar el token:", error);
            return null;
        }
    }

    /**
     * Obtiene el ID de la cuenta desde el token
     * @returns {string|null} El ID de la cuenta o null si no existe
     */
    static getAccountId() {
        const payload = this.decodeToken();
        return payload?.accountId || null;
    }

    /**
     * Obtiene el ID del usuario desde el token
     * @returns {string|null} El ID del usuario o null si no existe
     */
    static getUserId() {
        const payload = this.decodeToken();
        return payload?.userId || null;
    }

    /**
     * Obtiene el rol del usuario desde el token
     * @returns {string|null} El rol del usuario o null si no existe
     */
    static getRole() {
        const payload = this.decodeToken();
        return payload?.role || null;
    }

    /**
     * Obtiene el email del usuario desde el token
     * @returns {string|null} El email del usuario o null si no existe
     */
    static getEmail() {
        const payload = this.decodeToken();
        return payload?.email || null;
    }

    /**
     * Obtiene el nombre completo del usuario desde el token
     * @returns {string|null} El nombre completo o null si no existe
     */
    static getFullName() {
        const payload = this.decodeToken();
        if (!payload?.given_name || !payload?.family_name) return null;
        
        // Decodificar caracteres especiales
        const nombre = decodeURIComponent(escape(payload.given_name));
        const apellido = decodeURIComponent(escape(payload.family_name));
        
        return `${nombre} ${apellido}`;
    }

    /**
     * Verifica si el token ha expirado
     * @returns {boolean} true si el token ha expirado, false si no
     */
    static isTokenExpired() {
        const payload = this.decodeToken();
        if (!payload?.exp) return true;

        const currentTime = Math.floor(Date.now() / 1000);
        return currentTime >= payload.exp;
    }

    /**
     * Verifica si el usuario tiene un rol específico
     * @param {string} role - El rol a verificar
     * @returns {boolean} true si el usuario tiene el rol, false si no
     */
    static hasRole(role) {
        return this.getRole() === role;
    }

    /**
     * Verifica si el usuario tiene alguno de los roles especificados
     * @param {string[]} roles - Array de roles a verificar
     * @returns {boolean} true si el usuario tiene alguno de los roles, false si no
     */
    static hasAnyRole(roles) {
        const userRole = this.getRole();
        return roles.includes(userRole);
    }

    /**
     * Limpia el token del sessionStorage
     */
    static clearToken() {
        sessionStorage.removeItem('token');
    }

    /**
     * Verifica si el usuario está autenticado
     * @returns {boolean} true si el usuario está autenticado, false si no
     */
    static isAuthenticated() {
        return this.getToken() !== null && !this.isTokenExpired();
    }
}

export default TokenService; 