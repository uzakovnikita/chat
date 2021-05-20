import styled from 'styled-components';

type SingleMessageProps = {
    align: string;
}

const SingleMessage = styled.div<SingleMessageProps>`
    align-self: ${props => props.align};
    width: 150px;
    height: auto;
    color: ${props => props.theme.colors['blue-32-a8']};
    font-family: ${props => props.theme.fonts.primary};
`;

export default SingleMessage;