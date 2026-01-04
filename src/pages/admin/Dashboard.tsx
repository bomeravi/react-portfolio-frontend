import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';

// Lazy load all route components
const AdminProfile = lazy(() => import('./Profile'));
const AdminEditProfile = lazy(() => import('./EditProfile'));
const AdminBlogs = lazy(() => import('./AdminBlogs'));
const AdminCategories = lazy(() => import('./AdminCategories'));
const Settings = lazy(() => import('../Settings'));

// Loading fallback component
const RouteLoader = () => (
  <div className="flex justify-center items-center min-h-[60vh]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-slate-900 dark:border-slate-100 mx-auto mb-4"></div>
      <p className="text-slate-600 dark:text-slate-400">Loading...</p>
    </div>
  </div>
);

export default function Dashboard() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route 
          path="/" 
          element={
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              Dashboard Home
            </div>
          } 
        />
        <Route 
          path="/blogs" 
          element={
            <Suspense fallback={<RouteLoader />}>
              <AdminBlogs />
            </Suspense>
          } 
        />
        <Route 
          path="/categories" 
          element={
            <Suspense fallback={<RouteLoader />}>
              <AdminCategories />
            </Suspense>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <Suspense fallback={<RouteLoader />}>
              <AdminProfile />
            </Suspense>
          } 
        />
        <Route 
          path="/profile/edit" 
          element={
            <Suspense fallback={<RouteLoader />}>
              <AdminEditProfile />
            </Suspense>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <Suspense fallback={<RouteLoader />}>
              <Settings />
            </Suspense>
          } 
        />
      </Route>
    </Routes>
  );
}