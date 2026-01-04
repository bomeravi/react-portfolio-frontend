# My Portfolio

A personal portfolio website built with React, TypeScript, and Vite.

## Homepage

The homepage showcases my personal portfolio with sections for projects, skills, and contact information.

## Backend

For the backend API, use [laravel-portfolio-backend](https://github.com/bomeravi/laravel-portfolio-backend).

## Important Nodes

> [!NOTE] > `public/_redirects` is used for Cloudflare Pages hosting. It contains the redirect rule `/* /index.html 200` to enable SPA (Single Page Application) routing.

## Setup Instructions

### Requirements

- **Node.js**: v20.19.4
- **npm**: 11.5.2

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd github_react_portfolio
   ```

2. Copy environment file:

   ```bash
   cp .env.example .env
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

### Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

| Variable                      | Description                         |
| ----------------------------- | ----------------------------------- |
| `VITE_API_BASE_URL`           | Base URL for API requests           |
| `VITE_API_TIMEOUT`            | API request timeout in milliseconds |
| `VITE_AUTH_SERVICE_BASE_URL`  | Auth service URL                    |
| `VITE_USER_SERVICE_BASE_URL`  | User service URL                    |
| `VITE_BLOG_SERVICE_BASE_URL`  | Blog service URL                    |
| `VITE_DIARY_SERVICE_BASE_URL` | Diary service URL                   |
| `VITE_CDN_SERVICE_BASE_URL`   | CDN service URL                     |
| `VITE_NAME`                   | Your display name                   |
| `VITE_EMAIL`                  | Your email address                  |
| `VITE_PHONE`                  | Your phone number                   |
| `VITE_DISPLAY_PHONE`          | Phone number for display            |
| `VITE_LOCATION`               | Your location                       |
| `VITE_ADDRESS`                | Your address                        |
| `VITE_GITHUB_URL`             | GitHub profile URL                  |
| `VITE_LINKEDIN_URL`           | LinkedIn profile URL                |
| `VITE_TWITTER_URL`            | Twitter profile URL                 |
| `VITE_INSTAGRAM_URL`          | Instagram profile URL               |
| `VITE_SITE_TITLE`             | Website title for SEO               |
| `VITE_SITE_DESCRIPTION`       | Website description for SEO         |
| `VITE_SITE_URL`               | Website URL                         |
| `VITE_GA_TRACKING_ID`         | Google Analytics tracking ID        |

### Available Scripts

| Script            | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |
