import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (loading || isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      // error toast already shown by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className= "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center px-4 py-12" >
    <motion.div
        initial={ { opacity: 0, y: 20 } }
  animate = {{ opacity: 1, y: 0 }
}
transition = {{ duration: 0.6 }}
className = "w-full max-w-md"
  >
  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700" >
    <div className="text-center mb-8" >
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2" >
        Welcome Back
          </h2>
          < p className = "text-slate-600 dark:text-slate-400" >
            Sign in to your account to continue
</p>
  </div>

  < form onSubmit = { handleSubmit } className = "space-y-6" >
    <div>
    <label htmlFor="email" className = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" >
      Email Address
        </label>
        < div className = "relative" >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" >
            <MailIcon className="h-5 w-5 text-slate-400" />
              </div>
              < input
id = "email"
type = "email"
value = { email }
onChange = { e => setEmail(e.target.value) }
required
className = "block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
placeholder = "you@example.com"
  />
  </div>
  </div>

  < div >
  <label htmlFor="password" className = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" >
    Password
    </label>
    < div className = "relative" >
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" >
        <LockIcon className="h-5 w-5 text-slate-400" />
          </div>
          < input
id = "password"
type = { showPassword? 'text': 'password' }
value = { password }
onChange = { e => setPassword(e.target.value) }
required
className = "block w-full pl-10 pr-10 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
placeholder = "Enter your password"
  />
  <button
                  type="button"
onClick = {() => setShowPassword(!showPassword)}
className = "absolute inset-y-0 right-0 pr-3 flex items-center"
  >
  {
    showPassword?(
                    <EyeOffIcon className = "h-5 w-5 text-slate-400" />
                  ): (
        <EyeIcon className = "h-5 w-5 text-slate-400" />
                  )}
</button>
  </div>
  </div>

  < button
disabled = { isSubmitting }
type = "submit"
className = "w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
  >
  { isSubmitting? 'Signing in…': 'Sign In' }
  </button>
  </form>

  < div className = "mt-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600" >
    <div className="flex items-start justify-between gap-4" >
      <div className="flex-1" >
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2" >
          Demo Credentials
            </p>
            < p className = "text-xs text-slate-600 dark:text-slate-400" >
              <span className="font-medium" > Username: </span> demo@example.com
                </p>
                < p className = "text-xs text-slate-600 dark:text-slate-400" >
                  <span className="font-medium" > Password: </span> password
                    </p>
                    </div>
                    < button
type = "button"
onClick = { async() => {
  setEmail('demo@example.com');
  setPassword('password');
  setIsSubmitting(true);
  try {
    await login('demo@example.com', 'password');
    navigate('/');
  } catch (err) {
    // error toast already shown by AuthContext
  } finally {
    setIsSubmitting(false);
  }
}}
disabled = { isSubmitting }
className = "px-3 py-2 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors whitespace-nowrap disabled:opacity-50"
  >
  Login as User
  </button>
  </div>
  </div>
  </div>
  </motion.div>
  </div>
  );
}