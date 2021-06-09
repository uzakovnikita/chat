import styled from 'styled-components';

type MessageInputProps = {
    type?: string;
    padding: string;
    img?: any;
}

const MessageInput = styled.input<MessageInputProps>`
    width: ${props => props.type === 'submit' ? '90px' : '100%'};
    height: ${props => props.type === 'submit' ? '40px' : '100%'};
    padding:  ${props => props.type === 'submit' ? '0' : '20px'};
    font-size: 14px;
    border: none;
    outline: none;
    cursor: ${props => props.type === 'submit' ? 'pointer' : 'inherit'};
    background-color: ${props => props.type === 'submit' ? props.theme.colors['primary-bg'] : 'transparent'};
    background-image: url(${props => props.img});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 5px;
    box-sizing: border-box;
    &:hover {
        background-color: ${props=> props.type==='submit'? props.theme.colors['secondary-bg'] : 'transparent'}
    }
`;

export default MessageInput;