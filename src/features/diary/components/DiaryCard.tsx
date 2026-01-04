import React from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, TagIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Diary } from '../types/diary.types';

interface DiaryCardProps {
    diary: Diary;
    index: number;
}

export function DiaryCard({ diary, index }: DiaryCardProps) {
    const navigate = useNavigate();

    return (
        <motion.article
      initial= {{ opacity: 0, y: 20 }
}
animate = {{ opacity: 1, y: 0 }}
transition = {{ duration: 0.4, delay: index * 0.1 }}
className = "group bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700 cursor-pointer"
onClick = {() => navigate(`/diaries/${diary.id}`)}
    >
{
    diary.imageUrl && (
        <div className="relative overflow-hidden h-48">
            <img
            src={ diary.imageUrl }
alt = { diary.title }
className = "w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
    />
    <div className="absolute top-4 left-4" >
        <span className="px-3 py-1 bg-blue-600/90 text-white text-xs font-medium rounded-full backdrop-blur-sm" >
            { diary.category }
            </span>
            </div>
            </div>
      )}

<div className="p-6" >
    <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400 mb-3" >
        <div className="flex items-center space-x-1" >
            <CalendarIcon className="w-4 h-4" />
                <span>{ new Date(diary.createdAt).toLocaleDateString() } </span>
                </div>
                </div>

                < h3 className = "text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" >
                    { diary.title }
                    </h3>

                    < p className = "text-slate-600 dark:text-slate-300 mb-4 line-clamp-3" >
                        { diary.content }
                        </p>

                        < div className = "flex flex-wrap gap-2 mt-4" >
                        {
                            diary.tags.map((tag) => (
                                <div key= { tag } className = "flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md" >
                                <TagIcon className="w-3 h-3" />
                                <span>{ tag } </span>
                            </div>
                            ))
                        }
                            </div>
                            </div>
                            </motion.article>
  );
}
