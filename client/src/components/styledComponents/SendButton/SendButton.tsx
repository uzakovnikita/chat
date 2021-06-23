import styled from 'styled-components';
type MessageInputProps = {
    type?: string;
    img?: any;
    ['img-hover']?: any;
}

const MessageInput = styled.input<MessageInputProps>`
    width: 90px;
    height: 40px;
    padding:  0;
    border: none;
    outline: none;
    cursor: pointer;
    background-image: url(${props => props.img});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-color: transparent;
    border-radius: 5px;
    box-sizing: border-box;
    opacity: 0.6;
    transition: 0.3s;
    &:hover {
        opacity: 1;
    }
`;

export default MessageInput;