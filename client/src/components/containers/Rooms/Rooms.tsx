import { FunctionComponent } from 'react';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import useAuthContext from '../../../hooks/useAuthContext';
import useChatContext from '../../../hooks/useChatContext';

import Flex from '../../styledComponents/Flex';
import Card from '../../styledComponents/Card';
import Title from '../../styledComponents/Title';
import Logout from '../../Logout';
import SelfName from '../../SelfName';
import HeaderContainer from '../../styledComponents/HeaderContainer';

import Chat from '../../../store/Chat';
import Auth from '../../../store/Auth';

const CardText = styled.span`
    position: relative;
    z-index: 10;
    font-size: 20px;
    font-family: ${(props) => props.theme.fonts.primary};
    margin-bottom: 10px;
`;

const LastMessageContainer = styled.p`
    width: 100%;
    heigth: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    z-index: 100;
    margin: 0;
    height: 20px;
`;

const LastMessageAuthor = styled.span`
    font-family: ${(props) => props.theme.fonts.primary};
    font-size: 18px;
    color: ${(props) => props.theme.colors['turquoise']};
`;

const LastMessageText = styled.span`
    font-family: ${(props) => props.theme.fonts.primary};
    font-size: 16px;
    color: ${(props) => props.theme.colors.white};
    margin-left: 10px;
`;

const Rooms: FunctionComponent = () => {
    const chatStore = useChatContext() as Chat;
    const authStore = useAuthContext() as Auth;
    const router = useRouter();

    const handleUserClick =
        (roomId: string, interlocutorName: string, interlocutorId: string) =>
        (): void => {
            chatStore.join(roomId, interlocutorName, interlocutorId);
            router.push(`/rooms/${roomId}`);
        };

    return (
        <>
            <HeaderContainer>
                <Title>Users List</Title>
                <SelfName />
                <Logout />
            </HeaderContainer>
            <Flex width='100%' height='100%' justify='flex-start'>
                {chatStore.rooms?.map(
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
                                        {chatStore.lastMessagesInRooms[
                                            roomId
                                        ] &&
                                        chatStore.lastMessagesInRooms[roomId]
                                            .from._id === authStore.id
                                            ? 'You'
                                            : interlocutorName}
                                        :
                                    </LastMessageAuthor>
                                    <LastMessageText>
                                        {
                                            chatStore.lastMessagesInRooms[
                                                roomId
                                            ].messageBody
                                        }
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
