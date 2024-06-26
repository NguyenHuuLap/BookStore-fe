import { Button, Form, Space, Tabs } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@tanstack/react-query';
import { DeleteOutlined, EditOutlined, SearchOutlined, UndoOutlined } from '@ant-design/icons';
import { WrapperHeader } from './style';
import TableComponent from '../TableComponent/TableComponent';
import InputComponent from '../InputComponent/InputComponent';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import Loading from '../LoadingComponent/Loading';
import ModalComponent from '../ModalComponent/ModalComponent';
import * as message from '../../components/Message/Message';
import * as CommentService from '../../services/CommentService';
import moment from 'moment';

const AdminComment = () => {
  const [rowSelected, setRowSelected] = useState('');
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const user = useSelector((state) => state.user);
  const searchInput = useRef(null);

  const [stateCommentDetails, setStateCommentDetails] = useState({
    user: '',
    product: '',
    comment: '',
    star: '',
  });

  const [form] = Form.useForm();

  const mutationUpdate = useMutation((data) => {
    const { id, token, ...rests } = data;
    return CommentService.updateComment(id, { ...rests }, token);
  });

  const mutationDeletedMany = useMutation((data) => {
    const { token, ...ids } = data;
    return CommentService.deleteManyComment(ids, token);
  });

  const handleDelteManyComment = (ids) => {
    mutationDeletedMany.mutate(
      { ids, token: user?.access_token },
      {
        onSettled: () => {
          queryComment.refetch();
        },
      }
    );
  };

  const mutationDeleted = useMutation((data) => {
    const { id, token } = data;
    return CommentService.deleteComment(id, token);
  });

  const getAllComments = async () => {
    return await CommentService.getAllComment();
  };

  const fetchGetDetailsComment = async (rowSelected) => {
    const res = await CommentService.getDetailsComment(rowSelected);
    if (res?.data) {
      setStateCommentDetails({
        user: res.data.user,
        product: res.data.product,
        comment: res.data.comment,
        star: res.data.star,
      });
    }
    setIsLoadingUpdate(false);
  };

  useEffect(() => {
    form.setFieldsValue(stateCommentDetails);
  }, [form, stateCommentDetails]);

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true);
      fetchGetDetailsComment(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  const handleDetailsComment = () => {
    setIsOpenDrawer(true);
  };

  const queryComment = useQuery({ queryKey: ['comments'], queryFn: getAllComments });
  const { isLoading: isLoadingComment, data: comments } = queryComment;

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
        onClick={handleDetailsComment}
      />
    </div>
  );

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };

  const handleReset = (clearFilters) => {
    clearFilters();
  };

  const formatDate = (dateString) => {
    return moment(dateString).format('YYYY-MM-DD');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns = [
    {
      title: 'User name',
      dataIndex: ['user', 'name'],
      sorter: (a, b) => a.user.name.length - b.user.name.length,
      ...getColumnSearchProps(['user', 'name']),
    },
    {
      title: 'Product Name',
      dataIndex: ['product', 'name'],
      sorter: (a, b) => a.product.name.length - b.product.name.length,
      ...getColumnSearchProps(['product', 'name']),
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      sorter: (a, b) => a.comment.length - b.comment.length,
      ...getColumnSearchProps('comment'),
    },
    {
      title: 'Star',
      dataIndex: 'star',
      sorter: (a, b) => a.star - b.star,
      ...getColumnSearchProps('star'),
    },
    {
      title: 'Create At',
      dataIndex: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (createdAt) => formatDate(createdAt), // Format date for display
      ...getColumnSearchProps('createdAt')
    },
    {
      title: 'Update At',
      dataIndex: 'updatedAt',
      sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
      render: (updatedAt) => formatDate(updatedAt), // Format date for display
      ...getColumnSearchProps('updatedAt')
    },
    {
      title: 'Action',
      dataIndex: 'isDelete',
      render: (isDelete) => renderAction(isDelete),
    },
  ];

  const activeComments = comments?.data?.filter(comment => !comment.isDelete);
  const hiddenComments = comments?.data?.filter(comment => comment.isDelete);

  const dataTable = (data) => data?.map((comment) => ({
    ...comment,
    key: comment._id,
  }));

  useEffect(() => {
    if (mutationDeleted.isSuccess && mutationDeleted.data?.status === 'OK') {
      message.success('Comment status updated successfully');
      handleCancelDelete();
    } else if (mutationDeleted.isError) {
      message.error('Error updating comment status');
    }
  }, [mutationDeleted.isSuccess, mutationDeleted.isError]);

  useEffect(() => {
    if (mutationDeletedMany.isSuccess && mutationDeletedMany.data?.status === 'OK') {
      message.success('Comments statuses updated successfully');
    } else if (mutationDeletedMany.isError) {
      message.error('Error updating comments statuses');
    }
  }, [mutationDeletedMany.isSuccess, mutationDeletedMany.isError]);

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateCommentDetails({
      user: '',
      product: '',
      comment: '',
      star: '',
    });
    form.resetFields();
  };

  useEffect(() => {
    if (mutationUpdate.isSuccess && mutationUpdate.data?.status === 'OK') {
      message.success('Comment updated successfully');
      handleCloseDrawer();
    } else if (mutationUpdate.isError) {
      message.error('Error updating comment');
    }
  }, [mutationUpdate.isSuccess, mutationUpdate.isError]);

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleDeleteComment = () => {
    mutationDeleted.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryComment.refetch();
        },
      }
    );
  };

  const handleOnchangeDetails = (e) => {
    const { name, value } = e.target;
    setStateCommentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const onUpdateComment = () => {
    mutationUpdate.mutate(
      { id: rowSelected, token: user?.access_token, ...stateCommentDetails },
      {
        onSettled: () => {
          queryComment.refetch();
        },
      }
    );
  };

  const tabItems = [
    {
      key: '1',
      label: 'Hiển thị',
      children: (
        <TableComponent
          handleDelteMany={handleDelteManyComment}
          columns={columns}
          isLoading={isLoadingComment}
          data={dataTable(activeComments)}
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
      label: 'Bị ẩn',
      children: (
        <TableComponent
          handleDelteMany={handleDelteManyComment}
          columns={columns}
          isLoading={isLoadingComment}
          data={dataTable(hiddenComments)}
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
      <WrapperHeader>Quản lý đánh giá</WrapperHeader>
      <div style={{ marginTop: '20px' }}>
        <Tabs defaultActiveKey="1" items={tabItems} />
      </div>
      <DrawerComponent title="Chi tiết đánh giá" isOpen={isOpenDrawer} onClose={handleCloseDrawer} width="90%">
        <Loading isLoading={isLoadingUpdate || mutationUpdate.isLoading}>
          <Form
            name="basic"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
            onFinish={onUpdateComment}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="User Name"
              name="user"
              rules={[{ required: true, message: 'Please input user name!' }]}
            >
              <InputComponent value={stateCommentDetails.user} disabled />
            </Form.Item>

            <Form.Item
              label="Product Name"
              name="product"
              rules={[{ required: true, message: 'Please input product name!' }]}
            >
              <InputComponent value={stateCommentDetails.product} disabled />
            </Form.Item>

            <Form.Item
              label="Comment"
              name="comment"
              rules={[{ required: true, message: 'Please input comment!' }]}
            >
              <InputComponent value={stateCommentDetails.comment} onChange={handleOnchangeDetails} name="comment" />
            </Form.Item>

            <Form.Item
              label="Star"
              name="star"
              rules={[{ required: true, message: 'Please input star!' }]}
            >
              <InputComponent value={stateCommentDetails.star} onChange={handleOnchangeDetails} name="star" />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Apply
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>
      <ModalComponent
        title="Thay đổi trạng thái đánh giá"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteComment}
      >
        <Loading isLoading={mutationDeleted.isLoading}>
          <div>Bạn có chắc muốn thay đổi trạng thái của đánh giá này không?</div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default AdminComment;
