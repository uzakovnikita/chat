import styled from 'styled-components';
import { message } from '../../constants/types';
import Link from 'next/link';

const NotifyWrapper = styled.div`
    background-color: ${(props) => props.theme.colors['blue-32-a8']};
    font-family: ${(props) => props.theme.fonts.primary};
    color: ${(props) => props.theme.colors['white']};
    font-size: 16px;
    padding: 10px 20px 10px 10px;
    height: 120px;
    box-sizing: border-box;
    border-radius: ${(props) => props.theme.radiuses.medium};
    margin-bottom: 5px;
    word-break: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
    cursor: pointer;
    transition: 0.3s;
    &:hover {
        background-color: ${(props) => props.theme.colors['blue-highlights']};
    }
`;

const Notify = styled.div`
    font-family: ${(props) => props.theme.fonts.primary};
    color: ${(props) => props.theme.colors['white']};
    font-size: 16px;
    height: 94px;
    width: 300px;
    border-radius: ${(props) => props.theme.radiuses.medium};
    word-break: break-word;
    overflow: hidden;
    position: relative;
`;

const Author = styled.span`
    font-family: ${(props) => props.theme.fonts.primary};
    font-size: 18px;
    color: ${(props) => props.theme.colors['white']};
    vertical-align: initial;
    padding: 2px;
    font-weight: 600;
    word-break: keep-all;
`;

const Text = styled.span`
    padding-bottom: 10px;
`;

const Close = styled.svg`
    transition: 0.3s;
    width: 12px;
    height: 12px;
    fill: ${(props) => props.theme.colors['light-gray']};
`;

const CloseWrapper = styled.div`
    width: 12px;
    heigth: 12px;
    position: absolute;
    right: 5px;
    top: 5px;
    cursor: pointer;
    z-index: 100000;

    &:hover {
        svg {
            fill: ${(props) => props.theme.colors['white']};
        }
    }
`;

const StyledLink = styled.a`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`;

const Notification = ({
    from,
    message,
    onClick,
    onStartTransitionToRoom
}: {
    from: string;
    message: message;
    onClick: (id: string) => () => void;
    onStartTransitionToRoom: () => void;
}) => {
    return (
        <NotifyWrapper>
            <CloseWrapper onClick={onClick(message._id)}>
                <Close
                    height='329pt'
                    viewBox='0 0 329.26933 329'
                    width='329pt'
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <path d='m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0' />
                </Close>
            </CloseWrapper>

            <Notify>
                <Author>{from}: </Author>
                <Text>
                    {message.messageBody.length > 100
                        ? message.messageBody.slice(0, 100) + '...'
                        : message.messageBody}
                </Text>
            </Notify>
            <Link href={`/rooms/${message.room}`} shallow={false}>
                <StyledLink onClick={onStartTransitionToRoom}></StyledLink>
            </Link>
        </NotifyWrapper>
    );
};

export default Notification;
