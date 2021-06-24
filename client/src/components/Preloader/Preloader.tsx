import {FunctionComponent} from 'react';
import styled from 'styled-components';

const Img = styled.img`
    position: absolute;
    width: 90vw;
    heigth: 90vh;
    top: 0;
    left: 0;
    rigth: 0;
    bottom: 0;
    margin: auto;
    z-index: 10;
    transition: 0.2s;
`
const Preloader: FunctionComponent<{isShow: boolean}> = ({isShow}) => {
    return (
        <Img src="/images/gachimuchi.jpg" alt="чё с деньгами?" style={isShow ? {opacity: 1} : {opacity: 0, zIndex: -100,}}/>
    )
};

export default Preloader;