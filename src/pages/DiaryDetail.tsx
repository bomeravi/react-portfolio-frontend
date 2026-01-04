import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CalendarIcon, TagIcon, ArrowLeftIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { diaryService } from '@/features/diary/services/diaryService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import Navigation from '@/components/homepage/Navigation';

export default function DiaryDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { addToast } = useToast();
    const queryClient = useQueryClient();

    const { data: diary, isLoading, isError } = useQuery({
        queryKey: ['diary', id],
        queryFn: () => diaryService.getDiary(id!),
        enabled: !!id,
    });

    const deleteMutation = useMutation({
        mutationFn: diaryService.deleteDiary,
        onSuccess: () => {
            addToast('Diary entry deleted successfully', 'success');
            queryClient.invalidateQueries({ queryKey: ['diaries'] });
            navigate('/diaries');
        },
        onError: (error) => {
            addToast('Failed to delete diary entry', 'error');
        },
    });

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            deleteMutation.mutate(id!);
        }
    };

    if (isLoading) {
        return (
            <div className= "min-h-screen pt-20 flex justify-center items-center bg-slate-50 dark:bg-slate-900" >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                </div>
        );
    }

    if (isError || !diary) {
        return (
            <div className= "min-h-screen pt-20 flex flex-col justify-center items-center bg-slate-50 dark:bg-slate-900 text-center px-4" >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4" >
                Diary entry not found
                    </h2>
                    < button
        onClick = {() => navigate('/diaries')
    }
    className = "flex items-center space-x-2 text-blue-600 hover:text-blue-700"
        >
        <ArrowLeftIcon className="w-4 h-4" />
            <span>Back to Diaries </span>
                </button>
                </div>
        );
}

return (
    <div className= "min-h-screen bg-slate-50 dark:bg-slate-900" >
    <Navigation />
    < article className = "pt-20 pb-12" >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" >
            <button
                        onClick={ () => navigate('/diaries') }
className = "flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors"
    >
    <ArrowLeftIcon className="w-4 h-4" />
        <span>Back to Diaries </span>
            </button>

            < div className = "bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-700" >
            {
                diary.imageUrl && (
                    <div className="h-64 md:h-96 w-full relative">
                        <img
                                    src={ diary.imageUrl }
alt = { diary.title }
className = "w-full h-full object-cover"
    />
    <div className="absolute top-4 left-4" >
        <span className="px-4 py-2 bg-blue-600/90 text-white text-sm font-medium rounded-full backdrop-blur-sm shadow-lg" >
            { diary.category }
            </span>
            </div>
            </div>
                        )}

<div className="p-8 md:p-12" >
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-200 dark:border-slate-700 pb-8" >
        <div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4" >
            { diary.title }
            </h1>
            < div className = "flex items-center space-x-4 text-slate-500 dark:text-slate-400" >
                <div className="flex items-center space-x-2" >
                    <CalendarIcon className="w-5 h-5" />
                        <span>{ new Date(diary.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' }) } </span>
                        </div>
                        </div>
                        </div>

{
    isAuthenticated && (
        <div className="flex items-center space-x-3" >
            <button
                                            onClick={ () => navigate(`/diaries/${id}/edit`) }
    className = "flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
        <PencilIcon className="w-4 h-4" />
            <span>Edit </span>
            </button>
            < button
    onClick = { handleDelete }
    className = "flex items-center space-x-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
        >
        <TrashIcon className="w-4 h-4" />
            <span>Delete </span>
            </button>
            </div>
                                )
}
</div>

    < div className = "prose prose-lg dark:prose-invert max-w-none mb-8" >
    {
        diary.content.split('\n').map((paragraph, idx) => (
            <p key= { idx } className = "mb-4 text-slate-700 dark:text-slate-300 leading-relaxed" >
            { paragraph }
            </p>
        ))
    }
        </div>

        < div className = "flex flex-wrap gap-2 pt-8 border-t border-slate-200 dark:border-slate-700" >
        {
            diary.tags.map((tag) => (
                <div key= { tag } className = "flex items-center space-x-1 text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-full" >
                <TagIcon className="w-3 h-3" />
                <span>{ tag } </span>
            </div>
            ))
        }
            </div>
            </div>
            </div>
            </div>
            </article>
            </div>
    );
}
