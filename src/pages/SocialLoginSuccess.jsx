import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { userauthState } from '../utils/atom';

const SocialLoginSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuthState = useSetRecoilState(userauthState);

  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');
    const userId = new URLSearchParams(location.search).get('userId');
    const role = new URLSearchParams(location.search).get('role');
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('role', role);
      localStorage.setItem('userRole', role)
      setAuthState({ isLoggedIn: true, userId, role });
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [location, navigate, setAuthState]);

  return <div>소셜 처리 중</div>;
};

export default SocialLoginSuccess;