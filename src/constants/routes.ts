export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    BLOG: {
        LIST: '/blogs',
        DETAIL: (slug: string) => `/blog/${slug}`,
        ROUTE: '/blog/:slug',
    },
    DIARY: {
        LIST: '/diaries',
        CREATE: '/diaries/new',
        DETAIL: (id: string | number) => `/diaries/${id}`,
        DETAIL_ROUTE: '/diaries/:id',
        EDIT: (id: string | number) => `/diaries/${id}/edit`,
        EDIT_ROUTE: '/diaries/:id/edit',
    },
    ADMIN: {
        DASHBOARD: '/admin/*',
    },
} as const;
