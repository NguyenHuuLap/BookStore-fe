import React, { useState, useMemo } from 'react';
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
} from './style';
import { useLocation, useParams } from 'react-router-dom';
import * as OrderService from '../../services/OrderService';
import { useQuery } from '@tanstack/react-query';
import { orderContant } from '../../contant';
import { convertPrice } from '../../utils';
import Loading from '../../components/LoadingComponent/Loading';
import * as CommentService from '../../services/CommentService';
import { Button, Form, Rate } from 'antd';
import { useMutationHooks } from '../../hooks/useMutationHook';
import InputForm from '../../components/InputForm/InputForm';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import * as ProductService from '../../services/ProductService';
import { useEffect } from 'react'
import * as message from '../../components/Message/Message'

const DetailsOrderPage = () => {
  const params = useParams();
  const location = useLocation();
  const { state } = location;
  const { id } = params;
  const [comment, setComment] = useState('');
  const [star, setStar] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // New state for selected product
  const [form] = Form.useForm();

  const fetchDetailsOrder = async () => {
    const res = await OrderService.getDetailsOrder(id, state?.token);
    return res.data;
  };

  const queryOrder = useQuery({
    queryKey: ['orders-details', id],
    queryFn: fetchDetailsOrder,
    enabled: !!id,
  });

  const { isLoading, data } = queryOrder;

  const mutation = useMutationHooks(data => {
    console.log('Creating comment with data:', data);
    return CommentService.createComment(data.id, data, data.token);
  }, {
    onError: (error) => {
      console.error('Error creating comment:', error);
    }
  });

  const handleComment = (commentData) => {
    console.log('handleComment called with:', commentData);
    mutation.mutate(
      {
        id: commentData._id,
        token: commentData.token,
        comment: commentData.comment,
        star: commentData.star,
        orderId: commentData.orderId,
        userId: commentData.userId,
      },
      {
        onSuccess: () => {
          queryOrder.refetch();
          setIsModalOpen(false);
          setComment('');
          setStar(0);
        },
      }
    );
  };

  const { data: dataComment, isLoading: isLoadingComment, isSuccess, isError } = mutation;

  const handleOnchangeComment = value => {
    setComment(value);
  };

  const handleStarChange = value => {
    setStar(value);
  };

  const priceMemo = useMemo(() => {
    return data?.orderItems?.reduce((total, cur) => total + cur.price * cur.amount, 0);
  }, [data]);

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedProduct(null); // Reset selected product
    form.resetFields();
  };

  useEffect(() => {
    if (isSuccess) {
      message.success('Đánh giá thành công');
      handleCloseDrawer();
    } else if (isError) {
      message.error('Bạn đã đánh giá sản phẩm này!');
    }
  }, [isSuccess, isError]);

  const onFinish = values => {
    console.log('Form submitted');
    handleComment({
      _id: selectedProduct._id,
      token: state?.token,
      comment: values.comment,
      star,
      orderId: id,
      userId: data?.user,
    });
  };

  const fetchGetDetailsProduct = async (productId) => {
    const res = await ProductService.getDetailsProduct(productId);
    if (res?.data) {
      setSelectedProduct(res.data);
    }
  };

  const handleReviewClick = product => {
    setIsModalOpen(true);
    fetchGetDetailsProduct(product.product);
  };

  const handleCloseDrawer = () => {
    setIsModalOpen(false);
    setSelectedProduct({
      star: '',
      comment: ''
    })
    form.resetFields()
  };

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
                <div className='address-info'><span>Địa chỉ: </span>{`${data?.shippingAddress?.address} ${data?.shippingAddress?.city}`}</div>
                <div className='phone-info'><span>Điện thoại: </span>{data?.shippingAddress?.phone}</div>
              </WrapperContentInfo>
            </WrapperInfoUser>
            <WrapperInfoUser>
              <WrapperLabel>Hình thức giao hàng</WrapperLabel>
              <WrapperContentInfo>
                <div className='delivery-info'><span className='name-delivery'>FAST </span>Giao hàng tiết kiệm</div>
                <div className='delivery-fee'><span>Phí giao hàng: </span>{convertPrice(data?.shippingPrice)}</div>
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
            {data?.orderItems?.map(order => (
              <WrapperProduct key={order.id}>
                <WrapperNameProduct>
                  <img
                    src={order?.image}
                    alt={order?.name}
                    style={{
                      width: '70px',
                      height: '70px',
                      objectFit: 'cover',
                      border: '1px solid rgb(238, 238, 238)',
                      padding: '2px',
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
                {order?.isReviewed ? null : (
                  <Button onClick={() => handleReviewClick(order)}>Đánh giá</Button>
                )}
              </WrapperProduct>
            ))}
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
              <WrapperItem>{convertPrice(data?.totalPrice)}</WrapperItem>
            </WrapperAllPrice>
          </WrapperStyleContent>
        </div>
        <ModalComponent forceRender title="Đánh giá sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={onFinish}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Đánh giá"
              name="comment"
              rules={[{ required: true, message: 'Vui lòng nhập đánh giá!' }]}
            >
              <InputComponent value={comment} onChange={handleOnchangeComment} name="comment" />
            </Form.Item>
            <Form.Item
              label="Số sao"
              name="star"
              rules={[{ required: true, message: 'Vui lòng chọn số sao!' }]}
            >
              <Rate onChange={handleStarChange} value={star} />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </ModalComponent>
      </div>
    </Loading>
  );
};

export default DetailsOrderPage;
