import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusIcon, EditIcon, TrashIcon, SearchIcon } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import axiosInstance from '../../lib/api';

interface Blog {
  id: number;
  title: string;
  description: string;
  image?: string;
  category_id: number;
  category?: { id: number; name: string };
  created_at: string;
  updated_at: string;
}

const fetchBlogs = async (): Promise<Blog[]> => {
  const res = await axiosInstance.get('/api/v1/blogs');
  return res.data?.data ?? res.data ?? [];
};

const createBlog = async (data: Omit<Blog, 'id' | 'created_at' | 'updated_at'>) => {
  const res = await axiosInstance.post('/api/v1/blogs', data);
  return res.data?.data ?? res.data;
};

const updateBlog = async (id: number, data: Partial<Blog>) => {
  const res = await axiosInstance.put(`/api/v1/blogs/${id}`, data);
  return res.data?.data ?? res.data;
};

const deleteBlog = async (id: number) => {
  await axiosInstance.delete(`/api/v1/blogs/${id}`);
};

export default function AdminBlogs() {
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    category_id: 1,
  });

  const { data: blogs = [], isLoading, error } = useQuery({
    queryKey: ['admin-blogs'],
    queryFn: fetchBlogs,
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<Blog, 'id' | 'created_at' | 'updated_at'>) => createBlog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      addToast('Blog created successfully!', 'success');
      resetForm();
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      addToast(err.response?.data?.message || 'Failed to create blog', 'error');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; payload: Partial<Blog> }) =>
      updateBlog(data.id, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      addToast('Blog updated successfully!', 'success');
      resetForm();
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      addToast(err.response?.data?.message || 'Failed to update blog', 'error');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      addToast('Blog deleted successfully!', 'success');
    },
    onError: (err: any) => {
      addToast(err.response?.data?.message || 'Failed to delete blog', 'error');
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      category_id: 1,
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      updateMutation.mutate({ id: editingId, payload: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (blog: Blog) => {
    setFormData({
      title: blog.title,
      description: blog.description,
      image: blog.image || '',
      category_id: blog.category_id,
    });
    setEditingId(blog.id);
    setIsModalOpen(true);
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600">Error loading blogs</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Blogs</h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="w-5 h-5" />
          New Blog
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
        />
      </div>

      {/* Blogs Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Created</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900 dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBlogs.map(blog => (
              <tr key={blog.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700">
                <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">{blog.title}</td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{blog.category?.name ?? `#${blog.category_id}`}</td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                  {new Date(blog.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right flex gap-2 justify-end">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-600 rounded"
                  >
                    <EditIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(blog.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-slate-600 rounded"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredBlogs.length === 0 && (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            No blogs found
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => {
            setIsModalOpen(false);
            resetForm();
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 max-w-md w-full"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              {editingId ? 'Edit Blog' : 'New Blog'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Category ID
                </label>
                <input
                  type="number"
                  value={formData.category_id}
                  onChange={e => setFormData({ ...formData, category_id: parseInt(e.target.value) })}
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}