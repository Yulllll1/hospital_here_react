import React from 'react';
import { useNavigate } from 'react-router-dom';

const NaverLoginButton = () => {
  const navigate = useNavigate();

  const handleNaverLogin = async () => {
    try {
      console.log("네이버 로그인 시작");
      window.location.href = "https://kdt-cloud-3-team05-final.elicecoding.com/oauth2/authorization/naver";
    } catch (error) {
      console.error('네이버 로그인 실패', error);
    }
  };

  return (
    <div onClick={handleNaverLogin} style={{ cursor: 'pointer', display: 'inline-block' }}>
      <img
        src="../../public/images/btnG.jpg"
        alt="네이버 로그인"
        style={{ width: '100%', height: 'auto' }}
      />
    </div>
  );
};

export default NaverLoginButton;