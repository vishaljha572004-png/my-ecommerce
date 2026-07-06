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

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Register = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setAuth(data.data.user, data.data.accessToken, data.data.refreshToken);
      toast.success('Account created successfully!');
      navigate('/');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  });

  const onSubmit = (data) => {
    // Remove confirmPassword before sending to API
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-3xl p-8 sm:p-12 w-full shadow-soft"
    >
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Create Account</h1>
        <p className="text-gray-500 font-medium">Join us for fresh groceries every day</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
            <input 
              type="text" 
              {...register('firstName')}
              className={`w-full rounded-xl border bg-gray-50 px-4 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:bg-white transition-all font-medium ${errors.firstName ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-200 focus:ring-primary/50 focus:border-primary'}`}
              placeholder="John"
            />
            {errors.firstName && <p className="mt-2 text-sm font-medium text-red-500">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
            <input 
              type="text" 
              {...register('lastName')}
              className={`w-full rounded-xl border bg-gray-50 px-4 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:bg-white transition-all font-medium ${errors.lastName ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-200 focus:ring-primary/50 focus:border-primary'}`}
              placeholder="Doe"
            />
            {errors.lastName && <p className="mt-2 text-sm font-medium text-red-500">{errors.lastName.message}</p>}
          </div>
        </div>

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
          <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
          <input 
            type="tel" 
            {...register('phone')}
            className={`w-full rounded-xl border bg-gray-50 px-4 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:bg-white transition-all font-medium ${errors.phone ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-200 focus:ring-primary/50 focus:border-primary'}`}
            placeholder="+91 98765 43210"
          />
          {errors.phone && <p className="mt-2 text-sm font-medium text-red-500">{errors.phone.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              {...register('password')}
              className={`w-full rounded-xl border bg-gray-50 px-4 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:bg-white transition-all font-medium ${errors.password ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-200 focus:ring-primary/50 focus:border-primary'}`}
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-2 text-sm font-medium text-red-500">{errors.password.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Confirm</label>
            <input 
              type="password" 
              {...register('confirmPassword')}
              className={`w-full rounded-xl border bg-gray-50 px-4 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:bg-white transition-all font-medium ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-200 focus:ring-primary/50 focus:border-primary'}`}
              placeholder="••••••••"
            />
            {errors.confirmPassword && <p className="mt-2 text-sm font-medium text-red-500">{errors.confirmPassword.message}</p>}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={registerMutation.isPending}
          className="w-full bg-primary hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-soft hover:shadow-floating flex items-center justify-center mt-4 disabled:opacity-50"
        >
          {registerMutation.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Create Account'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm font-medium text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
      </p>
    </motion.div>
  );
};

export default Register;
