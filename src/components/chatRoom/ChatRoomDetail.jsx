import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ProfileImage from '../chatMessage/ProfileImage';
import { useRecoilState } from 'recoil';
import { userauthState } from '../../utils/atom';

function ChatRoomDetail({ data, selectedIndex }) {
  const navigate = useNavigate();

  const [auth] = useRecoilState(userauthState);

  const [isHovered, setIsHovered] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);

  const handleWrapperClick = () => {
    if (auth.role === 'ADMIN' && data.type.type !== '서비스센터 상담' && selectedIndex === 2) {
      return;
    }

    if (isImageHovered) {
      return;
    }

    navigate(`/chat/${Number(data.id)}/messages`, { state: { status: data.status.status } });
  };

  return (
    <Container hovered={isHovered ? true : undefined}>
      <Wrapper
        onMouseEnter={() => {
          setIsHovered(true);
          setIsImageHovered(false);
        }}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleWrapperClick}
        selectedIndex={selectedIndex}
      >
        <Title>
          {selectedIndex === 2 ? (
            data.user2 ? (
              <>
                {data.user1.name}님과 {data.user2.name}님의 대화
              </>
            ) : (
              <>{data.user1.name}님의 대기 중인 상담</>
            )
          ) : selectedIndex === 1 ? (
            data.user1.name
          ) : data.status.status === '수락 대기' ? (
            data.type.type
          ) : data.user1.id === auth.userId ? (
            <div>
              {data.user2.name}
              <Role>{data.user2.role === 'USER' ? '' : ` ${data.user2.role}`}</Role>
              {data.user2.role === 'DOCTOR' && (
                <HospitalName>{data.doctorProfile.hospitalName}</HospitalName>
              )}
            </div>
          ) : (
            <div>
              {data.user1.name}
              <Role>{data.user1.role === 'USER' ? '' : ` ${data.user1.role}`}</Role>

              {data.user1.role === 'DOCTOR' && (
                <HospitalName>{data.doctorProfile.hospitalName}</HospitalName>
              )}
            </div>
          )}
          {selectedIndex === 2 && <ChatType>{data.type.type}</ChatType>}
        </Title>
        <Preview>
          {selectedIndex !== 2 ? (
            <>
              {data?.newMessageCount > 0 && (
                <NewMessageCount>{data.newMessageCount}</NewMessageCount>
              )}
              <PreviewText>
                {data.status.status !== '진행' && `(${data.status.status})`}{' '}
                {data.lastMessage !== null
                  ? data.lastMessage.content
                      .replace(/\n/g, ' ')
                      .replace(
                        'dpt: ',
                        data.lastMessage.user.role === 'DOCTOR' ? '진료과 정보 제공: ' : 'dpt: '
                      )
                  : '메시지가 없습니다'}
              </PreviewText>
            </>
          ) : (
            <div
              style={{ display: 'flex' }}
              onMouseEnter={() => setIsImageHovered(true)}
              onMouseLeave={() => setIsImageHovered(false)}
            >
              <ProfileImage user={data.user1} size={'3rem'} doctorProfile={data.doctorProfile} />
              {data.user2 ? (
                <ProfileImage user={data.user2} size={'3rem'} doctorProfile={data.doctorProfile} />
              ) : null}
            </div>
          )}
        </Preview>
      </Wrapper>
      {selectedIndex !== 2 && (
        <ProfileImage
          user={
            selectedIndex === 1
              ? data.user1
              : auth.userId === data.user1.id
                ? data.user2
                : data.user1
          }
          size={'6rem'}
          doctorProfile={data.doctorProfile}
        />
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 60dvh;
  width: 80%;
  height: 15dvh;
  border: 2px solid var(--paper-deep);
  border-radius: 10px;
  margin: 20px auto 0px;
  padding: 5px 30px;
  &:hover {
    background-color: ${({ hovered }) => (hovered === true ? 'var(--paper-common)' : 'white')};
    cursor: ${({ hovered }) => (hovered === true ? 'pointer' : null)};
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: ${({ selectedIndex }) => (selectedIndex !== 2 ? '70%' : '100%')};
  height: 100%;
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const Role = styled.span`
  font-size: 1.3rem;
  font-style: italic;
  color: #9da1a2;
  font-weight: 400;
  @media (max-width: 500px) {
    font-size: 0.8rem;
  }
`;

const HospitalName = styled.div`
  font-size: 0.8rem;
  color: #706c6c;
  font-weight: 400;
`;

const ChatType = styled.p`
  color: #706c6c;
  font-size: 1.2rem;
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const Preview = styled.div`
  display: flex;
  align-items: center;
  width: 70%;
  font-size: 1.1rem;
  text-overflow: ellipsis;
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const PreviewText = styled.p`
  overflow: hidden;
  white-space: nowrap;
  color: grey;
  width: 100%;
`;

const NewMessageCount = styled.p`
  display: inline-block;
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  background-color: #ff4d4d;
  border-radius: 50%;
  color: #fff; /* 숫자 색상 */
  font-weight: bold;
  margin: auto 10px auto 0px;
  font-size: 1rem;
  padding: 1px;
  @media (max-width: 500px) {
    width: 25px;
    height: 25px;
    line-height: 25px;
    font-size: 0.9rem;
  }
`;

export default ChatRoomDetail;
