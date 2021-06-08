import styled from 'styled-components';

type FlexProps = {
    justify?: string;
    direction?: string;
    align?: string;
    width?: string;
    height?: string;
}
const Flex = styled.div<FlexProps>`
    display: flex;
    justify-content: ${(props) => props.justify || 'center'};
    flex-direction: ${props => props.direction || 'column'};
    align-items: ${props => props.align || 'center'};
    height: ${props => props.height || '100%'};
    width: ${props => props.width || '100%'};
`;
export default Flex;