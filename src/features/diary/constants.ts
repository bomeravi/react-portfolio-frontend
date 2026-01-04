export const DIARY_API_ROUTES = {
    LIST: '/api/v1/diaries',
    CREATE: '/api/v1/diaries',
    DETAIL: (id: string) => `/api/v1/diaries/${id}`,
    UPDATE: (id: string) => `/api/v1/diaries/${id}`,
    DELETE: (id: string) => `/api/v1/diaries/${id}`,
} as const;
