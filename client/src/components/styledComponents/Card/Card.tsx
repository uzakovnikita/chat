import styled from 'styled-components';

import {StyledProps} from '../../../constants/types';

const Card = styled.div<StyledProps>`
    width: 100%;
    height: 80px;
    background-color: ${props => props.theme.colors['blue-highlights']};
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 20px;
    cursor: pointer;
    transition: 0.4s;
    font-size: 16px;
    font-family: ${props => props.theme.fonts.primary};
    font-weight: 600;
    color: ${props =>props.theme.colors['white']};
    display: flex;
    align-items: center;
    border: 3px solid transparent;
    &:hover {
        background-color: ${props => props.theme.colors['white']};
        border: 3px solid ${props => props.theme.colors['blue-highlights']};
        color: ${props => props.theme.colors['blue-highlights']};
    };
    box-sizing: border-box;
`;

export default Card;
