import React, { FunctionComponent } from 'react';

const ChatPage: FunctionComponent = (props) => {
    return (
        <section>
            {props.children}
        </section>
    )
};

export default ChatPage;