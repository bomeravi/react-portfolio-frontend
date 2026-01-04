import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  image: string;
  description?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const fetchPortfolioItems = async (): Promise<PortfolioItem[]> => {
  const response = await axios.get<PortfolioItem[]>(
    `${API_BASE}/api/v1/portfolios/list?location=homepage`
  );
  return response.data;
};

export default function Portfolio() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");

  const {
    data: portfolioItems,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["portfolio"],
    queryFn: fetchPortfolioItems,
  });

  // Get unique categories from portfolio items
  const categories = portfolioItems
    ? ["All", ...new Set(portfolioItems.map((item) => item.category))]
    : ["All"];

  const filteredItems =
    filter === "All"
      ? portfolioItems
      : portfolioItems?.filter((item) => item.category === filter);

  // Fix for navigation highlight
  React.useEffect(() => {
    const handleScroll = () => {
      const portfolioSection = document.getElementById("portfolio");
      if (portfolioSection) {
        const rect = portfolioSection.getBoundingClientRect();
        const isInView = rect.top <= 100 && rect.bottom >= 100;

        // Update navigation highlight
        const navLinks = document.querySelectorAll('nav a[href*="#"]');
        navLinks.forEach((link) => {
          if (link.getAttribute("href") === "#portfolio") {
            if (isInView) {
              link.classList.add("text-blue-600", "dark:text-blue-400");
              link.classList.remove("text-slate-600", "dark:text-slate-300");
            } else {
              link.classList.remove("text-blue-600", "dark:text-blue-400");
              link.classList.add("text-slate-600", "dark:text-slate-300");
            }
          }
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return (
      <section id="portfolio" className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Portfolio Gallery
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
              Loading portfolio items...
            </p>
            <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full mb-8" />

            {/* Skeleton filter buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="w-20 h-10 bg-slate-300 dark:bg-slate-600 rounded-full animate-pulse"
                />
              ))}
            </div>
          </motion.div>

          {/* Skeleton gallery grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse bg-white dark:bg-slate-700 rounded-xl shadow-lg h-64"
              >
                <div className="w-full h-full bg-slate-300 dark:bg-slate-600 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="portfolio" className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Portfolio Gallery
          </h2>
          <p className="text-xl text-red-600 dark:text-red-400">
            Error loading portfolio:{" "}
            {axios.isAxiosError(error)
              ? error.response?.data?.message || error.message
              : (error as Error).message}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="py-20 bg-slate-50 dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Portfolio Gallery
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
            A collection of my design work and creative projects
          </p>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full mb-8" />

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  filter === category
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600"
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems?.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
              onClick={() => setSelectedImage(item.image)}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                <div className="p-6">
                  <p className="text-sm text-blue-400 font-medium mb-1">
                    {item.category}
                  </p>
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  {item.description && (
                    <p className="text-slate-200 text-sm mt-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <button
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                onClick={() => setSelectedImage(null)}
              >
                <XIcon className="w-6 h-6 text-white" />
              </button>
              <motion.img
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                src={selectedImage}
                alt="Portfolio item"
                className="max-w-full max-h-full rounded-lg object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
