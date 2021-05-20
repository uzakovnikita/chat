import React, { useEffect } from 'react';
import { FunctionComponent } from 'react';
import { observer } from 'mobx-react-lite';

import auth from '../../store/auth';
import common from '../../store/common';
import chat from '../../store/chat';

import Flex from '../styledComponents/Flex';
import Card from '../styledComponents/Card';

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
    const handleUserClick = (userID: string, name: string) => (): void => {
        chat.join(userID, name);
    };
    return (
        <main>
            Users List
            <Flex width="100%" height="100%">
                {common.users.map((user) => (
                    <Card
                        key={user.userID}
                        onClick={handleUserClick(user.userID, user.name)}
                    >
                        {user.name}
                    </Card>
                ))}
            </Flex>
        </main>
    );
};

export default observer(Users);
