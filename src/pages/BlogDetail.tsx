import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, User, Share2, Tag } from 'lucide-react';
import { BlogService } from '@/features/blog/services/blog.service';
import { ROUTES } from '@/constants/routes';

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => BlogService.getBySlug(slug!),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

  const blog = response?.data;

  React.useEffect(() => {
    if (blog?.title) {
        document.title = `${blog.title} | My Portfolio`;
    }

    return () => {
        document.title = 'My Portfolio';
    }
  }, [blog?.title]);

  if (isLoading) {
    return (
      <div className= "min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 flex justify-center items-center" >
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className= "min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 flex justify-center items-center" >
      <div className="text-center" >
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4" >
          Blog post not found
            </h2>
            < Link
    to = { ROUTES.BLOG.LIST }
    className = "text-blue-600 dark:text-blue-400 hover:underline"
      >
      Return to blogs
        </Link>
        </div>
        </div>
    );
  }

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate(ROUTES.HOME);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <button
            onClick={handleBack}
            className="inline-flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </motion.div>

      < motion.article
initial = {{ opacity: 0, y: 20 }}
animate = {{ opacity: 1, y: 0 }}
transition = {{ duration: 0.6 }}
        >
  <div className="mb-8" >
    <div className="flex flex-wrap gap-2 mb-4" >
      <span className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30 rounded-full" >
        { blog.category.name }
        </span>
        </div>
        < h1 className = "text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight" >
          { blog.title }
          </h1>

          < div className = "flex flex-wrap items-center gap-6 text-slate-600 dark:text-slate-400 mb-8" >
            <div className="flex items-center space-x-2" >
              {
                blog.user.avatar ? (
                  <img src= { blog.user.avatar } alt={ blog.user.name } className="w-6 h-6 rounded-full" />
                ) : (
                    <User className="w-5 h-5" />
                )}
<span>{ blog.user.name } </span>
  </div>
  < div className = "flex items-center space-x-2" >
    <Calendar className="w-5 h-5" />
      <span>{ new Date(blog.created_at).toLocaleDateString('en-CA') } </span>
      </div>
{
  blog.reading_time && (
    <div className="flex items-center space-x-2" >
      <Clock className="w-5 h-5" />
        <span>{ blog.reading_time } minutes</span>
        </div>
              )
}
</div>

          {/* <button className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
            <Share2 className="w-5 h-5" />
            <span>Share this post</span>
          </button> */}
        </div>

{
  blog.featured_image && (
    <div className="relative w-full h-96 rounded-2xl overflow-hidden mb-12 shadow-2xl" >
      <img
            src={ blog.featured_image }
  alt = { blog.title }
  className = "w-full h-full object-cover"
    />
    </div>
      )
}

<div className="prose prose-lg dark:prose-invert max-w-none" >
  <div dangerouslySetInnerHTML={ { __html: blog.content } } />
    </div>

{
  blog.tags && blog.tags.length > 0 && (
    <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700" >
      <div className="flex flex-wrap gap-2" >
      {
        blog.tags.map((tag, index) => (
          <span
                key= { tag.slug }
                className = "flex items-center gap-1 px-3 py-1 text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-full"
          >
          <Tag className="w-3 h-3" />
          { tag.name }
        </span>
        ))
      }
        </div>
        </div>
      )
}

<div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700" >
  <div className="flex items-center space-x-4" >
    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold overflow-hidden" >
      {
        blog.user.avatar ? (
          <img src= { blog.user.avatar } alt={ blog.user.name } className="w-full h-full object-cover" />
                ) : (
            <span>{ blog.user.name.charAt(0) } </span>
          )}
</div>
  < div >
  <h3 className="text-lg font-bold text-slate-900 dark:text-white" >
    { blog.user.name }
    </h3>
    < p className = "text-slate-600 dark:text-slate-400" >
      Author
      </p>
      </div>
      </div>
      </div>
      </motion.article>
      </div>
      </div>
  );
}