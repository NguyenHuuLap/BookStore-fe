import { Button, Form, Select, Space } from 'antd'
import React from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import Loading from '../LoadingComponent/Loading'
import ModalComponent from '../ModalComponent/ModalComponent'
import { convertPrice, getBase64 } from '../../utils'
import { useEffect } from 'react'
import * as message from '../Message/Message'

import * as OrderService from '../../services/OrderService'
import { useQuery } from '@tanstack/react-query'
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { orderContant } from '../../contant'
import PieChartComponent from './PieChart'
import { useState } from 'react'
import { useRef } from 'react'
import { useMutationHooks } from '../../hooks/useMutationHook'

const OrderAdmin = () => {
  const user = useSelector((state) => state?.user)
  const [rowSelected, setRowSelected] = useState('')
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)

  const searchInput = useRef(null);

  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token)
    return res
  }

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
  })

  const [form] = Form.useForm();

  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id,
        token,
        ...rests } = data
      const res = OrderService.updateOrder(
        id,
        { ...rests }, token)
      return res
    },
  )

  const fetchGetDetailsUser = async (rowSelected) => {
    const res = await OrderService.getDetailsOrder(rowSelected)
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
      })
    }
    setIsLoadingUpdate(false)
  }

  useEffect(() => {
    form.setFieldsValue(stateOrderDetails)
  }, [form, stateOrderDetails])

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true)
      fetchGetDetailsUser(rowSelected)
    }
  }, [rowSelected, isOpenDrawer])

  const handleDetailsUser = () => {
    setIsOpenDrawer(true)

  }
  const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate

  const queryOrder = useQuery({ queryKey: ['orders'], queryFn: getAllOrder })
  const { isLoading: isLoadingOrders, data: orders } = queryOrder
  const renderAction = () => {
    return (
      <div>
        <EditOutlined style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }} onClick={handleDetailsUser} />
      </div>
    )
  }

  const handleOnchangeDetails = (e) => {
    setStateOrderDetails({
      ...stateOrderDetails,
      [e.target.name]: e.target.value
    })
  }

  const handleChangeSelect = (value) => {
    setStateOrderDetails({
      ...stateOrderDetails,
      status: value
    })
  }

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          // ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          // onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            // onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            // onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
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
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        // setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     // <Highlighter
    //     //   highlightStyle={{
    //     //     backgroundColor: '#ffc069',
    //     //     padding: 0,
    //     //   }}
    //     //   searchWords={[searchText]}
    //     //   autoEscape
    //     //   textToHighlight={text ? text.toString() : ''}
    //     // />
    //   ) : (
    //     text
    //   ),
  });

  const columns = [
    {
      title: 'Tên tài khoản',
      dataIndex: 'userName',
      sorter: (a, b) => a.userName.length - b.userName.length,
      ...getColumnSearchProps('userName')
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      sorter: (a, b) => a.phone.length - b.phone.length,
      ...getColumnSearchProps('phone')
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      sorter: (a, b) => a.address.length - b.address.length,
      ...getColumnSearchProps('address')
    },
    {
      title: 'Thanh toán',
      dataIndex: 'isPaid',
      sorter: (a, b) => a.isPaid.length - b.isPaid.length,
      ...getColumnSearchProps('isPaid')
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      sorter: (a, b) => a.status.length - b.status.length,
      ...getColumnSearchProps('status')
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'paymentMethod',
      sorter: (a, b) => a.paymentMethod.length - b.paymentMethod.length,
      ...getColumnSearchProps('paymentMethod')
    },
    {
      title: 'Tổng đơn hàng',
      dataIndex: 'totalPrice',
      sorter: (a, b) => a.totalPrice.length - b.totalPrice.length,
      ...getColumnSearchProps('totalPrice')
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: renderAction
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
    })
    form.resetFields()
  };

  const onUpdateOrder = () => {
    const updateData = { id: rowSelected, token: user?.access_token, ...stateOrderDetails };
    mutationUpdate.mutate(updateData, {
      onSettled: () => {
        queryOrder.refetch();
      },
    });
  }

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === 'OK') {
      message.success('Cập nhật thành công')
      handleCloseDrawer()
    } else if (isSuccessUpdated && dataUpdated?.status == 'ERR' && dataUpdated?.message == 'Cannot update status because the current status is complete') {
      message.error('Đơn hàng đã hoàn tất không thể thay đổi')
      handleCloseDrawer()
    }
    else if (isSuccessUpdated && dataUpdated?.status == 'ERR' && dataUpdated?.message == 'Cannot update status because the current status is cancel') {
      message.error('Đơn hàng đã hủy không thể thay đổi')
      handleCloseDrawer()
    }
  }, [isSuccessUpdated])

  const dataTable = orders?.data?.length && orders?.data?.map((order) => {
    return { ...order, key: order._id, userName: order?.shippingAddress?.fullName, phone: order?.shippingAddress?.phone, address: order?.shippingAddress?.address, paymentMethod: orderContant.payment[order?.paymentMethod], isPaid: orderContant.Paid[order?.isPaid], status: orderContant?.status[order?.status], totalPrice: convertPrice(order?.totalPrice) }
  })

  return (
    <div>
      <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
      <div style={{ height: 200, width: 200 }}>
        <PieChartComponent data={orders?.data} />
      </div>
      <div style={{ marginTop: '20px' }}>
        <TableComponent columns={columns} isLoading={isLoadingOrders} data={dataTable} onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              setRowSelected(record._id)
            }
          };
        }} />
      </div>
      <DrawerComponent title='Chi tiết người dùng' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="90%">
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
              <InputComponent value={stateOrderDetails.status} onChange={handleOnchangeDetails} name="status" />
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
  )
}

export default OrderAdmin