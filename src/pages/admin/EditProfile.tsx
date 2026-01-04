import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import axiosInstance from "../../lib/api";
import { SaveIcon, XIcon, AlertCircleIcon, CheckCircleIcon, UploadCloudIcon } from "lucide-react";

// Zod validation schema
const editProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .email("Invalid email address"),
  avatar: z
    .string()
    .optional()
    .or(z.literal("")),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

export default function AdminEditProfile() {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [useFileUpload, setUseFileUpload] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  const validateField = (name: string, value: string) => {
    try {
      const fieldSchema = editProfileSchema.pick({
        [name]: true,
      } as Record<string, true>);

      fieldSchema.parse({ [name]: value });
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.issues[0]?.message || "Invalid input";
      }
      return null;
    }
  };

  const validateAllFields = () => {
    try {
      editProfileSchema.parse(formData);
      setFieldErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.issues.forEach((err) => {
          const path = err.path[0] as string;
          errors[path] = err.message;
        });
        setFieldErrors(errors);
        return false;
      }
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      if (error) {
        setFieldErrors(prev => ({ ...prev, [name]: error }));
      } else {
        setFieldErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    if (error) {
      setFieldErrors(prev => ({ ...prev, [name]: error }));
    } else {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file', 'error');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      addToast('Image size must be less than 5MB', 'error');
      return;
    }

    setAvatarFile(file);
    setIsPreviewLoading(true);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData(prev => ({
        ...prev,
        avatar: event.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleImageLoad = () => {
    setIsPreviewLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAllFields()) {
      addToast("Please fix the errors below", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);

      // If file was uploaded, append the file
      if (avatarFile) {
        submitData.append('avatar', avatarFile);
      } else if (formData.avatar && !formData.avatar.startsWith('data:')) {
        // If URL was provided and it's not a data URL, append it
        submitData.append('avatar', formData.avatar);
      } else if (formData.avatar.startsWith('data:')) {
        // If it's a data URL (from file upload), the file is already appended
        submitData.append('avatar', avatarFile || formData.avatar);
      }

      await axiosInstance.post('/api/v1/me', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      addToast("Profile updated successfully!", "success");
      await refreshProfile();
      navigate("/admin/profile");
    } catch (err: any) {
      addToast(err.response?.data?.message || "Failed to update profile", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasError = (fieldName: string) => {
    return touched[fieldName] && fieldErrors[fieldName];
  };

  const hasAnyErrors = Object.keys(fieldErrors).length > 0;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl space-y-6"
      >
        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-lg p-4"
        >
          <p className="text-sm text-blue-900 dark:text-blue-200">
            <strong>Tip:</strong> Update your profile information below. You can upload an image file or provide an image URL. File uploads are recommended for better control.
          </p>
        </motion.div>

        {/* Card Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 px-8 py-6">
            <h1 className="text-3xl font-bold text-white mb-1">Edit Profile</h1>
            <p className="text-blue-100">Update your personal information</p>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8" noValidate>
            {/* Avatar Section */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-600 rounded"></div>
                Profile Picture
              </h2>

              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  {formData.avatar ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="relative"
                    >
                      {isPreviewLoading && (
                        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
                      )}
                      <img
                        src={formData.avatar}
                        alt="Avatar preview"
                        onLoad={handleImageLoad}
                        onError={() => setIsPreviewLoading(false)}
                        className="w-32 h-32 rounded-xl object-cover border-4 border-slate-200 dark:border-slate-700 shadow-lg"
                      />
                    </motion.div>
                  ) : (
                    <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                      {user?.name
                        ? user.name
                            .split(" ")
                            .map(s => s[0])
                            .slice(0, 2)
                            .join("")
                        : "U"}
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  {/* Toggle Between Upload and URL */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setUseFileUpload(false);
                        setAvatarFile(null);
                      }}
                      className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                        !useFileUpload
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
                      }`}
                    >
                      Use URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setUseFileUpload(true)}
                      className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                        useFileUpload
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
                      }`}
                    >
                      Upload File
                    </button>
                  </div>

                  {/* File Upload */}
                  {useFileUpload ? (
                    <div>
                      <label htmlFor="avatar-file" className="block">
                        <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all text-center">
                          <UploadCloudIcon className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Click to upload image
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </div>
                        <input
                          id="avatar-file"
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      {avatarFile && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                          ✓ {avatarFile.name}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label htmlFor="avatar" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Avatar URL
                      </label>
                      <input
                        id="avatar"
                        name="avatar"
                        type="url"
                        value={formData.avatar && !formData.avatar.startsWith('data:') ? formData.avatar : ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 border-2 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                          hasError('avatar')
                            ? 'border-red-500 dark:border-red-500 focus:ring-red-500'
                            : 'border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500'
                        }`}
                        placeholder="https://example.com/avatar.jpg"
                      />
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                        Enter a valid image URL (JPG, PNG, GIF, etc.)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-200 dark:border-slate-700"></div>

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 border-2 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                  hasError('name')
                    ? 'border-red-500 dark:border-red-500 focus:ring-red-500'
                    : 'border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500'
                }`}
                placeholder="Enter your full name"
              />
              {hasError('name') && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800"
                >
                  <AlertCircleIcon className="w-4 h-4 flex-shrink-0" />
                  {fieldErrors.name}
                </motion.div>
              )}
              {!hasError('name') && formData.name && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 flex items-center gap-2 text-sm text-green-600 dark:text-green-400"
                >
                  <CheckCircleIcon className="w-4 h-4 flex-shrink-0" />
                  Looking good!
                </motion.div>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 border-2 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                  hasError('email')
                    ? 'border-red-500 dark:border-red-500 focus:ring-red-500'
                    : 'border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500'
                }`}
                placeholder="Enter your email address"
              />
              {hasError('email') && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800"
                >
                  <AlertCircleIcon className="w-4 h-4 flex-shrink-0" />
                  {fieldErrors.email}
                </motion.div>
              )}
              {!hasError('email') && formData.email && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 flex items-center gap-2 text-sm text-green-600 dark:text-green-400"
                >
                  <CheckCircleIcon className="w-4 h-4 flex-shrink-0" />
                  Valid email
                </motion.div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-8 border-t border-slate-200 dark:border-slate-700">
              <motion.button
                type="submit"
                disabled={isSubmitting || hasAnyErrors}
                whileHover={!isSubmitting && !hasAnyErrors ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting && !hasAnyErrors ? { scale: 0.98 } : {}}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <SaveIcon className="w-5 h-5" />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </motion.button>
              <motion.button
                type="button"
                onClick={() => navigate("/admin/profile")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <XIcon className="w-5 h-5" />
                Cancel
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}