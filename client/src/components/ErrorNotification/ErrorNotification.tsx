import { FunctionComponent } from 'react';
import styled from 'styled-components';

const ErrorNotificationStyled = styled.div`
    background-color: ${(props) => props.theme.colors['light-gray']};
    border: 1px solid ${(props) => props.theme.colors['red']};
    border-radius: ${(props) => props.theme.radiuses.medium};
    font-family: ${(props) => props.theme.fonts.primary};
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
`;

const CloseNotification = styled.button`
    width: 50px;
    height: 30px;
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
    margin: auto;
`;

const ErrorNotification: FunctionComponent<{
    message: string;
    onClick: () => void;
}> = ({ message, onClick }) => {
    return (
        <ErrorNotificationStyled>
            {message}
            <CloseNotification onClick={onClick}>OK</CloseNotification>
        </ErrorNotificationStyled>
    );
};

export default ErrorNotification;
