import React from 'react';
import { useRecoilState } from 'recoil';
import { Navigate, Outlet } from 'react-router';
import { userauthState } from '../utils/atom';

function PrivateRoute() {
  const [auth] = useRecoilState(userauthState);

  if (!auth.isLoggedIn) {
    alert('로그인이 필요합니다');
    return <Navigate to={'/login'} replace={true} />;
  }

  return <Outlet />;
}

export default PrivateRoute;
