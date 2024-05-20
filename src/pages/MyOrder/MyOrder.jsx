import React, { useEffect } from 'react';
import Loading from '../../components/LoadingComponent/Loading';
import { useQuery } from '@tanstack/react-query';
import * as OrderService from '../../services/OrderService';
import { useSelector } from 'react-redux';
import { convertPrice } from '../../utils';
import { WrapperItemOrder, WrapperListOrder, WrapperHeaderItem, WrapperFooterItem, WrapperContainer, WrapperStatus } from './style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as message from '../../components/Message/Message';
import { orderContant } from '../../contant';

const MyOrderPage = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  
  const fetchMyOrder = async () => {
    if (state?.id && state?.token) {
      const res = await OrderService.getOrderByUserId(state.id, state.token);
      return res.data;
    }
    return [];
  };

  const user = useSelector((state) => state.user);

  const queryOrder = useQuery({
    queryKey: ['orders'],
    queryFn: fetchMyOrder,
    enabled: !!state?.id && !!state?.token
  });

  const { isLoading, data } = queryOrder;

  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`, {
      state: {
        token: state?.token
      }
    });
  };

  const mutation = useMutationHooks(
    (data) => {
      const { id, token, orderItems, userId } = data;
      return OrderService.cancelOrder(id, token, orderItems, userId);
    }
  );

  const handleCancelOrder = (order) => {
    mutation.mutate({ id: order._id, token: state?.token, orderItems: order?.orderItems, userId: user.id }, {
      onSuccess: () => {
        queryOrder.refetch();
      },
    });
  };

  const { isLoading: isLoadingCancel, isSuccess: isSuccessCancel, isError: isErrorCancel, data: dataCancel } = mutation;

  const mutationComplete = useMutationHooks(
    (data) => {
      const { id, token, orderItems, userId } = data;
      return OrderService.cancelOrder(id, token, orderItems, userId);
    }
  );

  const handleCompleteOrder = (order) => {
    mutationComplete.mutate({ id: order._id, token: state?.token, orderItems: order?.orderItems, userId: user.id }, {
      onSuccess: () => {
        queryOrder.refetch();
      },
    });
  };

  const { isLoading: isLoadingComplete, isSuccess: isSuccessComplete, isError: isErrorComplete, data: dataComplete } = mutationComplete;

  useEffect(() => {
    if (isSuccessCancel && dataCancel?.status === 'OK') {
      message.success();
    } else if (isSuccessCancel && dataCancel?.status === 'ERR') {
      message.error(dataCancel?.message);
    } else if (isErrorCancel) {
      message.error();
    }
  }, [isErrorCancel, isSuccessCancel, dataCancel]);

  const renderProduct = (data) => {
    return data?.map((order) => (
      <WrapperHeaderItem key={order?._id}>
        <img
          src={order?.image}
          alt={order?.name}
          style={{
            width: '70px',
            height: '70px',
            objectFit: 'cover',
            border: '1px solid rgb(238, 238, 238)',
            padding: '2px'
          }}
        />
        <div
          style={{
            width: 260,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            marginLeft: '10px'
          }}
        >
          {order?.name}
        </div>
        <span style={{ fontSize: '13px', color: '#242424', marginLeft: 'auto' }}>
          {convertPrice(order?.price)}
        </span>
      </WrapperHeaderItem>
    ));
  };

  return (
    <Loading isLoading={isLoading || isLoadingCancel}>
      <WrapperContainer>
        <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
          <h4>Đơn hàng của tôi</h4>
          <WrapperListOrder>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((order) => (
                <WrapperItemOrder key={order?._id}>
                  <WrapperStatus>
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Trạng thái</span>
                    <div>
                      <span style={{ color: 'rgb(255, 66, 78)' }}>Giao hàng: </span>
                      <span style={{ color: 'rgb(90, 32, 193)', fontWeight: 'bold' }}>
                        {`${orderContant.status[order.status]}`}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: 'rgb(255, 66, 78)' }}>Thanh toán: </span>
                      <span style={{ color: 'rgb(90, 32, 193)', fontWeight: 'bold' }}>
                        {`${order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}`}
                      </span>
                    </div>
                  </WrapperStatus>
                  {renderProduct(order?.orderItems)}
                  <WrapperFooterItem>
                    <div>
                      <span style={{ color: 'rgb(255, 66, 78)' }}>Tổng tiền: </span>
                      <span
                        style={{ fontSize: '13px', color: 'rgb(56, 56, 61)', fontWeight: 700 }}
                      >
                        {convertPrice(order?.totalPrice)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {order.status !== 'cancel' && (
                        <ButtonComponent
                          onClick={() => handleCancelOrder(order)}
                          size={40}
                          styleButton={{
                            height: '36px',
                            border: '1px solid #9255FD',
                            borderRadius: '4px'
                          }}
                          textbutton={'Hủy đơn hàng'}
                          styleTextButton={{ color: '#9255FD', fontSize: '14px' }}
                          disabled={order.status === 'shipping' || order.status === 'complete'}
                        />
                      )}
                      <ButtonComponent
                        onClick={() => handleDetailsOrder(order?._id)}
                        size={40}
                        styleButton={{
                          height: '36px',
                          border: '1px solid #9255FD',
                          borderRadius: '4px'
                        }}
                        textbutton={'Xem chi tiết'}
                        styleTextButton={{ color: '#9255FD', fontSize: '14px' }}
                      />
                    </div>
                  </WrapperFooterItem>
                </WrapperItemOrder>
              ))
            ) : (
              <div>No orders found</div>
            )}
          </WrapperListOrder>
        </div>
      </WrapperContainer>
    </Loading>
  );
};

export default MyOrderPage;
