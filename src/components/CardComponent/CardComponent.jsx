import React from 'react'
import { StyleNameProduct, WrapperCardStyle, WrapperDiscountText, WrapperPriceText, WrapperReportText, WrapperStyleTextSell } from './style'
import { StarFilled } from '@ant-design/icons'
import logo from '../../assets/image/logo.png'
import { useNavigate } from 'react-router-dom'
import { convertPrice } from '../../utils'
import { useMemo } from 'react';

const CardComponent = (props) => {
    const { countInStock, description, image, name, price, rating, type, discount, selled, id } = props;
    const navigate = useNavigate();

    const handleDetailsProduct = (id) => {
        navigate(`/product-details/${id}`);
    }

    // Tính giá giảm giá
    const priceDiscount = useMemo(() => price - (price * (discount / 100)), [price, discount]);

    return (
        <WrapperCardStyle
            hoverable
            headStyle={{ width: '200px', height: '200px' }}
            style={{ width: 200 }}
            bodyStyle={{ padding: '10px' }}
            cover={<img alt="example" src={image} />}
            onClick={() => handleDetailsProduct(id)}
        >
            {/* <img
                src={logo}
                style={{
                    width: '68px',
                    height: '14px',
                    position: 'absolute',
                    top: -1,
                    left: -1,
                    borderTopLeftRadius: '3px'
                }}
            /> */}
            <StyleNameProduct>{name}</StyleNameProduct>
            {/* <WrapperReportText>
                <span style={{ marginRight: '4px' }}>
                    <span>{rating} </span> <StarFilled style={{ fontSize: '12px', color: 'rgb(253, 216, 54)' }} />
                </span>
                <WrapperStyleTextSell> | Da ban {selled }+</WrapperStyleTextSell>
            </WrapperReportText> */}
            <WrapperStyleTextSell>Da ban {selled}</WrapperStyleTextSell>
            <WrapperPriceText>
                <span style={{ marginRight: '8px' }}>{convertPrice(priceDiscount)}</span>
                <WrapperDiscountText>- {discount || 5}%</WrapperDiscountText>
            </WrapperPriceText>
            <WrapperPriceText>
                <span style={{ color: '#888888', textDecoration: 'line-through' }}>{convertPrice(price)}</span>
            </WrapperPriceText>
        </WrapperCardStyle>
    );
}

export default CardComponent;