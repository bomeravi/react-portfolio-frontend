import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BlogService } from "@/features/blog/services/blog.service";
import { ROUTES } from "@/constants/routes";
import type { Blog } from "@/features/blog/types/blog.interface";

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function Blogs() {
  const navigate = useNavigate();

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blogs", "latest"],
    queryFn: () => BlogService.getAll({ limit: 3, page: 1 }),
  });

  const blogs = response?.data || [];

  if (isLoading) {
    return (
      <section id= "blogs" className = "py-20 bg-white dark:bg-slate-900" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" >
          <motion.div
            initial={ { opacity: 0, y: 20 } }
    whileInView = {{ opacity: 1, y: 0 }
  }
  viewport = {{ once: true }
}
transition = {{ duration: 0.6 }}
className = "text-center mb-16"
  >
  <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4" >
    Latest Blog Posts
      </h2>
      < p className = "text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8" >
        Loading blog posts...
</p>
  < div className = "w-20 h-1 bg-blue-600 mx-auto rounded-full" />
    </motion.div>

    < div className = "grid md:grid-cols-2 lg:grid-cols-3 gap-8" >
    {
      [...Array(3)].map((_, index) => (
        <div
                key= { index }
                className = "animate-pulse bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700"
        >
        <div className="h-48 bg-slate-300 dark:bg-slate-600" > </div>
      < div className = "p-6" >
      <div className="flex items-center space-x-4 mb-3" >
      <div className="w-20 h-4 bg-slate-300 dark:bg-slate-600 rounded" > </div>
      < div className = "w-16 h-4 bg-slate-300 dark:bg-slate-600 rounded" > </div>
      </div>
      < div className = "h-6 bg-slate-300 dark:bg-slate-600 rounded mb-3" > </div>
      < div className = "space-y-2 mb-4" >
      <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded" > </div>
      < div className = "h-4 bg-slate-300 dark:bg-slate-600 rounded w-5/6" > </div>
      </div>
      < div className = "w-24 h-4 bg-slate-300 dark:bg-slate-600 rounded" > </div>
      </div>
      </div>
      ))
    }
      </div>
      </div>
      </section>
    );
  }

if (error) {
  return (
    <section id= "blogs" className = "py-20 bg-white dark:bg-slate-900" >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" >
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4" >
          Latest Blog Posts
            </h2>
            < p className = "text-xl text-red-600 dark:text-red-400" >
              Error loading blogs: { " " }
  { (error as Error).message }
  </p>
    </div>
    </section>
    );
}

return (
  <section id= "blogs" className = "py-20 bg-white dark:bg-slate-900" >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" >
      <motion.div
          initial={ { opacity: 0, y: 20 } }
whileInView = {{ opacity: 1, y: 0 }}
viewport = {{ once: true }}
transition = {{ duration: 0.6 }}
className = "text-center mb-16"
  >
  <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4" >
    Latest Blog Posts
      </h2>
      < p className = "text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8" >
        Thoughts, tutorials, and insights from my journey
          </p>
          < div className = "w-20 h-1 bg-blue-600 mx-auto rounded-full" />
            </motion.div>

            < div className = "grid md:grid-cols-2 lg:grid-cols-3 gap-8" >
            {
              blogs.map((blog: Blog, index: number) => (
                <motion.article
              key= { blog.id }
              initial = {{ opacity: 0, y: 50 }}
whileInView = {{ opacity: 1, y: 0 }}
viewport = {{ once: true }}
transition = {{ duration: 0.5, delay: index * 0.1 }}
className = "group bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700"
  >
  <div className="relative overflow-hidden h-48" >
                  {
  blog.featured_image && (
    <img
                    src={ blog.featured_image }
  alt = { blog.title }
  className = "w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
    />
                  )
}
<div className="absolute top-4 left-4" >
  <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full" >
    { blog.category.name }
    </span>
    </div>
    </div>
    < div className = "p-6" >
      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-3" >
        <div className="flex items-center space-x-4" >
          <div className="flex items-center space-x-1" >
            <Calendar className="w-4 h-4" />
              <span>{ formatDate(blog.created_at) } </span>
              </div>
{
  blog.reading_time && (
    <div className="flex items-center space-x-1" >
      <Clock className="w-4 h-4" />
        <span>{ blog.reading_time } </span>
        </div>
                    )
}
</div>
{
  blog?.user?.name && (
    <div className="flex items-center space-x-1" >
      <User className="w-4 h-4" />
        <span>{ blog.user.name } </span>
        </div>
                  )
}
</div>

  < h3 className = "text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" >
    { blog.title }
    </h3>

    < p className = "text-slate-600 dark:text-slate-300 mb-4 line-clamp-3" >
      { blog.description }
      </p>

      < div className = "flex flex-wrap gap-2 mb-4" >
      {
        blog.tags.slice(0, 3).map((tag) => (
          <span
            key= { tag.slug }
            className = "px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded"
          >
            #{ tag.name }
        </span>
        ))
      }
{
  blog.tags.length > 3 && (
    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded" >
      +{ blog.tags.length - 3 } more
        </span>
                  )
}
</div>

  < button
onClick = {() => navigate(ROUTES.BLOG.DETAIL(blog.slug))}
className = "flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium group"
  >
  <span>Read More </span>
    < ArrowRight className = "w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
      </div>
      </motion.article>
          ))}
</div>
  </div>
  </section>
  );
}
