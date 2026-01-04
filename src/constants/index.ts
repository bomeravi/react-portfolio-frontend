// src/constants/index.ts

export const PERSONAL_INFO = {
  name: import.meta.env.VITE_NAME || 'Saroj Bhandari',
  email: import.meta.env.VITE_EMAIL || 'sarojbhandari012@gmail.com',
  phone: import.meta.env.VITE_PHONE || '+977 984-100-8600',
  location: import.meta.env.VITE_LOCATION || 'Kathmandu, Nepal',
};

export const SOCIAL_LINKS = {
  github: import.meta.env.VITE_GITHUB_URL || 'https://github.com/bomeravi',
  linkedin: import.meta.env.VITE_LINKEDIN_URL || 'https://www.linkedin.com/in/saroj-bhandari-a5b0901a5/',
  twitter: import.meta.env.VITE_TWITTER_URL || 'https://twitter.com',
  instagram: import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com',
};

export const SITE_CONFIG = {
  title: import.meta.env.VITE_SITE_TITLE || 'Saroj Bhandari - Full Stack Developer',
  description: import.meta.env.VITE_SITE_DESCRIPTION || 'Full Stack Developer specializing in modern web technologies',
  url: import.meta.env.VITE_SITE_URL || 'https://saroj.name.np',
};

export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://web.saroj.name.np',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
};

// Type-safe access to environment variables
export const ENV = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,
} as const;