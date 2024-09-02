import React from 'react';
import styled from 'styled-components';
import ProfileImage from './chatMessage/ProfileImage';
import { GetUserRoleString } from '../utils/stringUtil';
import { useRecoilValue } from 'recoil';
import { userauthState } from '../utils/atom';
import { Button } from '@mui/material';
import { axiosInstance } from '../utils/axios';
import { useNavigate } from 'react-router';
import { Btn } from '../components/global/CustomComponents';

function SimpleProfile(props) {
  const auth = useRecoilValue(userauthState);

  const navigate = useNavigate();

  const handleButtonClick = async () => {
    try {
      const response = await axiosInstance.get(`/admin/users/${props?.user.id}`);
      navigate('/admin-page/user-list/user-detail', { state: { userDetail: [response.data] } });
    } catch (err) {
      try {
        alert(err.response.data.message);
      } catch (err) {
        alert('요청 오류');
      }
    }
  };

  return (
    <Container>
      <Head>
        <ProfileImage user={props?.user} size={'6rem'} hover={'no'} />
        <Wrapper>
          <Div>
            <Name>{props?.user.name}</Name>
            <Role>{GetUserRoleString(props?.user.role)}</Role>
          </Div>
          {props?.user.role === 'DOCTOR' && (
            <>
              <HospitalName>{props?.doctorProfile.hospitalName}</HospitalName>
              <Departments>진료과목: {props?.doctorProfile.department}</Departments>
            </>
          )}
        </Wrapper>
      </Head>
      {auth.role === 'ADMIN' && (
        <Btn
          
          onClick={handleButtonClick}
          sx={{
            width: '60%',
            marginTop: '20px',
            fontWeight: 'bold',
          }}
        >
          유저 상세정보
        </Btn>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Head = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  @media (max-width: 481px) {
    flex-direction: column;
  }
`;

const Wrapper = styled.div`
  width: 50%;
  @media (max-width: 481px) {
    font-size: 1.6rem;
    margin-top: 20px;
    width: 100%;
    text-align: center;
  }
`;

const Div = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  @media (max-width: 481px) {
    display: inline-flex;
  }
`;

const Role = styled.p`
  font-size: 1rem;
  font-style: italic;

  @media (max-width: 481px) {
    font-size: 0.8rem;
  }
`;

const Name = styled.p`
  font-size: 1.8rem;
  margin: 0 10px 0 0;
  @media (max-width: 481px) {
    font-size: 1.6rem;
  }
`;

const HospitalName = styled.p`
  @media (max-width: 481px) {
    font-size: 1rem;
  }
`;

const Departments = styled.p`
  @media (max-width: 481px) {
    font-size: 1rem;
  }
`;

export default SimpleProfile;
