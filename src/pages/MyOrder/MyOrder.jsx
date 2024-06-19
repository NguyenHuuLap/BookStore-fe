import React, { useEffect, useState } from 'react';
import { Tabs, Button } from 'antd';
import Loading from '../../components/LoadingComponent/Loading';
import { useQuery } from '@tanstack/react-query';
import * as OrderService from '../../services/OrderService';
import { useSelector } from 'react-redux';
import { convertPrice } from '../../utils';
import {
  WrapperItemOrder,
  WrapperListOrder,
  WrapperHeaderItem,
  WrapperFooterItem,
  WrapperContainer,
  WrapperStatus,
  orderStatusColors
} from './style';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as message from '../../components/Message/Message';
import { orderContant } from '../../contant';

const { TabPane } = Tabs;

const MyOrderPage = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('all');

  const fetchMyOrder = async () => {
    if (state?.id && state?.token) {
      const res = await OrderService.getOrderByUserId(state.id, state.token);
      return Array.isArray(res.data) ? res.data : [];
    }
    return [];
  };

  const user = useSelector((state) => state.user);

  const queryOrder = useQuery({
    queryKey: ['orders'],
    queryFn: fetchMyOrder,
    enabled: !!state?.id && !!state?.token,
    initialData: [] // Ensure initial data is an empty array
  });

  const { isLoading, data: orders = [] } = queryOrder; // Ensure orders is an array

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

  const mutationComplete = useMutationHooks(
    (data) => {
      const { id, token, orderItems, userId } = data;
      return OrderService.completeOrder(id, token, orderItems, userId); // Assume this service exists
    }
  );

  const handleCompleteOrder = (order) => {
    mutationComplete.mutate({ id: order._id, token: state?.token, orderItems: order?.orderItems, userId: user.id }, {
      onSuccess: () => {
        queryOrder.refetch();
      },
    });
  };

  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id, orderData, token } = data;
      return OrderService.updateOrder(id, orderData, token);
    }
  );

  const handleUpdateOrder = (order) => {
    mutationUpdate.mutate({
      id: order._id,
      orderData: { status: 'complete' },
      token: state?.token
    }, {
      onSuccess: () => {
        queryOrder.refetch();
        message.success('Xác nhận đơn hàng thành công');
      },
      onError: () => {
        message.error('Failed to update order');
      }
    });
  };

  const { isLoading: isLoadingCancel, isSuccess: isSuccessCancel, isError: isErrorCancel, data: dataCancel } = mutation;
  const { isLoading: isLoadingComplete, isSuccess: isSuccessComplete, isError: isErrorComplete, data: dataComplete } = mutationComplete;
  const { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate, isError: isErrorUpdate, data: dataUpdate } = mutationUpdate;

  useEffect(() => {
    if (isSuccessCancel && dataCancel?.status === 'OK') {
      message.success();
    } else if (isSuccessCancel && dataCancel?.status === 'ERR') {
      message.error(dataCancel?.message);
    } else if (isErrorCancel) {
      message.error();
    }
  }, [isErrorCancel, isSuccessCancel, dataCancel]);

  const renderProduct = (orderItems) => {
    return orderItems?.map((order) => (
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

  const filterOrders = (orders, status) => {
    // Ensure orders is always an array
    if (!Array.isArray(orders)) {
      return [];
    }

    if (status === 'all') return orders;
    // Filter for both 'confirm' and 're-cancel' statuses
    if (status === 'confirm-re-cancel') {
      return orders.filter(order => order.status === 'confirm' || order.status === 're-cancel');
    }
    return orders.filter(order => order.status === status);
  };

  const renderOrders = (orders) => {
    return orders.map((order) => (
      <WrapperItemOrder key={order?._id}>
        <WrapperStatus>
          <span style={{
            background: orderStatusColors[order.status].background,
            color: orderStatusColors[order.status].color,
            fontWeight: 'bold',
            borderColor: orderStatusColors[order.status].borderColor
          }}>
            {`${orderContant.status[order.status]}`}
          </span>
        </WrapperStatus>
        {renderProduct(order?.orderItems)}
        <WrapperFooterItem>
          <div>
            <span style={{ color: '#7A7E7F' }}>Tổng tiền: </span>
            <span
              style={{ fontSize: '13px', fontWeight: '600', color: 'rgb(56, 56, 61)'}}
            >
              {convertPrice(order?.totalPrice)}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
          {order.status !== 'cancel' && order.status !== 'shipping' && order.status !== 'complete' && order.status !== 're-cancel' && (
              <Button
                onClick={() => handleCancelOrder(order)}
                style={{
                  height: '36px',
                  border: `1px solid #FF4250`,
                  borderRadius: '4px',
                  color: '#FF4250',
                  fontSize: '14px'
                }}
              >
                Hủy đơn hàng
              </Button>
            )}
            <Button
              onClick={() => handleDetailsOrder(order?._id)}
              style={{
                height: '36px',
                border: `1px solid #2489F4`,
                borderRadius: '4px',
                color: '#2489F4',
                fontSize: '14px'
              }}
            >
              Xem chi tiết
            </Button>
            {order.status === 'shipping' && (
              <Button
                onClick={() => handleUpdateOrder(order)}
                style={{
                  height: '36px',
                  border: `1px solid ${orderStatusColors[order.status].borderColor}`,
                  borderRadius: '4px',
                  color: orderStatusColors[order.status].color,
                  fontSize: '14px'
                }}
              >
                Xác nhận đơn hàng
              </Button>
            )}
          </div>
        </WrapperFooterItem>
      </WrapperItemOrder>
    ));
  };

  return (
    <Loading isLoading={isLoading || isLoadingCancel || isLoadingComplete || isLoadingUpdate}>
      <WrapperContainer>
        <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
          <h4>Đơn hàng của tôi</h4>
          <Tabs defaultActiveKey="all" onChange={setSelectedTab}>
            <TabPane tab={`Tất cả (${filterOrders(orders, 'all').length})`} key="all">
              <WrapperListOrder>
                {orders.length > 0 ? (
                  renderOrders(filterOrders(orders, 'all'))
                ) : (
                  <div>No orders found</div>
                )}
              </WrapperListOrder>
            </TabPane>
            <TabPane tab={`Chờ xác nhận (${filterOrders(orders, 'pending').length})`} key="pending">
              <WrapperListOrder>
                {orders.length > 0 ? (
                  renderOrders(filterOrders(orders, 'pending'))
                ) : (
                  <div>No orders found</div>
                )}
              </WrapperListOrder>
            </TabPane>
            <TabPane tab={`Đã xác nhận (${filterOrders(orders, 'confirm-re-cancel').length})`} key="confirm-re-cancel">
              <WrapperListOrder>
                {orders.length > 0 ? (
                  renderOrders(filterOrders(orders, 'confirm-re-cancel'))
                ) : (
                  <div>No orders found</div>
                )}
              </WrapperListOrder>
            </TabPane>
            <TabPane tab={`Đang giao (${filterOrders(orders, 'shipping').length})`} key="shipping">
              <WrapperListOrder>
                {orders.length > 0 ? (
                  renderOrders(filterOrders(orders, 'shipping'))
                ) : (
                  <div>No orders found</div>
                )}
              </WrapperListOrder>
            </TabPane>
            <TabPane tab={`Đã giao (${filterOrders(orders, 'complete').length})`} key="complete">
              <WrapperListOrder>
                {orders.length > 0 ? (
                  renderOrders(filterOrders(orders, 'complete'))
                ) : (
                  <div>No orders found</div>
                )}
              </WrapperListOrder>
            </TabPane>
            <TabPane tab={`Đã hủy (${filterOrders(orders, 'cancel').length})`} key="cancel">
              <WrapperListOrder>
                {orders.length > 0 ? (
                  renderOrders(filterOrders(orders, 'cancel'))
                ) : (
                  <div>No orders found</div>
                )}
              </WrapperListOrder>
            </TabPane>
          </Tabs>
        </div>
      </WrapperContainer>
    </Loading>
  );
};

export default MyOrderPage;
