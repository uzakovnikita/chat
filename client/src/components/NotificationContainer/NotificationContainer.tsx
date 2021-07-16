import { observer } from 'mobx-react-lite';
import styled from 'styled-components';

import useChatContext from '../../hooks/useChatContext';

import Notification from './Notification';

import Chat from '../../store/Chat';

const NotificationContainerStyled = styled.div`
    display: flex;
    flex-direction: column;
    position: absolute;
    bottom: 20px;
    left: 20px;
    z-index: 1000;
`;

const NotificationContainer = () => {
    const chatStore = useChatContext() as Chat;
    const onClick = (id: string) => () => {
        chatStore.notifications = chatStore.notifications.filter(
            ({_id}) => id !== _id,
        );
    };

    const onStartTransitionToRoom = () => {
        chatStore.notifications = [];
    }

    return (
        <NotificationContainerStyled>
            {chatStore.notifications.map((notify) => {
                return (
                    <Notification
                        onClick={onClick}
                        onStartTransitionToRoom={onStartTransitionToRoom}
                        message={notify}
                        from={notify.from.email}
                    ></Notification>
                );
            })}
        </NotificationContainerStyled>
    );
};

export default observer(NotificationContainer);
