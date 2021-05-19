import React from 'react';
import styled from 'styled-components';

const Title = styled.h2`
    color: ${props => props.theme.colors['blue-32-a8']};
    font-family: ${props => props.theme.fonts.primary};
`;
export default Title;