import { Row } from "antd";
import { Link } from "react-router-dom";
import styled from "styled-components";
import imageShop from '../../assets/image/Shop.png';

export const WrapperHeader = styled(Row)`
    background-color: #FFE880;
    align-items: center;
    gap: 16px;
    flex-wrap: nowrap;
    width: 100%;
    padding: 10px 0;
`

export const WrapperTextHeader = styled(Link)`
    align-items: center;    
    display: inline-block; 
    background-size: contain;
    background-repeat: no-repeat; 
    height: 0px; 
    width: 100%; 
    margin-left: 40px;
    margin-top: 0px;
`;

export const WrapperHeaderAccout = styled.div`
    display: flex;
    align-items: center;
    color: #2e2d2d;
    gap: 10px;
    max-width: 200px;
`

export const WrapperTextHeaderSmall = styled.span`
    font-size: 12px;
    color: #2e2d2d;
    white-space: nowrap;
`

export const WrapperContentPopup = styled.p`
    cursor: pointer;
    &:hover {
        color: rgb(26, 148, 255);
    }
`