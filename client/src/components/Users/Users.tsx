import React, { useEffect } from 'react';
import { FunctionComponent } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import auth from '../../store/auth';
import common from '../../store/common';
import chat from '../../store/chat';

import Flex from '../styledComponents/Flex';

const UserItem = styled.li`
    width: 300px;
    height: 50px;
    border: 1px solid red;
    cursor: pointer;
    &:hover {
        border: 1px solid green;
    }
    margin-bottom: 10px;
`;

const Users: FunctionComponent = () => {
    useEffect(() => {
        try {
            console.log(auth.id);
            common.connect(auth.id);
            common.getUsers();
        } catch (err) {
            common.registrError(String(err));
        }
    }, []);
    const handleUserClick = (userID: string, name: string) => () => {
        chat.join(userID, name);
    };
    return (
        <main>
            Users List
            <Flex width="100%" height="100%">
                {common.users.map((user) => (
                    <UserItem
                        key={user.userID}
                        onClick={handleUserClick(user.userID, user.name)}
                    >
                        {user.name}
                    </UserItem>
                ))}
            </Flex>
        </main>
    );
};

export default observer(Users);
