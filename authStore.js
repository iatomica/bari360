// Authentication store for Barivision 360 Admin Mode

const AUTH_KEY = 'barivision_360_admin_session';
const DEFAULT_ADMIN_PASS = 'admin';

export function isLoggedIn() {
  return sessionStorage.getItem(AUTH_KEY) === 'true';
}

export function loginAdmin(password) {
  if (password === DEFAULT_ADMIN_PASS) {
    sessionStorage.setItem(AUTH_KEY, 'true');
    return { success: true };
  }
  return { success: false, message: 'Contraseña incorrecta' };
}

export function logoutAdmin() {
  sessionStorage.removeItem(AUTH_KEY);
}
