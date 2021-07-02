import styled from 'styled-components';
import { observer } from 'mobx-react-lite';

import useAuthContext from '../../hooks/useAuthContext';
import { Auth } from '../../store/auth';

const NameContainer = styled.div`
    height: 100%;
    width: 300px;
    border-radius: ${(props) => props.theme.radiuses.big};
    background-image: ${(props) => props.theme.colors['purple-grad']};
    position: relative;
    margin-left: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Name = styled.span`
    color: ${(props) => props.theme.colors.white};
    font-family: ${(props) => props.theme.fonts.primary};
    font-size: 16px;
    z-index: 20;
    position: relative;
`;

const SelfName = () => {
    const authStore = useAuthContext() as Auth;
    console.log(authStore?.email)
    return (
        <NameContainer>
            <Name>{authStore.email}</Name>
        </NameContainer>
    );
};

export default observer(SelfName);
