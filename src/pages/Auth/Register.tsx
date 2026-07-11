import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import { UserRole } from '../../types';
import styles from './Auth.module.scss';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.nativeEnum(UserRole).optional(),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const { register: registerAuth, isLoading } = useAuthStore();
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: UserRole.CUSTOMER,
    }
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError('');
      await registerAuth(data);
      navigate('/restaurants');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2>Create Account</h2>
        <p className={styles.subtitle}>Sign up to get started</p>

        {error && <div className={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className={errors.name ? styles.inputError : ''}
              placeholder="Enter your name"
            />
            {errors.name && <span className={styles.errorText}>{errors.name.message}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={errors.email ? styles.inputError : ''}
              placeholder="Enter your email"
            />
            {errors.email && <span className={styles.errorText}>{errors.email.message}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className={errors.password ? styles.inputError : ''}
              placeholder="Create a password"
            />
            {errors.password && <span className={styles.errorText}>{errors.password.message}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="role">I am a...</label>
            <select id="role" {...register('role')} className={styles.select}>
              <option value={UserRole.CUSTOMER}>Customer</option>
              <option value={UserRole.RESTAURANT_OWNER}>Restaurant Owner</option>
            </select>
          </div>

          <button type="submit" disabled={isLoading} className={styles.submitBtn}>
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account? <Link to="/auth/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
