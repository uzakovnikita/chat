import styled from 'styled-components';

import {StyledProps} from '../../../constants/types';

const Card = styled.div<StyledProps>`
    width: 100%;
    height: 80px;
    background-color: ${props => props.theme.colors['primary-bg']};
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 20px;
    cursor: pointer;
    transition: 0.2s;
    font-size: 16px;
    font-family: ${props => props.theme.fonts.primary};
    font-weight: 600;
    color: ${props =>props.theme.colors['blue-3a-c2']};
    display: flex;
    align-items: center;
    &:hover {
        background-color: ${props => props.theme.colors['secondary-bg']};
    }
`;

export default Card;
