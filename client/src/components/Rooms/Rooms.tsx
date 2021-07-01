import { FunctionComponent, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import Flex from '../styledComponents/Flex';
import Card from '../styledComponents/Card';
import Title from '../styledComponents/Title';
import Logout from '../Logout';
import { ContextChat, ContextAuth } from '../../store/contexts';
import { Chat } from '../../store/chat';
import { Auth } from '../../store/auth';


const CardText = styled.span`
    position: relative;
    z-index: 10;
    font-size: 20px;
    font-family: ${props => props.theme.fonts.primary};
    margin-bottom: 10px;
`;

const HeaderContainer = styled.header`
    display: flex;
    justify-content: space-between;
`;
const LastMessageContainer = styled.div`
   display: flex;
   align-items: center;
   z-index: 100;
`;

const LastMessageAuthor = styled.span`
    font-family: ${props => props.theme.fonts.primary};
    font-size: 18px;
    color: ${props => props.theme.colors['turquoise']};
`;

const LastMessageText = styled.span`
    font-family: ${props => props.theme.fonts.primary};
    font-size: 16px;
    color: ${props => props.theme.colors.white};
    margin-left: 10px;
`

const Rooms: FunctionComponent = () => {
    const chat = useContext(ContextChat) as Chat;
    const auth = useContext(ContextAuth) as Auth;
    const router = useRouter();
    const handleUserClick =
        (roomId: string, interlocutorName: string, interlocutorId: string) =>
        (): void => {
            chat.join(
                roomId,
                interlocutorName,
                interlocutorId,
                auth.id as string,
            );
            router.push(`/rooms/${roomId}`)
        };

    return (
        <>
            <HeaderContainer>
                <Title>Users List</Title>
                <Logout/>
            </HeaderContainer>
            <Flex width='100%' height='100%' justify='flex-start'>
                {chat.rooms?.map(
                    ({ roomId, interlocutorName, interlocutorId }) => {
                        return (
                            <Card
                                key={roomId}
                                onClick={handleUserClick(
                                    roomId,
                                    interlocutorName,
                                    interlocutorId,
                                )}
                            >
                                <CardText>{interlocutorName}</CardText>
                                <LastMessageContainer>
                                    <LastMessageAuthor>
                                        {chat.lastMessagesInEachRooms[roomId].from === auth.id ? 'You' : interlocutorName}: 
                                    </LastMessageAuthor>
                                    <LastMessageText>
                                    {chat.lastMessagesInEachRooms[roomId].messageBody}
                                    </LastMessageText>
                                </LastMessageContainer>
                            </Card>
                        );
                    },
                )}
            </Flex>
        </>
    );
};

export default observer(Rooms);
