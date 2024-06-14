import { Button, Form, Space, Tabs } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { WrapperHeader, WrapperUploadFile } from './style';
import TableComponent from '../TableComponent/TableComponent';
import InputComponent from '../InputComponent/InputComponent';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import Loading from '../LoadingComponent/Loading';
import ModalComponent from '../ModalComponent/ModalComponent';
import { getBase64 } from '../../utils';
import * as message from '../../components/Message/Message';
import * as UserService from '../../services/UserService';
import { useSelector } from 'react-redux';
import { useMutationHooks } from '../../hooks/useMutationHook';
import { useQuery } from '@tanstack/react-query';
import { DeleteOutlined, EditOutlined, SearchOutlined, UndoOutlined } from '@ant-design/icons';
import moment from 'moment';

const AdminUser = () => {
  const [rowSelected, setRowSelected] = useState('');
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const user = useSelector((state) => state?.user);
  const searchInput = useRef(null);

  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    isAdmin: false,
    avatar: '',
    address: ''
  });

  const [form] = Form.useForm();

  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id, token, ...rests } = data;
      const res = UserService.updateUser(id, { ...rests }, token);
      return res;
    },
  );

  const mutationDeletedMany = useMutationHooks(
    (data) => {
      const { token, ...ids } = data;
      const res = UserService.deleteManyUser(ids, token);
      return res;
    },
  );

  const handleDelteManyUsers = (ids) => {
    mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
      onSettled: () => {
        queryUser.refetch();
      }
    });
  };

  const mutationDeleted = useMutationHooks(
    (data) => {
      const { id, token } = data;
      const res = UserService.deleteUser(id, token);
      return res;
    },
  );

  const getAllUser = async () => {
    const res = await UserService.getAllUser();
    return res;
  };

  const fetchGetDetailsUser = async (rowSelected) => {
    const res = await UserService.getDetailsUser(rowSelected);
    if (res?.data) {
      setStateUserDetails({
        name: res?.data?.name,
        email: res?.data?.email,
        phone: res?.data?.phone,
        isAdmin: res?.data?.isAdmin,
        address: res?.data?.address,
        avatar: res.data?.avatar
      });
    }
    setIsLoadingUpdate(false);
  };

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true);
      fetchGetDetailsUser(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  const handleDetailsUser = () => {
    setIsOpenDrawer(true);
  };

  const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate;
  const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDelected, isError: isErrorDeleted } = mutationDeleted;
  const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDelectedMany, isError: isErrorDeletedMany } = mutationDeletedMany;

  const queryUser = useQuery({ queryKey: ['user'], queryFn: getAllUser });
  const { isLoading: isLoadingUser, data: users } = queryUser;

  const renderAction = (isDelete) => (
    <div>
      {isDelete ? (
        <UndoOutlined
          style={{ color: 'green', fontSize: '30px', cursor: 'pointer' }}
          onClick={() => setIsModalOpenDelete(true)}
        />
      ) : (
        <DeleteOutlined
          style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }}
          onClick={() => setIsModalOpenDelete(true)}
        />
      )}
      <EditOutlined
        style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }}
        onClick={handleDetailsUser}
      />
    </div>
  );

  const formatDate = (dateString) => {
    return moment(dateString).format('YYYY-MM-DD');
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };

  const handleReset = (clearFilters) => {
    clearFilters();
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
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
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
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps('name')
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => a.email.length - b.email.length,
      ...getColumnSearchProps('email')
    },
    {
      title: 'Address',
      dataIndex: 'address',
      sorter: (a, b) => a.address.length - b.address.length,
      ...getColumnSearchProps('address')
    },
    {
      title: 'Admin',
      dataIndex: 'isAdmin',
      filters: [
        {
          text: 'True',
          value: true,
        },
        {
          text: 'False',
          value: false,
        }
      ],
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      sorter: (a, b) => a.phone - b.phone,
      ...getColumnSearchProps('phone')
    },
    {
      title: 'Create At',
      dataIndex: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (createdAt) => formatDate(createdAt),
      ...getColumnSearchProps('createdAt')
    },
    {
      title: 'Update At',
      dataIndex: 'updatedAt',
      sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
      render: (updatedAt) => formatDate(updatedAt),
      ...getColumnSearchProps('updatedAt')
    },
    {
      title: 'Action',
      dataIndex: 'isDelete',
      render: (isDelete) => renderAction(isDelete),
    },
  ];

  const activeUsers = users?.data?.filter(user => !user.isDelete);
  const lockedUsers = users?.data?.filter(user => user.isDelete);

  const dataTable = (data) => data?.map((user) => ({
    ...user, key: user._id, isAdmin: user.isAdmin ? 'TRUE' : 'FALSE'
  }));

  useEffect(() => {
    if (isSuccessDelected && dataDeleted?.status === 'OK') {
      message.success('User status updated successfully');
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error('Error updating user status');
    }
  }, [isSuccessDelected, isErrorDeleted]);

  useEffect(() => {
    if (isSuccessDelectedMany && dataDeletedMany?.status === 'OK') {
      message.success('Users statuses updated successfully');
    } else if (isErrorDeletedMany) {
      message.error('Error updating users statuses');
    }
  }, [isSuccessDelectedMany, isErrorDeletedMany]);

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateUserDetails({
      name: '',
      email: '',
      phone: '',
      isAdmin: false,
    });
    form.resetFields();
  };

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === 'OK') {
      message.success('User updated successfully');
      handleCloseDrawer();
    } else if (isErrorUpdated) {
      message.error('Error updating user');
    }
  }, [isSuccessUpdated, isErrorUpdated]);

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleDeleteUser = () => {
    mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, {
      onSettled: () => {
        queryUser.refetch();
      }
    });
  };

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateUserDetails({
      ...stateUserDetails,
      avatar: file.preview
    });
  };

  const onUpdateUser = () => {
    mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateUserDetails }, {
      onSettled: () => {
        queryUser.refetch();
      }
    });
  };

  const tabItems = [
    {
      key: '1',
      label: 'Tài khoản hoạt động',
      children: (
        <TableComponent
          handleDelteMany={handleDelteManyUsers}
          columns={columns}
          isLoading={isLoadingUser}
          data={dataTable(activeUsers)}
          onRow={(record) => ({
            onClick: () => {
              setRowSelected(record._id);
            },
          })}
        />
      ),
    },
    {
      key: '2',
      label: 'Tài khoản bị khóa',
      children: (
        <TableComponent
          handleDelteMany={handleDelteManyUsers}
          columns={columns}
          isLoading={isLoadingUser}
          data={dataTable(lockedUsers)}
          onRow={(record) => ({
            onClick: () => {
              setRowSelected(record._id);
            },
          })}
        />
      ),
    },
  ];

  return (
    <div>
      <WrapperHeader>Quản lý người dùng</WrapperHeader>
      <div style={{ marginTop: '20px' }}>
        <Tabs defaultActiveKey="1" items={tabItems} />
      </div>
      <DrawerComponent title='Chi tiết người dùng' isOpen={isOpenDrawer} onClose={handleCloseDrawer} width="90%">
        <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
          <Form
            name="basic"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
            onFinish={onUpdateUser}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <InputComponent value={stateUserDetails['name']} onChange={handleOnchangeDetails} name="name" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <InputComponent value={stateUserDetails['email']} onChange={handleOnchangeDetails} name="email" />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: 'Please input your  phone!' }]}
            >
              <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
            </Form.Item>

            <Form.Item
              label="Adress"
              name="address"
              rules={[{ required: true, message: 'Please input your  address!' }]}
            >
              <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
            </Form.Item>

            <Form.Item
              label="Avatar"
              name="avatar"
              rules={[{ required: true, message: 'Please input your image!' }]}
            >
              <WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1}>
                <Button>Select File</Button>
                {stateUserDetails?.avatar && (
                  <img src={stateUserDetails?.avatar} style={{
                    height: '60px',
                    width: '60px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginLeft: '10px'
                  }} alt="avatar" />
                )}
              </WrapperUploadFile>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Apply
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>
      <ModalComponent title="Thay đổi trạng thái người dùng" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteUser}>
        <Loading isLoading={isLoadingDeleted}>
          <div>Bạn có chắc muốn thay đổi trạng thái của tài khoản này không?</div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default AdminUser;
