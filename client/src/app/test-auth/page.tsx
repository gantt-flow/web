// client/src/app/test-auth/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { checkAuth } from '@/services/authService';

export default function TestAuth() {
  const [authStatus, setAuthStatus] = useState<string>('Checking...');

  useEffect(() => {
    const testAuth = async () => {
      try {
        const result = await checkAuth();
        setAuthStatus(`Authenticated: ${JSON.stringify(result)}`);
      } catch (error) {
        setAuthStatus(`Not authenticated: ${error}`);
      }
    };

    testAuth();
  }, []);

  return (
    <div>
      <h1>Authentication Test</h1>
      <p>{authStatus}</p>
    </div>
  );
}