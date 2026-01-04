import React from 'react';
import { PlusIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { diaryService } from '@/features/diary/services/diaryService';
import { DiaryCard } from '@/features/diary/components/DiaryCard';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/homepage/Navigation';
import { ROUTES } from '@/constants/routes';

export default function Diaries() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const { data: diaries = [], isLoading, isError, error } = useQuery({
        queryKey: ['diaries'],
        queryFn: diaryService.fetchDiaries,
    });

    if (isLoading) {
        return (
            <div className= "min-h-screen pt-20 flex justify-center items-center bg-slate-50 dark:bg-slate-900" >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                </div>
        );
    }

    if (isError) {
        return (
            <div className= "min-h-screen pt-20 flex flex-col justify-center items-center bg-slate-50 dark:bg-slate-900 text-center px-4" >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4" >
                Failed to load diaries
                    </h2>
                    < p className = "text-red-600 dark:text-red-400 mb-8" > {(error as Error).message
    } </p>
        < button
    onClick = {() => window.location.reload()
}
className = "px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
    Retry
    </button>
    </div>
        );
    }

return (
    <div className= "min-h-screen bg-slate-50 dark:bg-slate-900" >
    <Navigation />
    < div className = "pt-20 pb-12" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" >
            <div className="flex justify-between items-center mb-12" >
                <div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4" >
                    My Diary
                        </h1>
                        < p className = "text-lg text-slate-600 dark:text-slate-300" >
                            Capturing moments, thoughts, and memories.
                            </p>
                                </div>
{
    isAuthenticated && (
        <button
                                    onClick={ () => navigate(ROUTES.DIARY.CREATE) }
    className = "flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
        >
        <PlusIcon className="w-5 h-5" />
            <span>New Entry </span>
                </button>
                            )
}
</div>

{
    diaries.length === 0 ? (
        <div className= "text-center py-20" >
        <p className="text-xl text-slate-500 dark:text-slate-400" >
            No diary entries yet.Start writing!
                </p>
                </div>
                    ) : (
        <div className= "grid md:grid-cols-2 lg:grid-cols-3 gap-8" >
        {
            diaries.map((diary, index) => (
                <DiaryCard key= { diary.id } diary = { diary } index = { index } />
                            ))
        }
        </div>
                    )
}
</div>
    </div>
    </div>
    );
}
