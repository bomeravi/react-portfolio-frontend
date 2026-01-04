import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { BlogService } from '@/features/blog/services/blog.service';
import BlogListFilters from '@/features/blog/components/BlogListFilters';
import { ROUTES } from '@/constants/routes';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';

export default function BlogList() {
    const [searchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    React.useEffect(() => {
        document.title = 'Our Blog | My Portfolio';
    }, []);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['blogs', { page, search, category }],
        queryFn: () => BlogService.getAll({ page, search, category, limit: 9 }),
    });

    if (isLoading) {
        return (
            <div className= "min-h-screen flex justify-center items-center" >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                </div>
        );
    }

    if (isError) {
        return (
            <div className= "min-h-screen flex justify-center items-center" >
            <p className="text-red-600" > Error loading blogs.Please try again.</p>
                </div>
        );
    }

    return (
        <div className= "max-w-7xl mx-auto px-4 py-8" >
        <div className="mb-12 text-center" >
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4" >
                Our Blog
                    </h1>
                    < p className = "text-lg text-slate-600 dark:text-slate-400" >
                        Latest thoughts, ideas, and insights
                            </p>
                            </div>

                            < div className = "mb-8" >
                                <BlogListFilters />
                                </div>

                                < div className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" >
                                {
                                    data?.data.map((blog, index) => (
                                        <motion.article
                            key= { blog.id }
                            initial = {{ opacity: 0, y: 20 }}
    animate = {{ opacity: 1, y: 0 }
}
transition = {{ delay: index * 0.1 }}
className = "bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
    {

    blog.featured_image && (
        <div className="h-48 overflow-hidden" >
            <img
                                                src={ blog.featured_image }
    alt = { blog.title }
    className = "w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        </div>
                                    )
                                }
<div className="p-6" >
    <div className="flex items-center gap-2 mb-4" >
        <span className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30 rounded-full" >
            { blog.category.name }
            </span>
            < span className = "text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1" >
                <Calendar className="w-3 h-3" />
                    { new Date(blog.created_at).toLocaleDateString("en-CA") }
                    </span>
                    </div>
                    < h2 className = "text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2" >
                        <Link
                                        to={ ROUTES.BLOG.DETAIL(blog.slug) }
className = "hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
    >
    { blog.title }
    </Link>
    </h2>
    < p className = "text-slate-600 dark:text-slate-400 mb-4 line-clamp-3" >
        { blog.description }
        </p>
        < div className = "flex items-center justify-between mt-auto" >
            <div className="flex items-center gap-2" >
                {
                    blog.user.avatar ? (
                        <img
                                                src= { blog.user.avatar }
                                                alt={ blog.user.name }
                                                className="w-8 h-8 rounded-full"
                    />
                                        ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center" >
                    <User className="w-4 h-4 text-slate-500" />
                    </div>
                    )}
<span className="text-sm text-slate-600 dark:text-slate-400 font-medium" >
    { blog.user.name }
    </span>
    </div>
    < Link
to = { ROUTES.BLOG.DETAIL(blog.slug) }
className = "inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:gap-2 transition-all"
    >
    Read More < ArrowRight className = "w-4 h-4 ml-1" />
        </Link>
        </div>
        </div>
        </motion.article>
                    ))}
</div>

{/* Pagination */ }
{
    data && data.meta && data.meta.last_page > 1 && (
        <div className="mt-12 flex justify-center gap-2" >
        {
            Array.from({ length: data.meta.last_page }, (_, i) => i + 1).map((pageNum) => (
                <Link
                                key= { pageNum }
                                to = {`?page=${pageNum}${search ? `&search=${search}` : ""}${category ? `&category=${category}` : ""}`}
    className = {`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${page === pageNum
        ? "bg-blue-600 text-white"
        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
        }`
}
                            >
    { pageNum }
    </Link>
                        ))}
</div>
                )}
</div>
    );
}