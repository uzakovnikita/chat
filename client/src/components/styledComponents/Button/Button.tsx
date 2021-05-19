import styled from 'styled-components';

type ButtonProps = {
    'align'?: string;
}

const Button = styled.button<ButtonProps>`
    border: none;
    background-color: ${props => props.theme.colors['primary-bg']};
    color: ${props => props.theme.colors['blue-32-a8']};
    min-width: 70px;
    display: inline-block;
    height: 40px;
    border-radius: 3px;
    text-align: center;
    cursor: pointer;
    transition: 0.2s;
    outline: none;
    align-self: ${props => props.align || ''};
    &:hover {
        background-color: ${props => props.theme.colors['secondary-bg']};
    }
`;

export default Button;