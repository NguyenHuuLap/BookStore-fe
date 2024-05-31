import { Button, Form, Select, Space, Tabs, notification } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { WrapperHeader } from './style';
import TableComponent from '../TableComponent/TableComponent';
import InputComponent from '../InputComponent/InputComponent';
import Loading from '../LoadingComponent/Loading';
import { convertPrice } from '../../utils';
import * as message from '../Message/Message';
import * as OrderService from '../../services/OrderService';
import { useQuery } from '@tanstack/react-query';
import { EditOutlined, SearchOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { orderContant } from '../../contant';
import { useMutationHooks } from '../../hooks/useMutationHook';
import moment from 'moment';

const { TabPane } = Tabs;

const OrderAdmin = () => {
  const user = useSelector((state) => state?.user);
  const [activeTab, setActiveTab] = useState('all');

  const searchInput = useRef(null);

  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token);
    return res;
  };

  const [form] = Form.useForm();

  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id, token, ...rests } = data;
      const res = OrderService.updateOrder(id, { ...rests }, token);
      return res;
    },
  );

  const queryOrder = useQuery({ queryKey: ['orders'], queryFn: getAllOrder });
  const { isLoading: isLoadingOrders, data: orders } = queryOrder;

  const handleUpdateOrder = async (orderId) => {
    const res = await OrderService.getDetailsOrder(orderId);
    if (res?.data) {
      const updatedOrder = {
        ...res.data,
        // Change this to the desired status or pass it as a parameter.
      };

      mutationUpdate.mutate(
        { id: orderId, token: user?.access_token, ...updatedOrder },
        {
          onSuccess: (response) => {
            if (response.status === 'OK') {
              notification.success({
                message: 'Success',
                description: response.message,
              });
              queryOrder.refetch();
            } else {
              notification.error({
                message: 'Error',
                description: response.message,
              });
            }
          },
          onError: (error) => {
            notification.error({
              message: 'Error',
              description: `Failed to update order status: ${error.message}`,
            });
          },
        }
      );
    }
  };

  const renderAction = (order) => {
    return (
      <div>
        <EditOutlined
          style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }}
          onClick={() => handleUpdateOrder(order._id)}
        />
      </div>
    );
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
            onClick={() => confirm()}
          >
            Search
          </Button>
          <Button
            size="small"
            style={{
              width: 90,
            }}
            onClick={() => clearFilters()}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
  });

  const columns = [
    {
      title: 'Tên tài khoản',
      dataIndex: 'userName',
      sorter: (a, b) => a.userName.length - b.userName.length,
      ...getColumnSearchProps('userName'),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      sorter: (a, b) => a.phone.length - b.phone.length,
      ...getColumnSearchProps('phone'),
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      sorter: (a, b) => a.address.length - b.address.length,
      ...getColumnSearchProps('address'),
    },
    {
      title: 'Thanh toán',
      dataIndex: 'isPaid',
      sorter: (a, b) => a.isPaid.length - b.isPaid.length,
      ...getColumnSearchProps('isPaid'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      sorter: (a, b) => a.status.length - b.status.length,
      ...getColumnSearchProps('status'),
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'paymentMethod',
      sorter: (a, b) => a.paymentMethod.length - b.paymentMethod.length,
      ...getColumnSearchProps('paymentMethod'),
    },
    {
      title: 'Tổng đơn hàng',
      dataIndex: 'totalPrice',
      sorter: (a, b) => a.totalPrice.length - b.totalPrice.length,
      ...getColumnSearchProps('totalPrice'),
    },
    {
      title: 'Create At',
      dataIndex: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (createdAt) => moment(createdAt).format('YYYY-MM-DD'),
      ...getColumnSearchProps('createdAt'),
    },
    {
      title: 'Update At',
      dataIndex: 'updatedAt',
      sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
      render: (updatedAt) => moment(updatedAt).format('YYYY-MM-DD'),
      ...getColumnSearchProps('updatedAt'),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (text, order) => renderAction(order),
    },
  ];

  const filterOrdersByStatus = (status) => {
    if (status === 'all') {
      return orders?.data;
    }
    return orders?.data?.filter((order) => order.status === status);
  };

  const countOrdersByStatus = (status) => {
    if (status === 'all') {
      return orders?.data?.length || 0;
    }
    return orders?.data?.filter((order) => order.status === status).length || 0;
  };

  const dataTable = filterOrdersByStatus(activeTab)?.length
    ? filterOrdersByStatus(activeTab).map((order) => {
        return {
          ...order,
          key: order._id,
          userName: order?.shippingAddress?.fullName,
          phone: order?.shippingAddress?.phone,
          address: order?.shippingAddress?.address,
          paymentMethod: orderContant.payment[order?.paymentMethod],
          isPaid: orderContant.Paid[order?.isPaid],
          status: orderContant?.status[order?.status],
          totalPrice: convertPrice(order?.totalPrice),
        };
      })
    : [];

  return (
    <div>
      <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
      
      <Tabs defaultActiveKey="all" onChange={(key) => setActiveTab(key)}>
        <TabPane tab={`Tất cả (${countOrdersByStatus('all')})`} key="all">
          <TableComponent columns={columns} isLoading={isLoadingOrders} data={dataTable} onRow={(record, rowIndex) => {
            return {
              onClick: () => {
                // Set the row as selected
              },
            };
          }} />
        </TabPane>
        <TabPane tab={`Chưa xác nhận (${countOrdersByStatus('pending')})`} key="pending">
          <TableComponent columns={columns} isLoading={isLoadingOrders} data={dataTable} onRow={(record, rowIndex) => {
            return {
              onClick: () => {
                // Set the row as selected
              },
            };
          }} />
        </TabPane>
        <TabPane tab={`Đã xác nhận (${countOrdersByStatus('confirm')})`} key="confirm">
          <TableComponent columns={columns} isLoading={isLoadingOrders} data={dataTable} onRow={(record, rowIndex) => {
            return {
              onClick: () => {
                // Set the row as selected
              },
            };
          }} />
        </TabPane>
        <TabPane tab={`Đang giao hàng (${countOrdersByStatus('shipping')})`} key="shipping">
          <TableComponent columns={columns} isLoading={isLoadingOrders} data={dataTable} onRow={(record, rowIndex) => {
            return {
              onClick: () => {
                // Set the row as selected
              },
            };
          }} />
        </TabPane>
        <TabPane tab={`Đã hoàn thành (${countOrdersByStatus('complete')})`} key="complete">
          <TableComponent columns={columns} isLoading={isLoadingOrders} data={dataTable} onRow={(record, rowIndex) => {
            return {
              onClick: () => {
                // Set the row as selected
              },
            };
          }} />
        </TabPane>
        <TabPane tab={`Đã hủy (${countOrdersByStatus('cancel')})`} key="cancel">
          <TableComponent columns={columns} isLoading={isLoadingOrders} data={dataTable} onRow={(record, rowIndex) => {
            return {
              onClick: () => {
                // Set the row as selected
              },
            };
          }} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default OrderAdmin;
