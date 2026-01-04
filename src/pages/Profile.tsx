import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchProfile } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

export default function Profile() {
  const navigate = useNavigate();
  const { user, loading: authLoading, refreshProfile } = useAuth();

  // Fetch fresh profile with React Query (will be deduped if AuthProvider already fetched)
  const { data, isLoading: queryLoading, error } = useQuery({
    queryKey: ["me"],
    queryFn: fetchProfile,
    enabled: !authLoading, // wait for auth provider initial check
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });

  // If auth check finished and there's no user, redirect to login
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

  const profile = user ?? (data && ((data as any).data ?? data));

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">No profile available.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen py-20 bg-slate-50 dark:bg-slate-900"
    >
      <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-xl shadow">
        <div className="flex items-center gap-6">
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.name} className="w-24 h-24 rounded-full object-cover border" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
              {profile.name ? profile.name.split(" ").map((s: string) => s[0]).slice(0,2).join("") : "U"}
            </div>
          )}

          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{profile.name ?? profile.username}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{profile.email}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Role: {profile.role ?? "User"}</p>
            {profile.last_login && (
              <p className="text-xs text-slate-400 mt-1">Last login: {new Date(profile.last_login).toLocaleString()}</p>
            )}
          </div>
        </div>

        <div className="mt-6 border-t pt-6">
          <h2 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">Account</h2>
          <div className="grid grid-cols-1 gap-2 text-sm text-slate-600 dark:text-slate-300">
            <div>
              <span className="font-medium text-slate-700 dark:text-slate-100">Username: </span>
              <span>{profile.username ?? profile.name}</span>
            </div>
            <div>
              <span className="font-medium text-slate-700 dark:text-slate-100">Email: </span>
              <span>{profile.email}</span>
            </div>
            <div>
              <span className="font-medium text-slate-700 dark:text-slate-100">Account created: </span>
              <span>{profile.created_at ? new Date(profile.created_at).toLocaleString() : "—"}</span>
            </div>
            <div>
              <span className="font-medium text-slate-700 dark:text-slate-100">Updated: </span>
              <span>{profile.updated_at ? new Date(profile.updated_at).toLocaleString() : "—"}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}