import { Button, Form, Select, Space, Tabs } from 'antd';
import React, { useState, useRef } from 'react';
import { WrapperHeader } from './style';
import TableComponent from '../TableComponent/TableComponent';
import InputComponent from '../InputComponent/InputComponent';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import Loading from '../LoadingComponent/Loading';
import { convertPrice } from '../../utils';
import { useEffect } from 'react';
import * as message from '../Message/Message';
import * as OrderService from '../../services/OrderService';
import { useQuery } from '@tanstack/react-query';
import { EditOutlined, SearchOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { orderContant } from '../../contant';
import PieChartComponent from './PieChart';
import { useMutationHooks } from '../../hooks/useMutationHook';
import StatusPieChartComponent from './StatusPieChartComponent';
import moment from 'moment';

const { TabPane } = Tabs;

const OrderAdmin = () => {
  const user = useSelector((state) => state?.user);
  const [rowSelected, setRowSelected] = useState('');
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const searchInput = useRef(null);

  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token);
    return res;
  };

  const [stateOrderDetails, setStateOrderDetails] = useState({
    user: '',
    totalPrice: '',
    status: 'pending',
    shippingPrice: '',
    shippingAddress: '',
    paymentMethod: '',
    orderItems: '',
    itemsPrice: '',
    isPaid: false,
  });

  const [form] = Form.useForm();

  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id, token, ...rests } = data;
      const res = OrderService.updateOrder(id, { ...rests }, token);
      return res;
    },
  );

  const fetchGetDetailsOrder = async (rowSelected) => {
    const res = await OrderService.getDetailsOrder(rowSelected);
    if (res?.data) {
      setStateOrderDetails({
        user: res?.data?.user,
        totalPrice: res?.data?.totalPrice,
        status: res?.data?.status,
        shippingPrice: res?.data?.shippingPrice,
        shippingAddress: res?.data?.shippingAddress,
        paymentMethod: res.data?.paymentMethod,
        orderItems: res.data?.orderItems,
        itemsPrice: res.data?.itemsPrice,
        isPaid: res.data?.isPaid,
      });
    }
    setIsLoadingUpdate(false);
  };

  useEffect(() => {
    form.setFieldsValue(stateOrderDetails);
  }, [form, stateOrderDetails]);

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true);
      fetchGetDetailsOrder(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  const handleDetailsUser = () => {
    setIsOpenDrawer(true);
  };

  const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate;

  const queryOrder = useQuery({ queryKey: ['orders'], queryFn: getAllOrder });
  const { isLoading: isLoadingOrders, data: orders } = queryOrder;

  const renderAction = () => {
    return (
      <div>
        <EditOutlined style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }} onClick={handleDetailsUser} />
      </div>
    );
  };

  const handleOnchangeDetails = (e) => {
    setStateOrderDetails({
      ...stateOrderDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeSelect = (value) => {
    setStateOrderDetails({
      ...stateOrderDetails,
      status: value,
    });
  };

  const formatDate = (dateString) => {
    return moment(dateString).format('YYYY-MM-DD');
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
      render: (createdAt) => formatDate(createdAt),
      ...getColumnSearchProps('createdAt'),
    },
    {
      title: 'Update At',
      dataIndex: 'updatedAt',
      sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
      render: (updatedAt) => formatDate(updatedAt),
      ...getColumnSearchProps('updatedAt'),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: renderAction,
    },
  ];

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateOrderDetails({
      user: '',
      totalPrice: '',
      status: 'pending',
      shippingPrice: '',
      shippingAddress: '',
      paymentMethod: '',
      orderItems: '',
      itemsPrice: '',
      isPaid: false,
    });
    form.resetFields();
  };

  const onUpdateOrder = () => {
    const updateData = { id: rowSelected, token: user?.access_token, ...stateOrderDetails };
    mutationUpdate.mutate(updateData, {
      onSettled: () => {
        queryOrder.refetch();
      },
    });
  };

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === 'OK') {
      message.success('Cập nhật thành công');
      handleCloseDrawer();
    } else if (isSuccessUpdated && dataUpdated?.status == 'ERR' && dataUpdated?.message == 'Cannot update status because the current status is complete') {
      message.error('Đơn hàng đã hoàn tất không thể thay đổi');
      handleCloseDrawer();
    } else if (isSuccessUpdated && dataUpdated?.status == 'ERR' && dataUpdated?.message == 'Cannot update status because the current status is cancel') {
      message.error('Đơn hàng đã hủy không thể thay đổi');
      handleCloseDrawer();
    }
  }, [isSuccessUpdated]);

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
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ height: 200, width: 200 }}>
          <PieChartComponent data={orders?.data || []} />
        </div>
        <div style={{ height: 200, width: 200 }}>
          <StatusPieChartComponent data={orders?.data || []} />
        </div>
      </div>
      <Tabs defaultActiveKey="all" onChange={(key) => setActiveTab(key)}>
        <TabPane tab={`Tất cả (${countOrdersByStatus('all')})`} key="all">
          <TableComponent columns={columns} isLoading={isLoadingOrders} data={dataTable} onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
              },
            };
          }} />
        </TabPane>
        <TabPane tab={`Chưa xác nhận (${countOrdersByStatus('pending')})`} key="pending">
          <TableComponent columns={columns} isLoading={isLoadingOrders} data={dataTable} onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
              },
            };
          }} />
        </TabPane>
        <TabPane tab={`Đã xác nhận (${countOrdersByStatus('confirm')})`} key="confirm">
          <TableComponent columns={columns} isLoading={isLoadingOrders} data={dataTable} onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
              },
            };
          }} />
        </TabPane>
        <TabPane tab={`Đã hoàn thành (${countOrdersByStatus('complete')})`} key="complete">
          <TableComponent columns={columns} isLoading={isLoadingOrders} data={dataTable} onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
              },
            };
          }} />
        </TabPane>
        <TabPane tab={`Đã hủy (${countOrdersByStatus('cancel')})`} key="cancel">
          <TableComponent columns={columns} isLoading={isLoadingOrders} data={dataTable} onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
              },
            };
          }} />
        </TabPane>
      </Tabs>
      <DrawerComponent title='Chi tiết đơn hàng' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="90%">
        <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
          <Form
            name="basic"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
            onFinish={onUpdateOrder}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[{ required: true, message: 'Vui lòng điền trạng thái đơn hàng!' }]}
            >
              <Select value={stateOrderDetails.status} onChange={handleChangeSelect}>
                {Object.entries(orderContant.status).map(([key, value]) => (
                  <Select.Option key={key} value={key}>
                    {value}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Apply
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>
    </div>
  );
};

export default OrderAdmin;
