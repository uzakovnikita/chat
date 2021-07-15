import styled from 'styled-components';

type ButtonProps = {
    'align'?: string;
    'isNotCentrAlign'?: boolean;
}

const Button = styled.button<ButtonProps>`
    border: none;
    background-color: ${props => props.theme.colors['primary-bg']};
    color: ${props => props.theme.colors['blue-32-a8']};
    font-size: 16px;
    min-width: 70px;
    display: inline-block;
    height: 30px;
    border-radius: 3px;
    text-align: center;
    cursor: pointer;
    transition: 0.2s;
    outline: none;
    align-self: ${props => props.align || ''};
    box-sizing: border-box;
    &:hover {
        background-color: ${props => props.theme.colors['secondary-bg']};
    }
`;

export default Button;