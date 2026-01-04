import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type CreateDiaryDTO } from '../types/diary.types';

interface DiaryFormProps {
    initialData?: CreateDiaryDTO;
    onSubmit: (data: CreateDiaryDTO) => Promise<void>;
    isSubmitting: boolean;
    submitLabel: string;
}

export function DiaryForm({ initialData, onSubmit, isSubmitting, submitLabel }: DiaryFormProps) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<CreateDiaryDTO>(
        initialData || {
            title: '',
            content: '',
            category: '',
            tags: [],
            imageUrl: '',
        }
    );
    const [tagInput, setTagInput] = useState(initialData?.tags.join(', ') || '');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const tags = tagInput.split(',').map((t) => t.trim()).filter(Boolean);
        await onSubmit({ ...formData, tags });
    };

    return (
        <form onSubmit= { handleSubmit } className = "space-y-6 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700" >
            <div>
            <label htmlFor="title" className = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" >
                Title
                </label>
                < input
    type = "text"
    id = "title"
    required
    value = { formData.title }
    onChange = {(e) => setFormData({ ...formData, title: e.target.value })
}
className = "w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
placeholder = "My Awesome Diary Entry"
    />
    </div>

    < div >
    <label htmlFor="category" className = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" >
        Category
        </label>
        < input
type = "text"
id = "category"
required
value = { formData.category }
onChange = {(e) => setFormData({ ...formData, category: e.target.value })}
className = "w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
placeholder = "Personal, Tech, Travel..."
    />
    </div>

    < div >
    <label htmlFor="tags" className = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" >
        Tags(comma separated)
        </label>
        < input
type = "text"
id = "tags"
value = { tagInput }
onChange = {(e) => setTagInput(e.target.value)}
className = "w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
placeholder = "react, typescript, life"
    />
    </div>

    < div >
    <label htmlFor="imageUrl" className = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" >
        Image URL
            </label>
            < input
type = "url"
id = "imageUrl"
value = { formData.imageUrl }
onChange = {(e) => setFormData({ ...formData, imageUrl: e.target.value })}
className = "w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
placeholder = "https://example.com/image.jpg"
    />
    </div>

    < div >
    <label htmlFor="content" className = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" >
        Content
        </label>
        < textarea
id = "content"
required
rows = { 10}
value = { formData.content }
onChange = {(e) => setFormData({ ...formData, content: e.target.value })}
className = "w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y"
placeholder = "Write your thoughts here..."
    />
    </div>

    < div className = "flex justify-end space-x-4" >
        <button
          type="button"
onClick = {() => navigate(-1)}
className = "px-6 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
    >
    Cancel
    </button>
    < button
type = "submit"
disabled = { isSubmitting }
className = "px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
    { isSubmitting? 'Saving...': submitLabel }
    </button>
    </div>
    </form>
  );
}
