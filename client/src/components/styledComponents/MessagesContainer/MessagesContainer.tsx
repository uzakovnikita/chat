import styled from 'styled-components';
import Flex from '../Flex';

const MessagesContainer = styled(Flex)`
    overflow-y: auto;
    justify-content: flex-start;
    scrollbar-width: none;
    position: relative;
    box-sizing: border-box;
    &::-webkit-scrollbar {
        display: none;
    }
`;

export default MessagesContainer;