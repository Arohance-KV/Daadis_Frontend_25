import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { googleAuth } from '../../redux1/authSlice';
import { toast } from 'sonner';
import type { AppDispatch } from '../../redux1/store';

const GoogleCallback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const error = params.get('error');

    if (error) {
      toast.error('Google sign-in failed');
      navigate('/');
      return;
    }
    if (!code) {
      toast.error('No code returned from Google');
      navigate('/');
      return;
    }

    dispatch(googleAuth({ code }))
      .unwrap()
      .then(() => {
        toast.success('Logged in successfully');
        navigate('/', { replace: true });
      })
      .catch(() => {
        toast.error('Google login failed');
        navigate('/');
      });
  }, [location.search, dispatch, navigate]);

  return <div>Signing in with Google...</div>;
};

export default GoogleCallback;