import React from 'react';
import styled from 'styled-components';
import Nav from '../Nav';
import Footer from '../Footer';
import { CustomScrollBox } from '../CustomScrollBox';

function MainContainer({ children, isChat }) {
  return (
    <Container>
      <Nav />
        <CustomScrollBox>
        <Content isChat={isChat}>{children}</Content>
        </CustomScrollBox>
      <Footer />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 60dvh;
  margin: 0 auto;
  height: 100dvh;
  border-left: 2px solid #E9E9E9;
  border-right: 2px solid #E9E9E9;
  padding: 0;
`;

const Content = styled.div`
  flex: 1;
  height: ${({ isChat }) => (isChat === true ? '76dvh' : '84dvh')};
  margin-bottom: ${({ isChat }) => (isChat === true ? '8dvh' : '0px')};
`;

export default MainContainer;
