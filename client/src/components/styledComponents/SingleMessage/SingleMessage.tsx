import styled from 'styled-components';

type SingleMessageProps = {
    align: string;
}

const SingleMessage = styled.div<SingleMessageProps>`
    position: relative;
    align-self: ${props => props.align};
    min-width: 200px;
    max-width: 400px;
    height: auto;
    padding: 8px 32px 8px 8px;
    margin: 5px 0;
    color: ${props => props.theme.colors['white']};
    font-family: ${props => props.theme.fonts.primary};
    background: ${props => props.theme.colors['blue-grad']};
    border-radius: 5px;
    word-break: break-word;
    box-sizing: border-box;
`;

export default SingleMessage;