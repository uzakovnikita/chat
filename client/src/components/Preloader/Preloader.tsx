import {FunctionComponent} from 'react';
import styled from 'styled-components';

const Img = styled.img`
    position: absolute;
    width: 100%;
    heigth: 100%;
    top: 0;
    left: 0;
    rigth: 0;
    bottom: 0;
    margin: auto;
`
const Preloader: FunctionComponent = () => {
    return (
        <Img src="../../static/images/gachimuchi.jpg" alt="чё с деньгами?"></Img>
    )
};

export default Preloader;