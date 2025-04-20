// CallbackPage.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Callback() {
  const { isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // After auth processing is done, redirect to home page
    if (!isLoading) {
      navigate('/');
    }
  }, [isLoading, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Processing login...</p>
    </div>
  );
}