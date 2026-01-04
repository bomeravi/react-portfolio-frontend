import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeftIcon } from 'lucide-react';
import { diaryService } from '@/features/diary/services/diaryService';
import { DiaryForm } from '@/features/diary/components/DiaryForm';
import type { CreateDiaryDTO } from '@/features/diary/types/diary.types';
import { useToast } from '@/contexts/ToastContext';
import Navigation from '@/components/homepage/Navigation';

export default function CreateDiary() {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: diaryService.createDiary,
        onSuccess: () => {
            addToast('Diary entry created successfully', 'success');
            queryClient.invalidateQueries({ queryKey: ['diaries'] });
            navigate('/diaries');
        },
        onError: (error) => {
            // Error is handled by global interceptor, but we can add specific logic here if needed
            console.error('Failed to create diary', error);
        },
    });

    const handleSubmit = async (data: CreateDiaryDTO) => {
        await createMutation.mutateAsync(data);
    };

    return (
        <div className= "min-h-screen bg-slate-50 dark:bg-slate-900" >
        <Navigation />
        < div className = "pt-20 pb-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8" >
            <button
                    onClick={ () => navigate('/diaries') }
    className = "flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors"
        >
        <ArrowLeftIcon className="w-4 h-4" />
            <span>Back to Diaries </span>
                </button>

                < div className = "mb-8" >
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2" >
                        New Diary Entry
                            </h1>
                            < p className = "text-slate-600 dark:text-slate-400" >
                                Share your thoughts with the world.
                    </p>
                                    </div>

                                    < DiaryForm
    onSubmit = { handleSubmit }
    isSubmitting = { createMutation.isPending }
    submitLabel = "Create Entry"
        />
        </div>
        </div>
    );
}
