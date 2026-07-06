import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { useAuthStore } from '../stores/useAuthStore';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAuth(data.data.user, data.data.accessToken, data.data.refreshToken);
      toast.success('Successfully logged in!');
      navigate('/');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  });

  const onSubmit = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-3xl p-8 sm:p-12 w-full shadow-soft"
    >
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-soft mx-auto mb-6">
          <span className="text-white font-extrabold text-3xl">F</span>
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Welcome Back</h1>
        <p className="text-gray-500 font-medium">Sign in to continue your grocery shopping</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
          <input 
            type="email" 
            {...register('email')}
            className={`w-full rounded-xl border bg-gray-50 px-4 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:bg-white transition-all font-medium ${errors.email ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-200 focus:ring-primary/50 focus:border-primary'}`}
            placeholder="john@example.com"
          />
          {errors.email && <p className="mt-2 text-sm font-medium text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-bold text-gray-700">Password</label>
            <a href="#" className="text-sm font-bold text-primary hover:underline">Forgot password?</a>
          </div>
          <input 
            type="password" 
            {...register('password')}
            className={`w-full rounded-xl border bg-gray-50 px-4 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:bg-white transition-all font-medium ${errors.password ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-200 focus:ring-primary/50 focus:border-primary'}`}
            placeholder="••••••••"
          />
          {errors.password && <p className="mt-2 text-sm font-medium text-red-500">{errors.password.message}</p>}
        </div>

        <button 
          type="submit" 
          disabled={loginMutation.isPending}
          className="w-full bg-primary hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-soft hover:shadow-floating flex items-center justify-center disabled:opacity-50"
        >
          {loginMutation.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Sign In'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm font-medium text-gray-600">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary font-bold hover:underline">Create an account</Link>
      </p>
    </motion.div>
  );
};

export default Login;
