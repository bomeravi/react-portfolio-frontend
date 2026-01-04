import React from "react";
import { motion } from "framer-motion";
import { BriefcaseIcon, CalendarIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// use Vite env var for API base (fallback to localhost)
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

interface Experience {
  id: number;
  title: string;
  company: string;
  start_date: string;
  end_date: string | null;
  current: boolean;
  description: string;
  achievements: string[];
  display_month: boolean;
  created_at: string;
  updated_at: string;
}

const fetchExperiences = async (): Promise<Experience[]> => {
  const response = await axios.get<Experience[]>(
    `${API_BASE}/api/v1/experiences/list?location=homepage`
  );
  return response.data;
};

const formatDate = (dateString: string, displayMonth: boolean): string => {
  const date = new Date(dateString);
  if (displayMonth) {
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  }
  return date.getFullYear().toString();
};

const formatPeriod = (
  startDate: string,
  endDate: string | null,
  current: boolean,
  displayMonth: boolean
): string => {
  const start = formatDate(startDate, displayMonth);
  const end = current
    ? "Present"
    : endDate
    ? formatDate(endDate, displayMonth)
    : "Present";
  return `${start} - ${end}`;
};

export default function Experience() {
  const {
    data: experiences,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["experiences"],
    queryFn: fetchExperiences,
  });

  if (isLoading) {
    return (
      <section id="experience" className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Work Experience
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
              Loading experiences...
            </p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-blue-200 dark:bg-blue-900" />
            <div className="space-y-12">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className={`relative grid md:grid-cols-2 gap-8 items-center ${
                    index % 2 === 0 ? "md:text-right" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white dark:border-slate-900" />
                  <div
                    className={`${
                      index % 2 === 0 ? "md:col-start-1" : "md:col-start-2"
                    } bg-slate-50 dark:bg-slate-800 p-8 rounded-xl shadow-lg animate-pulse`}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-slate-300 dark:bg-slate-600 rounded-lg w-9 h-9"></div>
                      <div className="w-32 h-4 bg-slate-300 dark:bg-slate-600 rounded"></div>
                    </div>
                    <div className="h-6 bg-slate-300 dark:bg-slate-600 rounded mb-2"></div>
                    <div className="h-5 bg-slate-300 dark:bg-slate-600 rounded mb-4 w-3/4"></div>
                    <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded mb-4"></div>
                    <div className="space-y-2">
                      {[...Array(3)].map((_, idx) => (
                        <div
                          key={idx}
                          className="h-3 bg-slate-300 dark:bg-slate-600 rounded w-full"
                        ></div>
                      ))}
                    </div>
                  </div>
                  <div className="hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="experience" className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Work Experience
          </h2>
          <p className="text-xl text-red-600 dark:text-red-400">
            Error loading experiences:{" "}
            {axios.isAxiosError(error)
              ? error.response?.data?.message || error.message
              : (error as Error).message}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Work Experience
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
            My professional journey and career highlights
          </p>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full" />
        </motion.div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-blue-200 dark:bg-blue-900" />

          <div className="space-y-12">
            {experiences?.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`relative grid md:grid-cols-2 gap-8 items-center ${
                  index % 2 === 0 ? "md:text-right" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline Dot */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white dark:border-slate-900" />

                {/* Content */}
                <div
                  className={`${
                    index % 2 === 0 ? "md:col-start-1" : "md:col-start-2"
                  } bg-slate-50 dark:bg-slate-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow`}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <BriefcaseIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                      <CalendarIcon className="w-4 h-4" />
                      <span className="font-medium">
                        {formatPeriod(
                          exp.start_date,
                          exp.end_date,
                          exp.current,
                          exp.display_month
                        )}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {exp.title}
                  </h3>

                  <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold mb-4">
                    {exp.company}
                  </p>

                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    {exp.description}
                  </p>

                  <ul className="space-y-2">
                    {exp.achievements.map((achievement, idx) => (
                      <li
                        key={idx}
                        className="flex items-start space-x-2 text-slate-600 dark:text-slate-300"
                      >
                        <span className="text-blue-600 dark:text-blue-400 mt-1">
                          •
                        </span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Empty space for alternating layout */}
                <div className="hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
