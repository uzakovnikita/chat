import React, { FunctionComponent } from 'react';

const AuthPage: FunctionComponent = (props) => {
    return (
        <section>
            {props.children}
        </section>
    )
};

export default AuthPage;