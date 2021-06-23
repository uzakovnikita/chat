import styled from 'styled-components';

type SingleMessageProps = {
    align: string;
}

const SingleMessage = styled.div<SingleMessageProps>`
    align-self: ${props => props.align};
    width: 150px;
    height: auto;
    color: ${props => props.theme.colors['white']};
    font-family: ${props => props.theme.fonts.primary};
    background-color: ${props => props.theme.colors['blue-highlights']};
    margin: 5px 0;
    border-radius: 5px;
    padding: 8px;
    word-break: break-word;
`;

export default SingleMessage;