import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Skill = {
  id: number;
  name: string;
  level: number;
  tags: string[];
};

type SkillCategory = "ALL" | string;

// use Vite env var for API base (fallback to localhost)
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export default function Skills() {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set()
  );

  const { data = [], isLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: async (): Promise<Skill[]> => {
      const res = await axios.get(
        `${API_BASE}/api/v1/skills/list?location=homepage`
      );
      // backend may wrap data in .data.data or return array directly — handle both
      return (res.data?.data ?? res.data) as Skill[];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  if (isLoading) {
    return (
      <section id="skills" className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              My Skills
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
              Loading skills...
            </p>
            <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full" />
          </motion.div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        </div>
      </section>
    );
  }

  if (!data || data.length === 0) {
    return (
      <section id="skills" className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              My Skills
            </h2>
            <p className="text-xl text-red-600 dark:text-red-400">
              No skills found
            </p>
            <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full" />
          </motion.div>
        </div>
      </section>
    );
  }

  const allTags = Array.from(new Set(data.flatMap((skill) => skill.tags)));
  const categories: SkillCategory[] = ["ALL", ...allTags];

  const toggleCategory = (category: string) => {
    if (category === "ALL") {
      setSelectedCategories(new Set());
      return;
    }

    const next = new Set(selectedCategories);
    if (next.has(category)) next.delete(category);
    else next.add(category);

    // If every individual tag is selected, clear (treat as ALL)
    if (next.size === allTags.length) {
      setSelectedCategories(new Set());
      return;
    }

    setSelectedCategories(next);
  };

  const filteredSkills =
    selectedCategories.size === 0
      ? data
      : data.filter((skill) =>
          skill.tags.some((t) => selectedCategories.has(t))
        );

  return (
    <section id="skills" className="py-20 bg-slate-50 dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            My Skills
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
            Technologies and tools I work with
          </p>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full" />
        </motion.div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => {
            const isAll = category === "ALL";
            const isActive = isAll
              ? selectedCategories.size === 0
              : selectedCategories.has(category);
            return (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600"
                }`}
              >
                {category}
              </motion.button>
            );
          })}
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {skill.name}
                </h3>
                <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                  {skill.level}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-4 overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${skill.level}%` }}
                />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {skill.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full text-slate-700 dark:text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              No skills found for the selected categories.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
