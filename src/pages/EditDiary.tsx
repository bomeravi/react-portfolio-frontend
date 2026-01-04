import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeftIcon } from 'lucide-react';
import { diaryService } from '@/features/diary/services/diaryService';
import { DiaryForm } from '@/features/diary/components/DiaryForm';
import type { CreateDiaryDTO } from '@/features/diary/types/diary.types';
import { useToast } from '@/contexts/ToastContext';
import Navigation from '@/components/homepage/Navigation';

export default function EditDiary() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const queryClient = useQueryClient();

    const { data: diary, isLoading, isError } = useQuery({
        queryKey: ['diary', id],
        queryFn: () => diaryService.getDiary(id!),
        enabled: !!id,
    });

    const updateMutation = useMutation({
        mutationFn: (data: CreateDiaryDTO) => diaryService.updateDiary(id!, data),
        onSuccess: () => {
            addToast('Diary entry updated successfully', 'success');
            queryClient.invalidateQueries({ queryKey: ['diaries'] });
            queryClient.invalidateQueries({ queryKey: ['diary', id] });
            navigate(`/diaries/${id}`);
        },
        onError: (error) => {
            console.error('Failed to update diary', error);
        },
    });

    const handleSubmit = async (data: CreateDiaryDTO) => {
        await updateMutation.mutateAsync(data);
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
    < div className = "pt-20 pb-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8" >
        <button
                    onClick={ () => navigate(`/diaries/${id}`) }
className = "flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors"
    >
    <ArrowLeftIcon className="w-4 h-4" />
        <span>Back to Entry </span>
            </button>

            < div className = "mb-8" >
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2" >
                    Edit Diary Entry
                        </h1>
                        < p className = "text-slate-600 dark:text-slate-400" >
                            Update your thoughts.
                    </p>
                                </div>

                                < DiaryForm
initialData = {{
    title: diary.title,
        content: diary.content,
            category: diary.category,
                tags: diary.tags,
                    imageUrl: diary.imageUrl,
                    }}
onSubmit = { handleSubmit }
isSubmitting = { updateMutation.isPending }
submitLabel = "Update Entry"
    />
    </div>
    </div>
    );
}
