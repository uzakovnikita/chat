import styled from 'styled-components';
type MessageInputProps = {
    type?: string;
    padding: string;
    img?: any;
    ['img-hover']?: any;
}

const MessageInput = styled.textarea<MessageInputProps>`
    width: 100%;
    height: 100%;
    padding:  20px;
    font-size: 14px;
    border: none;
    outline: none;
    background-color: transparent;
    color: ${props => props.theme.colors['black']};
    border-radius: 5px;
    box-sizing: border-box;
    resize: none;
    font-family: ${props => props.theme.fonts['primary']};
`;

export default MessageInput;