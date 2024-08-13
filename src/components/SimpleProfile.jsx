import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ProfileImage from './chatMessage/ProfileImage';
import { GetUserRoleString } from '../utils/stringUtil';

function SimpleProfile(props) {
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
    </Container>
  );
}

const Container = styled.div``;

const Head = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  @media (max-width: 481px) {
    flex-direction: column;
  }
`;

const Wrapper = styled.div`
  width: 60%;
  @media (max-width: 481px) {
    font-size: 1.6rem;
    margin-top: 20px;
    width: 100%;
  }
`;

const Div = styled.div`
  display: flex;
  align-items: center;
`;

const Role = styled.p`
  font-size: 1rem;
  font-style: italic;
  @media (max-width: 481px) {
    font-size: 0.8rem;
  }
`;

const Name = styled.p`
  font-size: 2rem;
  margin-right: 10px;
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
