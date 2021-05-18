import React, {useEffect} from "react";
import { FunctionComponent } from "react";
import styled from "styled-components";
import auth from '../../store/auth';
import chat from '../../store/chat';
import common from '../../store/common';

const ChatPage: FunctionComponent = () => {
    useEffect(() => {
        try {
            console.log(auth.id)
            chat.connect(auth.id);
            chat.getUsers()
        } catch (err) {
            common.registrError(String(err));
        }
    }, [])
    return (
        <main>
            Chat Page
        </main>
    )
};

export default ChatPage;