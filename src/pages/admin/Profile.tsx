import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchProfile } from "../../lib/api";
import { useAuth } from "../../contexts/AuthContext";
import { EditIcon } from "lucide-react";

export default function AdminProfile() {
  const navigate = useNavigate();
  const { user, loading: authLoading, refreshProfile } = useAuth();

  const { data, isLoading: queryLoading, error } = useQuery({
  queryKey: ["me"],
  queryFn: fetchProfile,
  enabled: !authLoading,
  staleTime: 5 * 60 * 1000,
  retry: 0,
});

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [authLoading, user, navigate]);

  if (authLoading || queryLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  const profile = user ?? (data && (data.data ?? data));

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">No profile available.</p>
      </div>
    );
  }

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
            <strong>Tip:</strong> View your profile information here. Click "Edit Profile" to make changes to your personal details.
          </p>
        </motion.div>

        {/* Card Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          {/* Header with Edit Button */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 px-8 py-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Profile Information</h2>
              <p className="text-blue-100 text-sm mt-1">Your account details</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/admin/profile/edit")}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm transition-all border border-white/30"
            >
              <EditIcon className="w-5 h-5" />
              Edit Profile
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Avatar and Basic Info */}
            <div className="flex items-start gap-8">
              <div className="flex-shrink-0">
                {profile.avatar ? (
                  <motion.img
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-32 h-32 rounded-2xl object-cover border-4 border-slate-200 dark:border-slate-700 shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center text-5xl font-bold shadow-lg">
                    {profile.name
                      ? profile.name
                          .split(" ")
                          .map((s: string) => s[0])
                          .slice(0, 2)
                          .join("")
                      : "U"}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {profile.name ?? profile.username}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">{profile.email}</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 border border-blue-200 dark:border-blue-800">
                    {profile.role ?? "User"}
                  </span>
                  {profile.last_login && (
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                      Last login: {new Date(profile.last_login).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-200 dark:border-slate-700"></div>

            {/* Account Details */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-600 rounded"></div>
                Account Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600"
                >
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                    Username
                  </p>
                  <p className="text-lg font-medium text-slate-900 dark:text-white">
                    {profile.username ?? profile.name}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600"
                >
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                    Email
                  </p>
                  <p className="text-lg font-medium text-slate-900 dark:text-white break-all">
                    {profile.email}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600"
                >
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                    Role
                  </p>
                  <p className="text-lg font-medium text-slate-900 dark:text-white">
                    {profile.role ?? "User"}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600"
                >
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                    Account Created
                  </p>
                  <p className="text-lg font-medium text-slate-900 dark:text-white">
                    {profile.created_at
                      ? new Date(profile.created_at).toLocaleDateString()
                      : "—"}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600"
                >
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                    Last Updated
                  </p>
                  <p className="text-lg font-medium text-slate-900 dark:text-white">
                    {profile.updated_at
                      ? new Date(profile.updated_at).toLocaleString()
                      : "—"}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600"
                >
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                    Last Login
                  </p>
                  <p className="text-lg font-medium text-slate-900 dark:text-white">
                    {profile.last_login
                      ? new Date(profile.last_login).toLocaleString()
                      : "Never"}
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-8 border-t border-slate-200 dark:border-slate-700">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/admin/profile/edit")}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <EditIcon className="w-5 h-5" />
                Edit Profile
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}