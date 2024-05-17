import { Col, Image, InputNumber } from "antd";
import styled from "styled-components";

export const WrapperStyleImageSmall = styled(Image)`
    height: 64px;
    width: 64px;
`

export const WrapperStyleColImage = styled(Col)`
    flex-basis: unset;
    display: flex;
`

export const WrapperStyleNameProduct = styled.h1`
    font-size: 1.7em;
    font-weight: 600;
    color: #333;
    font-family: 'Nunito Sans', 'sans-serif';
    line-height: 1.5em;
    overflow-wrap: break-word;
    // padding-bottom: 16px;
`

export const WrapperStyleTextSell = styled.span`
    font-size: 15px;
    line-height: 24px;
    color: rgb(120, 120, 120)
`

export const WrapperPriceProduct = styled.div`
    display: flex;
    // background: rgb(250, 250, 250);
    border-radius: 4px;
`

export const WrapperPriceTextProductDiscount = styled.h1`
    font-size: 32px;
    line-height: 40px;
    margin-right: 8px;
    font-weight: 500;
    padding: 10px;
    margin-top: 10px;
    color: #cd5033;    
`

export const WrapperPriceTextProduct = styled.h1`
    font-size: 16px;
    line-height: 40px;
    margin-right: 8px;
    font-weight: 350;
    padding: 10px;
    margin-top: 10px;
    color: #0D0E0F;
    text-decoration: line-through;
`

export const WrapperDiscount = styled.span`
    margin-left: 8px;
    padding: 4px;
    -webkit-border-radius: 4px;
    background-color: #C92127;
    color: #fff;
    font-size: 1em;
    font-weight: 600;
    margin-top: 25px;
    height: 28px;
`

export const WrapperAddressProduct = styled.div`
    span.address {
        text-decoration: underline;
        font-size: 15px;
        line-height: 24px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsisl
    };
    span.change-address {
        color: rgb(11, 116, 229);
        font-size: 16px;
        line-height: 24px;
        font-weight: 500;
    }
`

export const WrapperQualityProduct = styled.div`
    display: flex;
    gap: 4px;
    align-items: center;
    width: 120px;
    border: 1px solid #ccc;
    border-radius: 4px;
`

export const WrapperInputNumber = styled(InputNumber)`
    &.ant-input-number.ant-input-number-sm {
        width: 40px;
        border-top: none;
        border-bottom: none;
        .ant-input-number-handler-wrap {
            display: none !important;
        }
    };
`

export const WrapperDecription = styled.div`
    margin-top: 15px;
    padding: 16px;
    background: rgb(255, 255, 255);
    border-radius: 8px;
    height: 100%;
    font-size: 1.1em !important;
    font-weight: 400;
    color: #333333;
`

export const WrapperTextNew = styled.span`
    color: #333333;
    font-size: 13px;
    font-weight: 400;
    padding-right: 5px;
    width: 400px;
`

export const WrapperSA = styled.div`
    font-family: 'Roboto', sans-serif !important;
    line-height: 2;
    display: flex;
`

export const WrapperSATwo = styled.div`
    color: #333333;
    font-size: 13px;
    font-weight: 400;
    padding-right: 5px;
    margin-left: 100px;
`