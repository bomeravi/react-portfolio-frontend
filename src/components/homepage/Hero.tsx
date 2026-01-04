import React from "react";
import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
export default function Hero() {
  // Environment variables for Vite
  const githubUrl = import.meta.env.VITE_GITHUB_URL || "https://github.com";
  const linkedinUrl =
    import.meta.env.VITE_LINKEDIN_URL || "https://linkedin.com";
  const email = import.meta.env.VITE_EMAIL || "hello@example.com";

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Clean Background - Using Tailwind dark mode */}
      <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 to-transparent dark:from-blue-500/10 dark:via-transparent dark:to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-100 to-transparent dark:from-purple-500/10 dark:via-transparent dark:to-transparent" />
      </div>

      {/* Subtle Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 dark:bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 dark:bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 text-center lg:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
            >
              <span className="text-slate-900 dark:text-white">Hi, I'm</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 bg-clip-text text-transparent">
                Saroj Bhandari
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl font-semibold text-blue-700 dark:text-blue-300"
            >
              Full Stack Developer
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0"
            >
              I create beautiful, functional, and user-friendly digital
              experiences. Specializing in modern web technologies and creative
              problem solving.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("projects")}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                View Projects
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("contact")}
                className="px-8 py-3 border-2 border-slate-300 dark:border-slate-600 hover:border-blue-600 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 font-semibold rounded-lg transition-all duration-300"
              >
                Get In Touch
              </motion.button>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex justify-center lg:justify-start space-x-4 pt-6"
            >
              <motion.a
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/80 dark:bg-white/10 hover:bg-blue-100 dark:hover:bg-blue-500/30 backdrop-blur-sm rounded-full transition-all duration-300 border border-slate-200 dark:border-white/10 hover:border-blue-400 shadow-sm"
              >
                <Github className="w-6 h-6 text-slate-700 dark:text-white" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/80 dark:bg-white/10 hover:bg-blue-100 dark:hover:bg-blue-500/30 backdrop-blur-sm rounded-full transition-all duration-300 border border-slate-200 dark:border-white/10 hover:border-blue-400 shadow-sm"
              >
                <Linkedin className="w-6 h-6 text-slate-700 dark:text-white" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                href={`mailto:${email}`}
                className="p-3 bg-white/80 dark:bg-white/10 hover:bg-blue-100 dark:hover:bg-blue-500/30 backdrop-blur-sm rounded-full transition-all duration-300 border border-slate-200 dark:border-white/10 hover:border-blue-400 shadow-sm"
              >
                <Mail className="w-6 h-6 text-slate-700 dark:text-white" />
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Profile Image - Hidden on mobile, shown on desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Subtle glow effect */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-2xl"
              />
              <div className="relative rounded-2xl overflow-hidden border-2 border-white dark:border-blue-400/30 shadow-xl">
                <img
                  src={`${API_BASE}/assets/images/photo.jpg`}
                  alt="Saroj Bhandari"
                  className="w-64 h-64 md:w-80 md:h-80 object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        onClick={() => scrollToSection("about")}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="p-2 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-slate-200 dark:border-white/20 shadow-sm"
        >
          <ArrowDown className="w-6 h-6 text-slate-700 dark:text-white" />
        </motion.div>
      </motion.button>
    </section>
  );
}
