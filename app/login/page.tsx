'use client';

import { Suspense, useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthScreen } from '@/components/auth/auth-screen';
import { setAuthToken, removeAuthToken } from '@/lib/auth';
import { authApi } from '@/lib/api';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authMode, setAuthMode] = useState<'login' | 'forgot'>('login');

  const [isLoading, setIsLoading] = useState(false);
  const isExpired = searchParams.get('expired') === '1';
  const [error, setError] = useState<string | null>(
    isExpired ? 'Your session has expired. Please log in again.' : null
  );

  useEffect(() => {
    if (searchParams.get('expired') || searchParams.get('logout')) {
      removeAuthToken();
    }
  }, [searchParams]);

  const handleLogin = useCallback(async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authApi.login(credentials);

      const token =
        res?.token ||
        (res as any)?.accessToken ||
        (res as any)?.access_token ||
        (res as any)?.data?.token ||
        (res as any)?.data?.accessToken;

      if (!token) {
        throw new Error(
          res?.message ||
          res?.error ||
          'Authentication failed: No token received from server'
        );
      }

      const userObj =
        res?.user ||
        (res as any)?.admin ||
        (res as any)?.data?.user ||
        (res as any)?.data?.admin ||
        { email: credentials.email };

      setAuthToken(token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_user', JSON.stringify(userObj));
      }

      const from = searchParams.get('from') || '/';
      const target = from.startsWith('/login') ? '/' : from;
      window.location.replace(target);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials or server connection.');
    } finally {
      setIsLoading(false);
    }
  }, [router, searchParams]);

  return (
    <AuthScreen
      mode={authMode}
      onLogin={handleLogin}
      onModeChange={setAuthMode}
      isLoading={isLoading}
      error={error}
    />
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#F2F2F2]">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

