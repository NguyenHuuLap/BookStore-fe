import { Card } from "antd";
import styled from "styled-components";

export const WrapperCardStyle = styled(Card)`
    width: 200px;
    padding: 8px;
    & img {
       text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    },
    position: relative;
    background-color: ${props => props.disabled ? '#ccc' : '#fff'};
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'}
`

export const StyleNameProduct = styled.div`
   padding-top: 0px !important;
    line-height: 1.4em;
    word-break: break-word;
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    min-height: 2.8em;
    max-height: 2.8em;
    font-size: 0.78em;
    color: #0D0E0F;
    text-align: left;
`

export const WrapperReportText = styled.div`
    font-size: 11px;
    color: rgb(128, 128, 137);
    display: flex;
    align-items: center;
    margin: 6px 0 0px;
`

export const WrapperPriceText = styled.div`
    color: #C92127;
    font-size: 16px;
    font-weight: 500;
`

export const WrapperDiscountText = styled.span`
margin-left: 8px;
    padding: 3px 4px;
    border-radius: 4px;
    -moz-border-radius: 4px;
    -webkit-border-radius: 4px;
    background-color: #C92127;
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0px;
`

export const WrapperStyleTextSell = styled.span`
    font-size: 15px;
    line-height: 24px;
    color: rgb(120, 120, 120);
`