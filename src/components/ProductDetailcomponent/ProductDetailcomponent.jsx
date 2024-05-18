import { Col, Image, Rate, Row } from 'antd'
import React from 'react'
import {
    WrapperStyleImageSmall,
    WrapperStyleColImage,
    WrapperStyleNameProduct,
    WrapperStyleTextSell,
    WrapperPriceProduct,
    WrapperPriceTextProduct,
    WrapperAddressProduct,
    WrapperQualityProduct,
    WrapperInputNumber,
    WrapperBtnQualityProduct,
    WrapperPriceTextProductDiscount,
    WrapperDiscount,
    WrapperDecription,
    WrapperSA,
    WrapperSATwo,
    WrapperTextNew
} from './style'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query'
import Loading from '../LoadingComponent/Loading'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { addOrderProduct, resetOrder } from '../../redux/slides/orderSlide'
import { convertPrice } from '../../utils'
import { useEffect } from 'react'
import * as message from '../Message/Message'
import { useMemo } from 'react'
import * as CommentService from '../../services/CommentService';
import * as UserService from '../../services/UserService';

const ProductDetailsComponent = ({ idProduct }) => {
    const [numProduct, setNumProduct] = useState(1)
    const user = useSelector((state) => state.user)
    const order = useSelector((state) => state.order)
    const [errorLimitOrder, setErrorLimitOrder] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()

    const onChange = (value) => {
        setNumProduct(Number(value))
    }

    const fetchGetDetailsProduct = async (context) => {
        const id = context?.queryKey && context?.queryKey[1]
        if (id) {
            const res = await ProductService.getDetailsProduct(id)
            return res.data
        }
    }

    const fetchGetDetailsComment = async (context) => {
        const id = context?.queryKey && context?.queryKey[1]
        if (id) {
            const res = await CommentService.getDetailsCommentByProduct(id)
            return res.data
        }
    }

    const fetchGetDetailsUser = async (context) => {
        const id = context?.queryKey && context?.queryKey[1]
        if (id) {
            const res = await UserService.getDetailsUser(id)
            return res.data
        }
    }

    useEffect(() => {
        const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
        if ((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || (!orderRedux && productDetails?.countInStock > 0)) {
            setErrorLimitOrder(false)
        } else if (productDetails?.countInStock === 0) {
            setErrorLimitOrder(true)
        }
    }, [numProduct])

    useEffect(() => {
        if (order && order.isSucessOrder) {
            message.success('Đã thêm vào giỏ hàng')
        }
        return () => {
            dispatch(resetOrder())
        }
    }, [order?.isSucessOrder])

    const handleChangeCount = (type, limited) => {
        if (type === 'increase') {
            if (!limited) {
                setNumProduct(numProduct + 1)
            }
        } else {
            if (!limited) {
                setNumProduct(numProduct - 1)
            }
        }
    }

    const { isLoading, data: productDetails } = useQuery(['product-details', idProduct], fetchGetDetailsProduct, { enabled: !!idProduct })
    const { isLoading: isLoadingComment, data: commentDetails } = useQuery(['comment-details', idProduct], fetchGetDetailsComment, { enabled: !!idProduct })

    const handleAddOrderProduct = () => {
        if (!user?.id) {
            navigate('/login', { state: location?.pathname })
        } else {
            const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
            if ((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || (!orderRedux && productDetails?.countInStock > 0)) {
                dispatch(addOrderProduct({
                    orderItem: {
                        name: productDetails?.name,
                        amount: numProduct,
                        image: productDetails?.image,
                        price: productDetails?.price,
                        product: productDetails?._id,
                        discount: productDetails?.discount,
                        countInstock: productDetails?.countInStock,
                        description: productDetails?.description,
                        selled: productDetails?.selled,
                        publishingHouse: productDetails?.publishingHouse,
                        supplier: productDetails?.supplier,
                        form: productDetails?.form,
                        author: productDetails?.author
                    }
                }))
            } else {
                setErrorLimitOrder(true)
            }
        }
        navigate('/order')
    }
    const discountedPrice = useMemo(() => {
        return productDetails ? productDetails.price * (1 - (productDetails.discount || 0) / 100) : 0;
    }, [productDetails]);

    return (
        <Loading isLoading={isLoading}>
            {productDetails || isLoadingComment ? (
                <Row style={{ padding: '16px', background: '#fff', borderRadius: '4px', height: '100%' }}>
                    <Col span={10} style={{ borderRight: '1px solid #e5e5e5', paddingRight: '8px' }}>
                        <Image src={productDetails?.image} alt="image product" preview={true} />
                        <Row style={{ paddingTop: '10px', justifyContent: 'space-between' }}>
                            <WrapperStyleColImage span={4} sty>
                                <WrapperStyleImageSmall src={productDetails?.image1} alt="image small" preview={true} />
                            </WrapperStyleColImage>
                            <WrapperStyleColImage span={4}>
                                <WrapperStyleImageSmall src={productDetails?.image2} alt="image small" preview={true} />
                            </WrapperStyleColImage>

                            <WrapperStyleColImage span={4}>
                                <WrapperStyleImageSmall src={productDetails?.image3} alt="image small" preview={true} />
                            </WrapperStyleColImage>

                            <WrapperStyleColImage span={4}>
                                <WrapperStyleImageSmall src={productDetails?.image4} alt="image small" preview={true} />
                            </WrapperStyleColImage>

                            <WrapperStyleColImage span={4}>
                                <WrapperStyleImageSmall src={productDetails?.image} alt="image small" preview={true} />
                            </WrapperStyleColImage>

                            <WrapperStyleColImage span={4}>
                                <WrapperStyleImageSmall src={productDetails?.image} alt="image small" preview={true} />
                            </WrapperStyleColImage>

                        </Row>
                    </Col>
                    <Col span={14} style={{ paddingLeft: '10px' }}>
                        <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
                        <div>
                            {/* <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating} /> */}
                            <WrapperStyleTextSell> Đã bán {productDetails?.selled}</WrapperStyleTextSell>
                        </div>
                        <div>
                            <WrapperSA style={{ marginTop: "15px" }}>
                                <WrapperTextNew>Nhà cung cấp: {productDetails?.publishingHouse}</WrapperTextNew>
                                <WrapperSATwo>Tác giả: {productDetails?.author}</WrapperSATwo>
                            </WrapperSA>
                            <WrapperSA>
                                <WrapperTextNew>Nhà xuất bản: {productDetails?.supplier}</WrapperTextNew>
                                <WrapperSATwo>Hình thức bìa: {productDetails?.form}</WrapperSATwo>
                            </WrapperSA>
                        </div>
                        <WrapperPriceProduct>
                            {productDetails && (
                                <>
                                    <WrapperPriceTextProductDiscount>{convertPrice(discountedPrice)}</WrapperPriceTextProductDiscount>
                                    <WrapperPriceTextProduct>{convertPrice(productDetails.price)}</WrapperPriceTextProduct>
                                    <WrapperDiscount>{productDetails.discount}%</WrapperDiscount>
                                </>
                            )}
                        </WrapperPriceProduct>
                        <WrapperAddressProduct>
                            <span>Giao đến </span>
                            <span className='address'>{user?.address}</span> -
                            <span className='change-address'>Đổi địa chỉ</span>
                        </WrapperAddressProduct>
                        <div style={{ margin: '10px 0 20px', padding: '10px 0', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5' }}>
                            <div style={{ marginBottom: '10px' }}>Số lượng</div>
                            <WrapperQualityProduct>
                                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease', numProduct === 1)}>
                                    <MinusOutlined style={{ color: '#000', fontSize: '20px' }} />
                                </button>
                                <WrapperInputNumber onChange={onChange} defaultValue={1} max={productDetails?.countInStock} min={1} value={numProduct} size="small" style={{ textAlign: 'center' }} />
                                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase', numProduct === productDetails?.countInStock)}>
                                    <PlusOutlined style={{ color: '#000', fontSize: '20px' }} />
                                </button>
                            </WrapperQualityProduct>
                        </div>
                        <div style={{ display: 'flex', aliggItems: 'center', gap: '12px' }}>
                            <div>
                                <ButtonComponent
                                    size={40}
                                    styleButton={{
                                        background: '#C92127',
                                        height: '48px',
                                        width: '220px',
                                        fontWeight: '700',
                                        border: 'none',
                                        borderRadius: '4px'
                                    }}
                                    onClick={handleAddOrderProduct}
                                    textbutton={'Mua ngay'}
                                    styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                                ></ButtonComponent>
                                {errorLimitOrder && <div style={{ color: 'red' }}>San pham het hang</div>}
                            </div>
                            <ButtonComponent
                                size={40}
                                styleButton={{
                                    background: '#fff',
                                    color: '#C92127',
                                    height: '48px',
                                    width: '220px',
                                    border: '2px solid #C92127',
                                    borderRadius: '4px'
                                }}
                                textbutton={'Thêm vào giỏ hàng'}
                                styleTextButton={{ color: '#C92127', fontSize: '15px' }}
                                onClick={handleAddOrderProduct}
                            ></ButtonComponent>
                        </div>
                    </Col>
                </Row >
            ) : null}
            <WrapperDecription style={{ whiteSpace: 'pre-line' }}>
                <div style={{ fontSize: "1.45em", fontWeight: "700" }}>Thông tin sản phẩm</div>
                {productDetails?.description}
            </WrapperDecription>
            <WrapperDecription style={{ whiteSpace: 'pre-line' }}>
                <div style={{ fontSize: "1.45em", fontWeight: "700" }}>Comment</div>
                {commentDetails?.map((comment, index) => (
                    <div key={index}>
                        <div>{comment.user.name}</div>
                        <div>{comment.comment}</div>
                    </div>
                ))}
            </WrapperDecription>

        </Loading>
    )
}

export default ProductDetailsComponent