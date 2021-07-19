import { FunctionComponent } from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';

import useErrorsLogsContext from '../../../hooks/useErrorsLogsContext';

import ErrorNotification from '../../ErrorNotification';


const ErrorContainer = styled.div`
    z-index: 10000;
    width: 300px;
    height: 100px;
    position: fixed;
    top: 100px;
    left: 0;
    right: 0;
    margin: auto;
`;

const Error: FunctionComponent = () => {
    const errorsList = useErrorsLogsContext();
    const onClick = () => {
        errorsList.errors.pop();
    }
    if (typeof window === 'undefined') {
        return null;
    }

    return ReactDOM.createPortal(<ErrorContainer>
        {errorsList.errors.map(err => {
            return <ErrorNotification message={err.message} onClick={onClick}/>;
        })}
    </ErrorContainer>, document.getElementById('error-portal') as HTMLElement);
};

export default observer(Error);
