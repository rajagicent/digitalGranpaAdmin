export const AUTH_TOKEN_KEY = 'auth_token';

/**
 * Checks if a JWT token string is expired or invalid.
 */
export function isTokenExpired(token?: string | null): boolean {
  if (!token || typeof token !== 'string') return true;
  try {
    const clean = token.trim();
    const parts = clean.split('.');
    if (parts.length !== 3) return true;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json =
      typeof atob === 'function'
        ? atob(base64)
        : Buffer.from(base64, 'base64').toString('utf8');
    const payload = JSON.parse(json);
    if (!payload || typeof payload !== 'object') return true;
    if (payload.exp && typeof payload.exp === 'number') {
      // 5 second safety buffer
      return Date.now() >= payload.exp * 1000 - 5000;
    }
    return false;
  } catch {
    return true;
  }
}

/**
 * Sets the authentication token cookie and storage in the browser.
 */
export function setAuthToken(token: string): void {
  if (typeof document === 'undefined') return;
  if (!token || typeof token !== 'string' || token.trim().length === 0) return;
  const cleanToken = token.trim();
  // Set cookie with 7 days expiration
  const maxAge = 7 * 24 * 60 * 60;
  document.cookie = `${AUTH_TOKEN_KEY}=${encodeURIComponent(cleanToken)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `token=${encodeURIComponent(cleanToken)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, cleanToken);
    localStorage.setItem('token', cleanToken);
  } catch (e) {}
}

/**
 * Retrieves the authentication token from browser cookies or storage.
 * If expired or invalid, automatically cleans it up.
 */
export function getAuthToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(^|;\\s*)(${AUTH_TOKEN_KEY}|token)=([^;]*)`));
  let token = match && match[3] ? decodeURIComponent(match[3]) : null;

  if (!token) {
    try {
      token = localStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem('token');
    } catch (e) {
      token = null;
    }
  }

  if (token && isTokenExpired(token)) {
    removeAuthToken();
    return null;
  }

  return token;
}

/**
 * Removes the authentication token cookie and storage completely.
 */
export function removeAuthToken(): void {
  if (typeof document === 'undefined') return;

  const cookieNames = [AUTH_TOKEN_KEY, 'token', 'dg_admin_token_session'];
  const paths = ['/', '', '/login', '/api'];
  const host = typeof window !== 'undefined' ? window.location.hostname : '';
  const domains = ['', host, `.${host}`];

  cookieNames.forEach((name) => {
    paths.forEach((path) => {
      domains.forEach((domain) => {
        const domainStr = domain ? `; domain=${domain}` : '';
        const pathStr = `; path=${path || '/'}`;
        document.cookie = `${name}=; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT${pathStr}${domainStr}; SameSite=Lax`;
        document.cookie = `${name}=; max-age=-1; expires=Thu, 01 Jan 1970 00:00:00 GMT${pathStr}${domainStr}; SameSite=Lax`;
      });
    });
  });

  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem('token');
    localStorage.removeItem('admin_user');
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
    }
  } catch (e) {}
}

/**
 * Checks if the client has a valid, non-expired authentication token.
 */
export function isAuthenticated(): boolean {
  return Boolean(getAuthToken());
}

