import React from 'react';
import { useRecoilState } from 'recoil';
import { userauthState } from '../../utils/atom';
import { Navigate, Outlet } from 'react-router';

function PrivateRoute() {
  const [auth] = useRecoilState(userauthState);

  if (!auth.isLoggedIn) {
    alert('로그인이 필요합니다');
    return <Navigate to={'/login'} />;
  }

  return <Outlet />;
}

export default PrivateRoute;
