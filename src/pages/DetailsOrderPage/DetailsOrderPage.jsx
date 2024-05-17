import React, { useState } from 'react'
import {
  WrapperAllPrice,
  WrapperContentInfo,
  WrapperHeaderUser,
  WrapperInfoUser,
  WrapperItem,
  WrapperItemLabel,
  WrapperLabel,
  WrapperNameProduct,
  WrapperProduct,
  WrapperStyleContent,
  WrapperLabelComment,
  WrapperInput
} from './style'
import logo from '../../assets/image/logo.png'
import { useLocation, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import * as OrderService from '../../services/OrderService'
import { useQuery } from '@tanstack/react-query'
import { orderContant } from '../../contant'
import { convertPrice } from '../../utils'
import { useMemo } from 'react'
import Loading from '../../components/LoadingComponent/Loading'
import * as CommentService from '../../services/CommentService'
import { Button } from 'antd'
// import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { useMutationHooks } from '../../hooks/useMutationHook';
import InputForm from '../../components/InputForm/InputForm'

const DetailsOrderPage = () => {
  const params = useParams()
  const location = useLocation()
  const { state } = location
  const { id } = params
  const [comment, setComment] = useState('')

  const fetchDetailsOrder = async () => {
    const res = await OrderService.getDetailsOrder(id, state?.token)
    return res.data;
  }

  const queryOrder = useQuery({ queryKey: ['orders-details'], queryFn: fetchDetailsOrder }, {
    enabled: id
  })
  const { isLoading, data } = queryOrder

  // const fetchComment = async () => {
  //   const res = await CommentService.createComment(id, state?.token)
  //   return res.data
  // }
  // const queryComment = useQuery({ queryKey: ['comment'], queryFn: fetchComment }, {
  //   enabled: id
  // })

  const mutation = useMutationHooks(
    (data) => {
      const { id, token, ...rests } = data;
      console.log("data",data)
      const res = CommentService.createComment(id, rests, token);
      return res;
    }
  );
  const handleComment = (commentData) => {
    // console.log('commentData',commentData.user)
    mutation.mutate({ id: commentData._id, token: state?.token, comment, orderItems: commentData?.orderItems, userId: commentData?.user }, {
      onSuccess: () => {
        queryOrder.refetch();
      },
    })
  };

  const { isLoading: isLoadingComment, data: dataComment } = mutation

  const handleOnchangeComment = (value) => {
    setComment(value)
  }

  const priceMemo = useMemo(() => {
    const result = data?.orderItems?.reduce((total, cur) => {
      return total + ((cur.price * cur.amount))
    }, 0)
    return result
  }, [data])

  return (
    <Loading isLoading={isLoading || isLoadingComment}>
      <div style={{ width: '100%', height: '100vh', background: '#f5f5fa' }}>
        <div style={{ width: '1270px', margin: '0 auto', height: '1270px' }}>
          <h4>Chi tiết đơn hàng</h4>
          <WrapperHeaderUser>
            <WrapperInfoUser>
              <WrapperLabel>Địa chỉ người nhận</WrapperLabel>
              <WrapperContentInfo>
                <div className='name-info'>{data?.shippingAddress?.fullName}</div>
                <div className='address-info'><span>Địa chỉ: </span> {`${data?.shippingAddress?.address} ${data?.shippingAddress?.city}`}</div>
                <div className='phone-info'><span>Điện thoại: </span> {data?.shippingAddress?.phone}</div>
              </WrapperContentInfo>
            </WrapperInfoUser>
            <WrapperInfoUser>
              <WrapperLabel>Hình thức giao hàng</WrapperLabel>
              <WrapperContentInfo>
                <div className='delivery-info'><span className='name-delivery'>FAST </span>Giao hàng tiết kiệm</div>
                <div className='delivery-fee'><span>Phí giao hàng: </span> {data?.shippingPrice}</div>
              </WrapperContentInfo>
            </WrapperInfoUser>
            <WrapperInfoUser>
              <WrapperLabel>Hình thức thanh toán</WrapperLabel>
              <WrapperContentInfo>
                <div className='payment-info'>{orderContant.payment[data?.paymentMethod]}</div>
                <div className='status-payment'>{data?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</div>
              </WrapperContentInfo>
            </WrapperInfoUser>
          </WrapperHeaderUser>
          <WrapperStyleContent>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ width: '670px' }}>Sản phẩm</div>
              <WrapperItemLabel>Giá</WrapperItemLabel>
              <WrapperItemLabel>Số lượng</WrapperItemLabel>
              <WrapperItemLabel>Giảm giá</WrapperItemLabel>
            </div>
            {data?.orderItems?.map((order) => {
              return (
                <WrapperProduct>
                  <WrapperNameProduct>
                    <img src={order?.image}
                      style={{
                        width: '70px',
                        height: '70px',
                        objectFit: 'cover',
                        border: '1px solid rgb(238, 238, 238)',
                        padding: '2px'
                      }}
                    />
                    <div style={{
                      width: 260,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      marginLeft: '10px',
                      height: '70px',
                    }}>{order?.name}</div>
                  </WrapperNameProduct>
                  <WrapperItem>{convertPrice(order?.price)}</WrapperItem>
                  <WrapperItem>{order?.amount}</WrapperItem>
                  <WrapperItem>{order?.discount ? convertPrice(priceMemo * order?.discount / 100) : '0 VND'}</WrapperItem>


                </WrapperProduct>
              )
            })}

            <WrapperAllPrice>
              <WrapperItemLabel>Tạm tính</WrapperItemLabel>
              <WrapperItem>{convertPrice(priceMemo)}</WrapperItem>
            </WrapperAllPrice>
            <WrapperAllPrice>
              <WrapperItemLabel>Phí vận chuyển</WrapperItemLabel>
              <WrapperItem>{convertPrice(data?.shippingPrice)}</WrapperItem>
            </WrapperAllPrice>
            <WrapperAllPrice>
              <WrapperItemLabel>Tổng cộng</WrapperItemLabel>
              <WrapperItem><WrapperItem>{convertPrice(data?.totalPrice)}</WrapperItem></WrapperItem>
            </WrapperAllPrice>
            <div style={{ marginTop: '20px' }}>
              <WrapperInput>
                <WrapperLabelComment htmlFor="comment">Đánh giá</WrapperLabelComment>
                <InputForm style={{ width: '300px' }} id="comment" value={comment} onChange={handleOnchangeComment} />
              </WrapperInput>
            </div>
            <Button onClick={() => handleComment(data)}>
              Đánh giá
            </Button>

          </WrapperStyleContent>
        </div>
      </div>
    </Loading>
  )
}

export default DetailsOrderPage