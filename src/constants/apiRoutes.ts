export const AUTH_ROUTES = {
    LOGIN: '/api/v1/login',
    REFRESH: '/api/v1/refresh',
    LOGOUT: '/api/v1/logout',
} as const;

export const USER_ROUTES = {
    PROFILE: '/api/v1/me',
    SETTINGS: '/api/v1/settings',
} as const;
