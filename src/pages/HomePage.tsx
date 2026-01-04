import React, { lazy, Suspense } from 'react';
import AboutMe from '@/components/homepage/AboutMe';
import Hero from '@/components/homepage/Hero';
import Navigation from '@/components/homepage/Navigation';
import { useTheme } from '@/contexts/ThemeContext';

// Lazy load components that aren't immediately visible
const BackToTop = lazy(() => import('@/components/homepage/BackToTop'));
const Blogs = lazy(() => import('@/components/homepage/Blogs'));
const Contact = lazy(() => import('@/components/homepage/Contact'));
const Experience = lazy(() => import('@/components/homepage/Experience'));
const Portfolio = lazy(() => import('@/components/homepage/Portfolio'));
const Projects = lazy(() => import('@/components/homepage/Projects'));
const Skills = lazy(() => import('@/components/homepage/Skills'));

// Loading fallback component
const SectionLoader = () => (
  <div className="w-full py-20 flex justify-center items-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 dark:border-slate-100"></div>
  </div>
);

export default function HomePage() {
  const { isDark } = useTheme();

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      <Navigation />
      <Hero />
      <AboutMe />
      
      <Suspense fallback={<SectionLoader />}>
        <Skills />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <Experience />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <Projects />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <Portfolio />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <Blogs />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <Contact />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <BackToTop />
      </Suspense>
    </div>
  );
}